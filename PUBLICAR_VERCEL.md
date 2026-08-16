# ⚡ Aion — Publicação mais fácil: Vercel (gratuita)

A maneira mais simples de colocar a Aion **online com o chat funcionando** é usar a
**Vercel** — ela roda o Next.js com as rotas API nativamente e tem um plano gratuito.

Tempo total: ~5 minutos.

## Passo 1 — Enviar o código para o GitHub

**Opção A — automática (recomendada):** com o projeto na pasta e no terminal, rode:

```bash
./criar_repo_github.sh
```

O script instala/usa o `gh` CLI, pede login (uma vez), cria o repositório `aion`
público, faz o commit e o push — e ainda te devolve o **link do deploy em 1 clique**.

**Opção B — manual:** crie um repositório pelo navegador em
https://github.com/new (nome `aion`, público) e, na pasta do projeto:

```bash
pnpm install
git init
git add .
git commit -m "Aion — IA gratuita e ilimitada"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/aion.git
git push -u origin main
```

> Não esqueça: o `.env` **não** deve ir para o Git (está no `.gitignore`).

## Passo 2 — Importar na Vercel

1. Acesse [vercel.com](https://vercel.com) e entre com o GitHub.
2. Clique em **Add New → Project** e selecione o repositório `aion`.
3. A Vercel detecta o Next.js automaticamente. Deixe o **Build Command** padrão.

## Passo 3 — Configurar as variáveis de ambiente (obrigatório)

No projeto na Vercel, vá em **Settings → Environment Variables** e adicione:

| Nome | Valor |
|---|---|
| `BTY_LLM_SERVER_BASE_URL` | (URL do gateway de chat, inclui `/v1`) |
| `BTY_LLM_SERVER_API_KEY` | (chave de acesso do gateway) |
| `AION_PUBLIC_URL` | será o domínio da Vercel (ex.: `https://aion.vercel.app`) |

> São as mesmas credenciais usadas no servidor de IA. **Nunca** as coloque no código.

Depois, clique em **Deploy**. Quando terminar, a Vercel dá o domínio
(`https://<projeto>.vercel.app`).

## Passo 4 — Plug o domínio no APK

No `capacitor.config.ts`:
```ts
url: process.env.AION_PUBLIC_URL ?? 'https://<projeto>.vercel.app',
```
Rode `pnpm cap:sync` e gere o APK no Android Studio (veja `COMO_GERAR_APK.md`).

---

## Alternativa (zero esforço da sua parte)

Se preferir não fazer nada, a plataforma pode publicar a Aion via Cloudflare
Worker quando o mecanismo de deploy for acionado (veja `PUBLICAR.md`). Para você,
o caminho Vercel é o mais rápido e controlável.
