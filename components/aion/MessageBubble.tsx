'use client'

import { InfinityMark } from './InfinityMark'
import { renderMarkup } from './model'
import type { ChatMessage } from './model'

export function MessageBubble({
  message,
  streaming,
}: {
  message: ChatMessage
  streaming: boolean
}) {
  const isUser = message.role === 'user'
  return (
    <div
      className={`flex w-full gap-3 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      <div
        className={`grid size-8 shrink-0 place-items-center rounded-lg ${
          isUser
            ? 'bg-zinc-700/80 text-sm font-semibold text-white'
            : 'bg-gradient-to-br from-indigo-500 to-violet-600'
        }`}
      >
        {isUser ? 'Você' : <InfinityMark className="size-5 text-white" />}
      </div>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-indigo-600/20 text-zinc-100'
            : 'bg-white/[0.04] text-zinc-200'
        }`}
      >
        {message.content ? (
          renderMarkup(message.content)
        ) : streaming ? (
          <span className="inline-flex items-center gap-1">
            <span className="size-1.5 animate-bounce rounded-full bg-indigo-300" />
            <span className="size-1.5 animate-bounce rounded-full bg-violet-300 [animation-delay:120ms]" />
            <span className="size-1.5 animate-bounce rounded-full bg-fuchsia-300 [animation-delay:240ms]" />
          </span>
        ) : null}
      </div>
    </div>
  )
}
