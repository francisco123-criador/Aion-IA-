# 🚀 Aion — Como rodar o projeto e gerar o APK no seu computador

Este é o código-fonte completo da **Aion** (assistente de IA gratuita e ilimitada,
criada por Francisco jerbesson de Freitas morais).

## 1. Pré-requisitos

- **Node.js 22+ (LTS)** → https://nodejs.org/en/download
- **pnpm** → `npm install -g pnpm`
- Para gerar o APK: **Android Studio** → https://developer.android.com/studio

## 2. Instalar as dependências

No terminal, dentro da pasta do projeto:

```bash
pnpm install
```

## 3. Configurar as credenciais da IA

Copie o `.env.example` para `.env` e preencha as variáveis do servidor de IA:
`BTY_LLM_SERVER_BASE_URL` e `BTY_LLM_SERVER_API_KEY` (e defina sua `AION_PUBLIC_URL`).

> As credenciais ficam no servidor — nunca coloque a chave no código-fonte.

## 4. Rodar localmente

```bash
pnpm dev
```

Abra http://localhost:13000 no navegador.

## 5. Gerar o APK Android

1. **Publique a Aion** num domínio (ex.: `https://aion.exemplo.com`).
2. No `capacitor.config.ts`, troque a URL:
   ```ts
   url: process.env.AION_PUBLIC_URL ?? 'https://SEU-DOMINIO-DA-AION.com',
   ```
3. Abra a pasta `android/` no **Android Studio**.
4. **Build → Build APK(s)**.
5. O APK sai em `android/app/build/outputs/apk/debug/app-debug.apk`.

## Comandos úteis (scripts no package.json)

| Comando | Função |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm typecheck` | Verifica tipos |
| `pnpm cap:sync` | Sincroniza o projeto Capacitor |
| `pnpm apk` | Gera o APK via Gradle |
