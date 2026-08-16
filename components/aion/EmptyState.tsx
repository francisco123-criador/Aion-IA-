'use client'

import { InfinityMark } from './InfinityMark'

export function EmptyState({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <div className="relative">
        <div className="absolute inset-0 -z-10 rounded-full bg-violet-600/20 blur-3xl" />
        <span className="grid size-20 place-items-center rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-2xl shadow-violet-500/40">
          <InfinityMark className="size-12 text-white" />
        </span>
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Aion<span className="text-indigo-400">.</span>
        </h1>
        <p className="mt-2 max-w-md text-sm text-zinc-400">
          Sua assistente de IA gratuita e ilimitada, criada por{' '}
          <span className="text-zinc-200">
            Francisco jerbesson de Freitas morais
          </span>
          . Pergunte o que quiser.
        </p>
      </div>
      <div className="grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
        {[
          'Me ajude a estudar programação',
          'Explique um conceito de forma simples',
          'Escreva um texto profissional',
          'Resuma um assunto extenso',
        ].map((sug) => (
          <button
            key={sug}
            onClick={onStart}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-zinc-300 transition hover:border-indigo-500/50 hover:bg-white/10"
          >
            {sug}
          </button>
        ))}
      </div>
    </div>
  )
}
