# ⚡ Aion — Deploy em UM CLIQUE com Vercel

Depois que o código da Aion estiver em um **repositório GitHub público**, você pode
publicar com um único clique.

## Como funciona o botão one-click

A Vercel tem um recurso oficial: o botão **Deploy** que importa um repositório e
faz o deploy imediatamente.

**Substitua `SEU_USUARIO` e `aion` pelo seu repositório:**

```
https://vercel.com/new/clone?repository-url=https://github.com/SEU_USUARIO/aion
```

1. Acesse esse link (após criar o repo `aion` no GitHub).
2. A Vercel mostrará o projeto **Aion** detectando o Next.js automaticamente.
3. Clique em **Deploy**.
4. Quando o build terminar, _ainda_ é preciso colocar as variáveis de ambiente
   (o one-click não injeta secrets) — veja abaixo.

## Passo obrigatório pós-deploy: variáveis de ambiente

Como o chat usa um servidor de IA, sem estas variáveis a Aion não responde:

1. No painel da Vercel: **Settings → Environment Variables**.
2. Adicione (no ambiente **Production**):
   - `BTY_LLM_SERVER_BASE_URL`
   - `BTY_LLM_SERVER_API_KEY`
   - `AION_PUBLIC_URL` → `https://<seu-projeto>.vercel.app`
3. Clique em **Deploy** novamente (ou *Redeploy*) para aplicar.

Pronto — a Aion está online e o chat funciona.

## Exemplo de botão (coloque este image/link onde quiser)

```html
<a href="https://vercel.com/new/clone?repository-url=https://github.com/SEU_USUARIO/aion">
  <img src="https://vercel.com/button" alt="Deploy with Vercel" />
</a>
```

---

> Pré-requisito: **repositório público no GitHub** com o código da Aion.
> Use o `Aion-projeto-completo.zip` e siga os passos 1 de `PUBLICAR_VERCEL.md`.
