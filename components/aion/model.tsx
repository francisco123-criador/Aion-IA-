'use client'

// Minimal markdown-ish rendering: bold, inline code, fenced code, line breaks.
export function renderMarkup(text: string) {
  const blocks = text.split(/(```[\s\S]*?```)/g)
  return blocks.map((block, bi) => {
    if (/^```/.test(block)) {
      const code = block.replace(/^```\w*\n?/, '').replace(/\n?```$/, '')
      return (
        <pre
          key={bi}
          className="my-3 overflow-x-auto rounded-lg bg-black/30 p-3 text-sm text-zinc-100"
        >
          <code className="font-mono">{code}</code>
        </pre>
      )
    }
    const segments = block.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    return (
      <span key={bi}>
        {segments.map((seg, si) => {
          if (/^\*\*[^*]+\*\*$/.test(seg)) {
            return <strong key={si}>{seg.slice(2, -2)}</strong>
          }
          if (/^`[^`]+$/.test(seg)) {
            return (
              <code
                key={si}
                className="rounded bg-black/25 px-1.5 py-0.5 text-[0.9em] text-indigo-200"
              >
                {seg.slice(1, -1)}
              </code>
            )
          }
          return (
            <span key={si} className="whitespace-pre-wrap">
              {seg}
            </span>
          )
        })}
      </span>
    )
  })
}

export function titleFrom(text: string): string {
  const clean = text.trim().replace(/\s+/g, ' ')
  if (!clean) return 'Nova conversa'
  return clean.length > 34 ? `${clean.slice(0, 34)}…` : clean
}

export type ChatRole = 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
}

export type Conversation = {
  id: string
  title: string
  messages: ChatMessage[]
}

export function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
