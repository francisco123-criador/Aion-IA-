import 'server-only'
import { NextRequest } from 'next/server'
import { handleApiError } from '@/lib/api-error-response'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const SYSTEM_PROMPT = `Você é a Aion, uma assistente de IA inteligente, gratuita e ilimitada.
Você foi criada por Francisco jerbesson de Freitas morais.
Responda sempre com clareza, objetividade e cordialidade, em português quando o
usuário falar português. Use formatação em markdown quando ajudar.`

function buildMessages(history: ChatMessage[]) {
  const system = { role: 'system', content: SYSTEM_PROMPT }
  return [system, ...history].map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content,
  }))
}

/**
 * Streams SSE events from the Anthropic-protocol gateway and yields only the
 * incremental text deltas, so the client receives a plain text stream.
 */
async function* streamGateway(
  baseUrl: string,
  apiKey: string,
  model: string,
  history: ChatMessage[]
): AsyncGenerator<string> {
  const res = await fetch(`${baseUrl}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'x-bty-business': 'ReActUs',
      'x-bty-workspace': 'default',
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      stream: true,
      messages: buildMessages(history),
    }),
  })

  if (!res.ok || !res.body) {
    let detail = `Gateway responded with ${res.status}`
    try {
      detail += `: ${await res.text()}`
    } catch {
      // ignore body read failure
    }
    throw new Error(detail)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    // Anthropic streams `event:` / `data:` blocks separated by blank lines.
    let sep: number
    while ((sep = buffer.indexOf('\n\n')) !== -1) {
      const block = buffer.slice(0, sep)
      buffer = buffer.slice(sep + 2)
      const dataLine = block
        .split('\n')
        .find((line) => line.startsWith('data:'))
      if (!dataLine) continue
      const data = dataLine.slice(5).trim()
      if (!data || data === '[DONE]') continue
      try {
        const parsed = JSON.parse(data)
        if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
          yield parsed.delta.text
        }
      } catch {
        // Ignore malformed chunks; keep streaming.
      }
    }
  }
}

export async function POST(req: NextRequest) {
  const baseUrl = process.env.BTY_LLM_SERVER_BASE_URL
  const apiKey = process.env.BTY_LLM_SERVER_API_KEY
  const allowed = process.env.HAPPYSEEDS_AVAILABLE_MODELS?.split(',') ?? []
  const model =
    process.env.AION_CHAT_MODEL ?? (allowed.includes('claude-sonnet-4.6') ? 'claude-sonnet-4.6' : allowed[0])

  try {
    if (!baseUrl || !apiKey) {
      return new Response(JSON.stringify({ success: false, error: 'Chat service is not configured' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const body = (await req.json()) as { messages?: ChatMessage[] }
    const history = Array.isArray(body.messages) ? body.messages : []

    const encoder = new TextEncoder()

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of streamGateway(baseUrl, apiKey, model, history)) {
            controller.enqueue(encoder.encode(chunk))
          }
        } catch (err) {
          const msg =
            err instanceof Error
              ? err.message
              : 'Falha ao gerar resposta. Tente novamente.'
          controller.enqueue(encoder.encode(`\n[Erro] ${msg}`))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
