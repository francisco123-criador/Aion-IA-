#!/usr/bin/env bash
# =============================================================================
#  Aion — Cria o repositório no GitHub e faz o primeiro push sozinho.
#  Rode NO SEU COMPUTADOR (após descompactar o projeto). Requer internet.
# =============================================================================
set -e

PROJ="aion"
REPO_NAME="${1:-aion}"   # troque se quiser outro nome de repositório

echo "▶ 1/4 Verificando o GitHub CLI (gh)..."
if ! command -v gh >/dev/null 2>&1; then
  echo "  ✗ 'gh' não está instalado. Instale em: https://cli.github.com/"
  echo "    (Windows: winget install --id GitHub.cli)"
  exit 1
fi

echo "▶ 2/4 Verificando login no GitHub..."
if ! gh auth status >/dev/null 2>&1; then
  echo "  Abrindo login (basta uma vez)..."
  gh auth login
fi

echo "▶ 3/4 Configurando git e criando o repositório '$REPO_NAME'..."
git config user.name  >/dev/null 2>&1 || git config --global user.name  "Aion"
git config user.email >/dev/null 2>&1 || git config --global user.email "aion@example.com"

gh repo create "$REPO_NAME" --public --source=. --remote=origin --push 2>/dev/null \
  || {
    echo "  Repo já existe ou falhou. Usando repositório existente..."
    git remote -v || true
  }

echo "▶ 4/4 Commit e push final (se ainda faltar)..."
git add -A
if ! git diff --cached --quiet; then
  git commit -m "Aion — IA gratuita e ilimitada (criada por Francisco jerbesson de Freitas morais)" 2>/dev/null || echo "  (nada a commitar)"
fi
git push -u origin HEAD 2>/dev/null || git push -u origin main 2>/dev/null || true

echo ""
echo "✅ Repositório criado! Agora é só PUBLICAR com 1 CLIQUE:"
echo "   https://vercel.com/new/clone?repository-url=https://github.com/$(gh api user --jq .login 2>/dev/null)/$REPO_NAME"
echo ""
echo "   Depois cole as variáveis de ambiente na Vercel (veja PUBLICAR_VERCEL.md)."
