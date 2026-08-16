'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Download,
  MessagesSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Send,
  Square,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { InfinityMark } from './aion/InfinityMark'
import { MessageBubble } from './aion/MessageBubble'
import { EmptyState } from './aion/EmptyState'
import { titleFrom, uid } from './aion/model'
import type { ChatMessage, Conversation } from './aion/model'

export default function AionChat() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const abortRef = useRef<AbortController | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const active = conversations.find((c) => c.id === activeId) ?? null

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [conversations, activeId, streaming])

  const startNew = useCallback(() => {
    const conv: Conversation = { id: uid('conv'), title: 'Nova conversa', messages: [] }
    setConversations((prev) => [conv, ...prev])
    setActiveId(conv.id)
  }, [])

  const patchMessage = useCallback((convId: string, msgId: string, content: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              title:
                c.title === 'Nova conversa' && c.messages.length > 0
                  ? titleFrom(c.messages[0].content)
                  : c.title,
              messages: c.messages.map((m) =>
                m.id === msgId ? { ...m, content } : m
              ),
            }
          : c
      )
    )
  }, [])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || streaming) return
    setInput('')

    let conv = active
    if (!conv) {
      const c: Conversation = { id: uid('conv'), title: 'Nova conversa', messages: [] }
      setConversations((prev) => [c, ...prev])
      setActiveId(c.id)
      conv = c
    }

    const userMsg: ChatMessage = { id: uid('user'), role: 'user', content: text }
    const asstMsg: ChatMessage = { id: uid('asst'), role: 'assistant', content: '' }

    const convId = conv.id
    const asstId = asstMsg.id

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, messages: [...c.messages, userMsg, asstMsg] }
          : c
      )
    )
    setStreaming(true)

    const history = [...conv.messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }))

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      })

      if (!res.ok || !res.body) {
        throw new Error('Não foi possível iniciar a conversa.')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        patchMessage(convId, asstId, acc)
      }
    } catch (err) {
      if (controller.signal.aborted) return
      const message =
        err instanceof Error ? err.message : 'Erro ao gerar resposta.'
      patchMessage(convId, asstId, `[Erro] ${message}`)
      toast.error(message)
    } finally {
      if (abortRef.current === controller) abortRef.current = null
      setStreaming(false)
    }
  }, [active, input, streaming, patchMessage])

  const stop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const removeConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    setActiveId((cur) => (cur === id ? null : cur))
  }, [])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Sidebar */}
      <aside
        className={`flex h-full flex-col overflow-hidden border-r border-white/10 bg-[#0b0b10] transition-all duration-300 ${
          sidebarOpen ? 'w-72' : 'w-0'
        }`}
      >
        <div className="flex flex-1 flex-col p-3">
          <div className="flex items-center gap-3 px-2 py-3">
            <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30">
              <InfinityMark className="size-6 text-white" />
            </span>
            <div className="leading-tight">
              <p className="text-xl font-bold tracking-tight">
                Aion<span className="text-indigo-400">.</span>
              </p>
              <p className="text-[11px] text-zinc-500">IA gratuita e ilimitada</p>
            </div>
          </div>

          <button
            onClick={startNew}
            className="mb-4 mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-white/10"
          >
            <Plus className="size-4" />
            Novo chat
          </button>

          <div className="mb-2 flex items-center gap-2 px-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            <MessagesSquare className="size-3.5" />
            Histórico
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
            {conversations.length === 0 ? (
              <p className="px-2 py-6 text-center text-xs text-zinc-600">
                Suas conversas aparecerão aqui.
              </p>
            ) : (
              conversations.map((c) => (
                <div
                  key={c.id}
                  className={`group flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition ${
                    c.id === activeId
                      ? 'bg-white/10 text-white'
                      : 'text-zinc-400 hover:bg-white/5'
                  }`}
                  onClick={() => setActiveId(c.id)}
                >
                  <span className="truncate">{c.title}</span>
                  <button
                    aria-label="Excluir conversa"
                    className="hidden px-1 text-xs text-zinc-500 hover:text-red-400 group-hover:inline-flex"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeConversation(c.id)
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </nav>

          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-center">
            <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-indigo-300">
              <Sparkles className="size-3.5" />
              Criada por Francisco jerbesson
            </p>
            <p className="text-[11px] leading-snug text-zinc-500">
              de Freitas morais
            </p>
          </div>

          <div className="mt-2 space-y-1.5">
            <a
              href="/downloads/Aion-projeto-completo.zip"
              download="Aion-projeto-completo.zip"
              className="flex items-center justify-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-200 transition hover:bg-indigo-500/20"
            >
              <Download className="size-3.5" />
              Baixar projeto completo
            </a>
            <a
              href="/downloads/aion-android-project.zip"
              download="aion-android-project.zip"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/10"
            >
              <Download className="size-3.5" />
              Baixar pacote APK
            </a>
            <a
              href="/downloads/DEPLOY_1CLIQUE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
            >
              <Sparkles className="size-3.5" />
              Publicar com 1 clique
            </a>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="relative flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-white/10 bg-zinc-950/80 px-4 py-3 backdrop-blur">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Alternar histórico"
            className="grid size-9 place-items-center rounded-lg text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            {sidebarOpen ? (
              <PanelLeftClose className="size-5" />
            ) : (
              <PanelLeftOpen className="size-5" />
            )}
          </button>
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
            <InfinityMark className="size-4 text-indigo-400" />
            {active ? active.title : 'Nova conversa'}
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto flex h-full max-w-3xl flex-col gap-6 px-4 py-8">
            {!active || active.messages.length === 0 ? (
              <EmptyState onStart={startNew} />
            ) : (
              active.messages.map((m) => (
                <MessageBubble key={m.id} message={m} streaming={streaming} />
              ))
            )}
          </div>
        </div>

        <div className="border-t border-white/10 bg-gradient-to-t from-zinc-950 to-transparent px-4 pb-4 pt-2">
          <div className="mx-auto max-w-3xl">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
              className="flex items-end gap-2 rounded-2xl border border-white/15 bg-white/5 p-2 shadow-xl shadow-black/40 focus-within:border-indigo-500/60"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                rows={Math.min(6, Math.max(1, input.split('\n').length))}
                placeholder="Pergunte qualquer coisa à Aion…"
                className="max-h-56 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-zinc-100 outline-none placeholder-zinc-500"
              />
              {streaming ? (
                <button
                  type="button"
                  onClick={stop}
                  aria-label="Parar geração"
                  className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10 text-zinc-200 transition hover:bg-white/20"
                >
                  <Square className="size-4 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label="Enviar mensagem"
                  className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 transition enabled:hover:brightness-110 disabled:opacity-40"
                >
                  <Send className="size-4" />
                </button>
              )}
            </form>
            <p className="mt-2 text-center text-[11px] text-zinc-600">
              Aion pode cometer erros. Disponível gratuita e ilimitadamente.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
