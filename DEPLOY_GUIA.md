# Guia de Implementação — Orizia Consulting

> Siga na ordem. Cada fase depende da anterior.

---

## Fase 0 — Contas que você precisa criar

Crie as contas abaixo antes de começar. Todas têm plano gratuito suficiente para começar.

| Serviço | URL | Para que serve |
|---|---|---|
| Neon | neon.tech | Banco de dados PostgreSQL |
| Clerk | clerk.com | Autenticação de usuários |
| Resend | resend.com | Envio de emails |
| Z-API | z-api.io | Envio de WhatsApp |
| Render | render.com | Deploy do backend Python |
| Vercel | vercel.com | Deploy do portal Next.js |
| GitHub | github.com | Hospedar os repos (se ainda não tiver) |

---

## Fase 1 — Banco de dados (Neon)

1. Acesse **neon.tech** → **New Project**
2. Nome: `orizia` / Região: `US East (Ohio)` / PostgreSQL 16
3. Após criar, vá em **Connection Details**
4. Copie a **Connection string** no formato `postgresql://...`
5. Troque o início de `postgresql://` para `postgresql+asyncpg://`
6. Adicione `?sslmode=require` no final se não estiver
7. Guarde — esse é seu `DATABASE_URL`

**Exemplo:**
```
postgresql+asyncpg://joao:senha@ep-cool-name.us-east-2.aws.neon.tech/orizia?sslmode=require
```

---

## Fase 2 — Autenticação (Clerk)

### 2.1 — Criar a aplicação

1. Acesse **clerk.com** → **Create Application**
2. Nome: `Orizia Portal`
3. Habilite: **Email** + **Password** + **Magic Link**
4. Desabilite: Google, GitHub (não precisa de OAuth social)
5. Clique em **Create Application**

### 2.2 — Copiar as chaves

Na tela que abrir (ou em **API Keys**):
- Copie o `Publishable Key` → será `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Copie o `Secret Key` → será `CLERK_SECRET_KEY`

### 2.3 — Pegar a JWKS URL

1. Vá em **Customization → Domains**
2. Seu domínio Clerk será algo como `your-app.clerk.accounts.dev`
3. A JWKS URL será: `https://your-app.clerk.accounts.dev/.well-known/jwks.json`
4. Guarde como `CLERK_JWKS_URL`

### 2.4 — Criar o papel (role) de admin

1. Vá em **Users → [seu usuário]** (crie um usuário admin primeiro pelo painel)
2. Em **Public metadata**, clique em **Edit**
3. Cole:
```json
{ "role": "admin" }
```
4. Salve

> Esse usuário será o acesso ao painel `/admin` do portal.

### 2.5 — Configurar o webhook (após o backend estar no ar)

> Faça isso na **Fase 5** quando o backend já estiver deployado.

---

## Fase 3 — Email (Resend)

1. Acesse **resend.com** → **Add API Key**
2. Nome: `orizia-prod` / Permissões: **Full access**
3. Copie a chave → será `RESEND_API_KEY`
4. Vá em **Domains** → **Add Domain**
5. Adicione `orizia.com.br`
6. Siga as instruções para adicionar os registros DNS no seu provedor
7. Aguarde a verificação (pode demorar até 24h)

> Enquanto o domínio não estiver verificado, você pode usar `onboarding@resend.dev` como remetente para testes.

---

## Fase 4 — WhatsApp (Z-API)

1. Acesse **z-api.io** → **Nova instância**
2. Escaneie o QR Code com o WhatsApp da Orizia (o número que enviará as mensagens)
3. Copie:
   - **Instance ID** → `Z_API_INSTANCE`
   - **Token** → `Z_API_TOKEN`
   - **Client Token** (aba Security) → `Z_API_CLIENT_TOKEN`
4. Anote o número do WhatsApp da Orizia no formato `5511XXXXXXXXX` → `ORIZIA_WHATSAPP`

---

## Fase 5 — Backend (Render)

### 5.1 — Subir o código no GitHub

```bash
# No terminal, dentro da pasta orizia-backend
cd C:\Users\joaol\Documents\Orizia\orizia-backend

git init
git add .
git commit -m "feat: initial backend"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/orizia-backend.git
git push -u origin main
```

### 5.2 — Criar o serviço no Render

1. Acesse **render.com** → **New** → **Web Service**
2. Conecte sua conta GitHub e selecione o repo `orizia-backend`
3. Configurações:
   - **Name:** `orizia-backend`
   - **Region:** Ohio (US East)
   - **Runtime:** Docker
   - **Plan:** Starter ($7/mês)
4. Clique em **Create Web Service**

### 5.3 — Configurar as variáveis de ambiente

