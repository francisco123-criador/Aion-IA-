# ☁️ Aion — Publicação na web (Cloudflare Workers)

A Aion está configurada para ser publicada como **Cloudflare Worker + Static Assets**.
Este documento descreve o processo para deixá-la acessível na internet para qualquer
usuário.

## O que já está pronto (validado)

- ✅ Build do worker compila: `.open-next/worker.js`
- ✅ Dry-run do `wrangler deploy` aceito: 34 assets, ~950 KB gzip
- ✅ Rota `/api/chat` pronta para streaming (o chat carrega a URL web publicada)
- ✅ PWA instalável (manifest, service worker, ícones ∞)
- ✅ `wrangler.toml` com `main`, `assets`, `compatibility_flags = nodejs_compat`

## Passos do deploy (executado pela plataforma/backend)

O deploy final exige credenciais de uma conta Cloudflare e não pode ser feito sem elas.
Quando o mecanismo de publicação da plataforma for acionado, ele:

1. Injetar o **nome do worker** no lugar de `vibe-web-template` em `wrangler.toml`.
2. Criar as **secrets/bindings** para o runtime:
   - `BTY_LLM_SERVER_BASE_URL` (gateway de chat, inclui `/v1`)
   - `BTY_LLM_SERVER_API_KEY` (chave de acesso)
   - (opcional) `DATABASE_URL`, se usar banco.
3. Rodar `wrangler deploy`.
4. Disponibilizar o **domínio público** (`https://<nome>.workers.dev`).

Após publicado, o domínio deve ser usado em `capacitor.config.ts`:
```ts
url: process.env.AION_PUBLIC_URL ?? 'https://SEU-DOMINIO-PUBLICADO.workers.dev',
```
depois `npx cap sync` no computador e gerar o APK no Android Studio.

## Verificar localmente (opcional)

```bash
pnpm build:worker && pnpm preview   # server o worker localmente
```

## Servidor de IA

A rota `/api/chat` faz o streaming via gateway. As variáveis do gateway vêm das
secrets do runtime — **nunca** no código-fonte nem no bundle do cliente.
