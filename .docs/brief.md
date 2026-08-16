# Aion — Assistente de IA gratuito e ilimitado

## Objetivo
Assistente conversacional estilo ChatGPT, 100% gratuito e sem limite de uso,
disponível openweb (qualquer usuário com conexão à internet).

## Funcionalidades essenciais
1. Chat conversacional com respostas em streaming (efeito de "digitando").
2. Interface de chat limpa e familiar (sidebar com histórico, lista de
   mensagens, área de entrada).
3. Identidade visual própria: nome "Aion", símbolo do infinito (∞).
4. Crédito do criador: "Francisco jerbesson de Freitas morais".

## Stack / decisões técnicas
- Next.js App Router + React 19 + Tailwind 4 (template herdado).
- Backend de chat via gateway LLM (claude-sonnet-4.6) através de API route
  server-side `/api/chat` para não expor a chave.
- Streaming SSE do gateway reexposto ao cliente como stream.
- Histórico mantido em memória no cliente (sessão), sem login obrigatório.

## Não-escopo (v1)
- Sem autenticação, sem contas, sem pagamentos (é gratuito/ilimitado).
- Sem persistência persistente do histórico entre sessões.