No painel do serviço, vá em **Environment** e adicione cada variável:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | A URL do Neon (Fase 1) |
| `CLERK_JWKS_URL` | A URL do Clerk (Fase 2.3) |
| `CLERK_SECRET_KEY` | Secret Key do Clerk (Fase 2.2) |
| `CLERK_WEBHOOK_SECRET` | Gerado na Fase 5.5 abaixo |
| `INTERNAL_TOKEN` | Gere com: `python -c "import secrets; print(secrets.token_urlsafe(32))"` |
| `RESEND_API_KEY` | Chave do Resend (Fase 3) |
| `RESEND_FROM` | `Orizia Consulting <noreply@orizia.com.br>` |
| `ORIZIA_EMAIL` | `contato@orizia.com.br` |
| `Z_API_INSTANCE` | Instance ID do Z-API (Fase 4) |
| `Z_API_TOKEN` | Token do Z-API (Fase 4) |
| `Z_API_CLIENT_TOKEN` | Client Token do Z-API (Fase 4) |
| `ORIZIA_WHATSAPP` | Número no formato `5511XXXXXXXXX` |
| `ANTHROPIC_API_KEY` | Sua chave da API Anthropic |
| `CLAUDE_MODEL` | `claude-sonnet-4-5` |
| `DATA_DIR` | `/app/data` |
| `MAX_UPLOAD_MB` | `10` |
| `FRONTEND_ORIGINS` | `https://joaomari-oss.github.io,https://orizia.com.br,https://app.orizia.com.br` |
| `ENV` | `production` |

### 5.4 — Rodar as migrations do banco

Após o primeiro deploy (aguarde ficar verde):

1. No painel do serviço no Render → **Shell**
2. Execute:
```bash
alembic upgrade head
```

Isso cria todas as tabelas no Neon. Só precisa rodar uma vez.

### 5.5 — Configurar o webhook do Clerk

1. No Clerk → **Webhooks** → **Add Endpoint**
2. URL: `https://orizia-backend.onrender.com/internal/clerk-webhook`
3. Events: marque **user.created** e **user.deleted**
4. Clique em **Create** → copie o **Signing Secret**
5. Cole como `CLERK_WEBHOOK_SECRET` no Render

### 5.6 — Criar o cron job mensal (Score do Acompanhamento)

1. No Render → **New** → **Cron Job**
2. Conecte o mesmo repo `orizia-backend`
3. Configurações:
   - **Name:** `orizia-monthly-scores`
   - **Schedule:** `0 9 1 * *` (dia 1 de cada mês, 09:00 UTC = 06:00 BRT)
   - **Command:**
```bash
python -c "import os, httpx; r = httpx.post('https://orizia-backend.onrender.com/internal/scheduler/run-monthly', headers={'X-Internal-Token': os.environ['INTERNAL_TOKEN']}); print(r.status_code, r.text)"
```
4. Adicione a variável `INTERNAL_TOKEN` com o mesmo valor do serviço web

### 5.7 — Configurar domínio personalizado (opcional mas recomendado)

1. No painel do serviço → **Custom Domains** → `api.orizia.com.br`
2. No seu provedor de DNS, adicione um CNAME:
   - Nome: `api`
   - Valor: o endereço `.onrender.com` que o Render fornecer

### 5.8 — Verificar que está funcionando

Acesse no navegador:
```
https://orizia-backend.onrender.com/health
```

Deve retornar:
```json
{"status": "ok", "version": "1.0.0", "db_ok": true, "env": "production"}
```

---

## Fase 6 — Portal + Admin (Vercel)

### 6.1 — Subir o código no GitHub

```bash
cd C:\Users\joaol\Documents\Orizia\orizia-portal

git init
git add .
git commit -m "feat: initial portal"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/orizia-portal.git
git push -u origin main
```

### 6.2 — Fazer o deploy no Vercel

1. Acesse **vercel.com** → **Add New Project**
2. Importe o repo `orizia-portal`
3. Framework: **Next.js** (detectado automaticamente)
4. Clique em **Deploy**

### 6.3 — Configurar as variáveis de ambiente no Vercel

No painel do projeto → **Settings** → **Environment Variables**:

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Publishable Key do Clerk (Fase 2.2) |
| `CLERK_SECRET_KEY` | Secret Key do Clerk (Fase 2.2) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/dashboard` |
| `NEXT_PUBLIC_API_URL` | `https://api.orizia.com.br` (ou a URL do Render) |

Após adicionar, vá em **Deployments** → **Redeploy** para aplicar.

### 6.4 — Configurar domínio personalizado

1. No Vercel → **Settings** → **Domains** → adicione `app.orizia.com.br`
2. No seu provedor de DNS, adicione um CNAME:
   - Nome: `app`
   - Valor: `cname.vercel-dns.com`

### 6.5 — Adicionar o domínio do portal no Clerk

1. No Clerk → **Domains** → **Add Domain**
2. Adicione `app.orizia.com.br` como domínio de produção
3. Siga as instruções de DNS

