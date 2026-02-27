# MarketIntel — Deploy Guide

Tempo estimado: **10 minutos**

---

## O que você precisa antes de começar

1. Conta no **GitHub** — github.com (grátis)
2. Conta na **Vercel** — vercel.com (grátis, pode entrar com o GitHub)
3. **API Key da Anthropic** — console.anthropic.com

---

## Passo 1 — Pegar a API Key da Anthropic

1. Acesse **console.anthropic.com**
2. Faça login (a mesma conta que você usa no Claude)
3. No menu lateral, clique em **"API Keys"**
4. Clique em **"Create Key"**
5. Dê um nome (ex: `marketintel`) e copie a key — ela começa com `sk-ant-...`
6. **Guarde essa key** — você vai precisar em breve

> Custo estimado: ~$0.02 por pesquisa (Sonnet 4)

---

## Passo 2 — Subir o código no GitHub

1. Acesse **github.com** e clique em **"New repository"**
2. Nome: `marketintel` — pode deixar privado
3. Clique em **"Create repository"**
4. Na tela seguinte, copie o link do repositório (ex: `https://github.com/seunome/marketintel.git`)

Agora, no terminal da sua máquina, dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/marketintel.git
git push -u origin main
```

---

## Passo 3 — Deploy na Vercel

1. Acesse **vercel.com** e faça login com sua conta GitHub
2. Clique em **"Add New Project"**
3. Selecione o repositório `marketintel`
4. Vercel vai detectar automaticamente que é um projeto Vite — não mude nada
5. Antes de clicar em Deploy, clique em **"Environment Variables"**
6. Adicione:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** sua key `sk-ant-...`
7. Clique em **"Deploy"**

Aguarde ~2 minutos. Pronto — sua URL será algo como:
`https://marketintel-seunome.vercel.app`

---

## Passo 4 — Testar

Abra a URL, digite um segmento (ex: "cobranças", "gestão de projetos", "fintech b2b") e pressione Enter.

A primeira busca pode demorar ~8 segundos (cold start do serverless + chamada à API).

---

## Estrutura do projeto

```
marketintel/
├── api/
│   └── search.js          ← Backend (proxy seguro para Anthropic)
├── src/
│   ├── components/
│   │   ├── CompCard.jsx   ← Card de cada competidor
│   │   ├── Modal.jsx      ← Modal de detalhes
│   │   ├── CompareView.jsx← Tabela comparativa
│   │   └── Skeleton.jsx   ← Loading state
│   ├── App.jsx            ← App principal
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

---

## Dúvidas comuns

**A busca retorna erro 502**
→ Verifique se a `ANTHROPIC_API_KEY` foi salva corretamente na Vercel (Settings > Environment Variables)

**"Module not found" no deploy**
→ Rode `npm install` localmente e faça commit do `package-lock.json`

**Quero um domínio próprio**
→ Na Vercel, vá em Settings > Domains e adicione seu domínio. Configura em minutos.

---

## Atualizar o projeto

Qualquer `git push` para a branch `main` faz deploy automático na Vercel.
