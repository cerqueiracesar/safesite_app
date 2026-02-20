# SafeSite - Gestão de Segurança em Canteiro de Obras com IA

## 🎯 Visão Geral

**SafeSite** é uma aplicação web Full Stack para gestão de segurança em canteiros de obra. Permite que operários, mestres e supervisores registrem situações de risco em tempo real. Os relatos são automaticamente analisados pela IA (Google Gemini), classificados por nível de criticidade e disponibilizados em um dashboard interativo com controle de acesso e ciclo de vida de dados.

## 🏗️ Arquitetura e Tech Stack

### Backend
- **Core**: Node.js + Express
- **Integração IA**: Google Gemini API (Google AI Studio)
- **Segurança**: JWT (JSON Web Tokens) para autenticação de rotas e Helmet para segurança de cabeçalhos HTTP.
- **Documentação**: Swagger UI / OpenAPI 3.0
- **Persistência**: JSON Files (Filesystem)

### Frontend
- **Framework**: React 18 + Vite
- **Estilização**: CSS Modules / Custom Properties (Tema Escuro Profissional)
- **Gestão de Estado**: React Hooks (useState, useEffect)
- **Integração**: Fetch API com injeção de Bearer Tokens.

### Fluxo de Dados

```text
OPERÁRIO/MESTRE
    ↓
[Descreve situação de risco]
    ↓
Backend: Gemini analisa contexto via Prompt de Sistema
    ↓
Classifica: Critical/High/Medium/Low e sugere ações
    ↓
Dashboard atualiza e notifica
    ↓
Supervisor (Autenticado via JWT) resolve ou exclui o relato
```

---

## 📁 Estrutura de Pastas

```text
safesite-app/
├── server/                          # Backend Node.js
│   ├── src/
│   │   ├── index.js                # Servidor Express
│   │   ├── geminiClient.js         # Cliente Gemini + análise
│   │   ├── routes.js               # Endpoints da API
│   │   ├── swagger.js              # Documentação OpenAPI
│   │   ├── models/
│   │   ├── utils/
│   │   └── data/
│   │       ├── reports.json        # Relatos (criado ao rodar)
│   │       ├── users.json          # Usuários pré-definidos
│   │       └── siteConfig.json     # Configurações de cores/categorias
│   ├── .env
│   └── package.json
│
├── web/                             # Frontend React
│   ├── src/
│   │   ├── App.jsx                 # App principal
│   │   ├── main.jsx
│   │   ├── styles.css              # Design Dashboard
│   │   ├── api.js                  # Chamadas HTTP (com Bearer Token)
│   │   ├── components/
│   │   │   ├── LoginModal.jsx      # Login via API
│   │   │   ├── ReportForm.jsx      # Formulário de relato
│   │   │   ├── Dashboard.jsx       # Visão geral e filtros
│   │   │   └── RiskCard.jsx        # Card individual com ações
│   │   └── hooks/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── prompts/                         # Prompt único
│   └── system-prompt.txt           # Contexto para o Gemini
│
├── SETUP.sh
│
└── README.md
```

---

## ⚡ Quick Start

### 1️⃣ Backend

```bash
cd server
cp .env.example .env
# Edite o .env com sua GEMINI_API_KEY e defina um JWT_SECRET
npm install
npm run dev
```

O Backend rodará em: **http://localhost:8787**
A Documentação rodará em: **http://localhost:8787/api-docs**

### 2️⃣ Frontend

```bash
cd ../web
npm install
npm run dev
```

O Frontend rodará em: **http://localhost:5173**

---

## 📚 Documentação da API (Swagger)

A API possui documentação interativa gerada com Swagger (OpenAPI). 
Após iniciar o backend, acesse `http://localhost:8787/api-docs` para visualizar os schemas, testar os endpoints e validar os fluxos de autenticação diretamente pelo navegador.

### 🔗 Endpoints Principais

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/health` | Status do servidor | Pública |
| POST | `/api/login` | Gera Token JWT para acesso | Pública |
| POST | `/api/analyze` | Envia relato para análise Semântica (IA) | Pública |
| GET | `/api/reports/:siteId`| Lista todos os relatos da obra | Pública |
| PATCH | `/api/reports/:id` | Atualiza status (ex: Resolver) | 🔒 Obrigatória (JWT) |
| DELETE | `/api/reports/:id` | Exclusão permanente do relato | 🔒 Obrigatória (JWT) |

---

## 🎨 Funcionalidades do Dashboard

- ✅ **Layout Responsivo:** Adaptado para Desktop e Mobile.
- ✅ **Barra de Status em Tempo Real:** Contagem dinâmica apenas de riscos abertos.
- ✅ **Filtro Temporal de Retenção:** Relatos resolvidos desaparecem da visualização após 48 horas.
- ✅ **Controle de Acesso UI:** Botões de ações restritas reagem ao estado de autenticação do usuário.

### Níveis de Risco

| Nível | Ícone | Cor | Ação |
|-------|-------|-----|------|
| Critical | 🔴 | Vermelho | Parar atividade imediatamente |
| High | 🟠 | Laranja | Ação em até 30 min |
| Medium | 🟡 | Amarelo | Monitore |
| Low | 🟢 | Verde | Observar |

---

## 🔐 Autenticação e Segurança

A aplicação utiliza **Autenticação Baseada em Token (JWT)**.
1. O usuário seleciona seu perfil ou insere seu nome no modal inicial.
2. O Backend gera um token criptografado e retorna para o Frontend.
3. O Frontend armazena o token e o injeta nos cabeçalhos (`Authorization: Bearer <token>`) em todas as requisições sensíveis (Alterar Status e Excluir).

---

## 🚀 Roadmap e Próximas Melhorias

- [x] Integração com IA (Google Gemini)
- [x] Autenticação robusta (JWT e Helmet)
- [x] Documentação interativa (Swagger)
- [x] Ciclo de vida do dado (Soft delete/Hide 48h)
- [ ] Migração para Banco de Dados Relacional (PostgreSQL com Prisma ORM)
- [ ] Mensageria para envio de alertas (RabbitMQ)
- [ ] Upload de fotos e evidências (AWS S3)
- [ ] Deploy em nuvem (Render/Vercel)

---

## 📝 Variáveis de Ambiente

Arquivo: `server/.env`

```env
PORT=8787
MODEL_ID=gemini-1.5-flash
GEMINI_API_KEY=sua-chave-aqui
JWT_SECRET=sua-chave-secreta-super-segura
```

---

**SafeSite v1.0** | Desenvolvido para canteiros de obras mais seguros.