---

## Fase 7 — Site de marketing (GitHub Pages)

```bash
cd C:\Users\joaol\Documents\Orizia\orizia

git add .
git commit -m "feat: diagnostico, privacidade, obrigado, nav updates"
git push
```

O GitHub Pages publica automaticamente. Aguarde ~1 minuto e acesse `https://joaomari-oss.github.io/orizia/`.

---

## Fase 8 — Formspree (formulário de contato)

1. Acesse **formspree.io** → **New Form**
2. Nome: `Contato Orizia`
3. Email: `contato@orizia.com.br`
4. Copie o **Form ID** (formato: `xpwranwq`)
5. Em `pages/contact.html`, confirme que o `action` do form está:
   ```
   https://formspree.io/f/SEU_FORM_ID
   ```
6. Teste enviando uma mensagem pelo site

---

## Fase 9 — Teste E2E completo

Após todos os serviços estarem no ar, siga esse roteiro de teste:

### 9.1 — Diagnóstico gratuito
1. Acesse `https://joaomari-oss.github.io/orizia/pages/diagnostico.html`
2. Preencha todos os campos (Step 1)
3. Faça upload de pelo menos 2 dos CSVs de exemplo (em `orizia-backend/data/exemplos/`)
4. Aceite o NDA/DPA e clique em **Enviar para análise**
5. Deve retornar: `{"status": "queued", "id": "...", "eta": "48h"}`

### 9.2 — Notificação interna
6. Aguarde ~1–2 minutos (pipeline de IA + PDF)
7. Você deve receber um email em `contato@orizia.com.br` com o link para revisar
8. E uma mensagem no WhatsApp da Orizia

### 9.3 — Revisão admin
9. Acesse `https://app.orizia.com.br/sign-in` com sua conta admin
10. Vá em `/admin/leads` — o lead deve aparecer com status **Aguarda Revisão**
11. Clique em **Revisar**
12. Leia a análise da IA, edite se quiser, clique em **Aprovar & Enviar**

### 9.4 — Entrega ao cliente
13. O cliente deve receber o PDF por email + WhatsApp
14. O cliente deve receber um email de convite para o portal

### 9.5 — Portal do cliente
15. Abra o link de convite em uma aba anônima
16. Crie uma conta com o email do "cliente" de teste
17. Deve redirecionar para `/dashboard`
18. Confirme que o Score, subindicadores e pontos críticos aparecem

### 9.6 — Newsletter / Market Report
19. Acesse `https://joaomari-oss.github.io/orizia/pages/report.html`
20. Preencha o formulário de assinatura
21. Deve receber um email de boas-vindas
22. No admin em `/admin/newsletter`, o assinante deve aparecer

---

## Problemas comuns

| Problema | Causa provável | Solução |
|---|---|---|
| `db_ok: false` no `/health` | DATABASE_URL incorreta | Verifique se começa com `postgresql+asyncpg://` e tem `?sslmode=require` |
| 403 em endpoints do portal | CLERK_JWKS_URL errada | Verifique o domínio Clerk nas configurações |
| PDF não gerado | WeasyPrint faltando dependências | Confirme que o Dockerfile instala `libpango-1.0-0` |
| WhatsApp não enviado | Z-API desconectado | Re-escaneie o QR Code em z-api.io |
| Email caindo em spam | Domínio Resend não verificado | Adicione os registros DNS do Resend |
| Lead fica em `processing` | Erro no Claude API | Verifique `ANTHROPIC_API_KEY` nas vars do Render |

---

## Custos mensais estimados

| Serviço | Custo |
|---|---|
| Render Starter (backend) | US$ 7/mês |
| Z-API (WhatsApp) | ~R$ 50/mês |
| Neon, Vercel, Clerk, Resend | Grátis nos planos iniciais |
| **Total** | **~R$ 85–90/mês** |

---

## Sequência resumida

```
1. Criar contas (Neon, Clerk, Resend, Z-API, Render, Vercel)
2. Neon → criar projeto → copiar DATABASE_URL
3. Clerk → criar app → copiar chaves → criar usuário admin
4. Resend → criar API key → verificar domínio
5. Z-API → criar instância → escanear QR → copiar tokens
6. GitHub → subir orizia-backend → subir orizia-portal
7. Render → criar Web Service → configurar vars → aguardar deploy
8. Render Shell → alembic upgrade head
9. Clerk → criar webhook → copiar secret → colar no Render
10. Vercel → importar orizia-portal → configurar vars → deploy
11. Clerk + Vercel → configurar domínio app.orizia.com.br
12. Render → configurar domínio api.orizia.com.br
13. GitHub Pages → git push no orizia (site marketing)
14. Formspree → criar form → confirmar action no contact.html
15. Teste E2E completo (Fase 9)
```
