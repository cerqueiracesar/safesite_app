# SafeSite - Gestão de Segurança em Canteiro de Obras

## 🎯 Visão Geral

**SafeSite** é uma aplicação web para gestão de segurança em canteiros de obra. Permite que operários, mestres e supervisores registrem situações de risco em tempo real, que são automaticamente analisadas pela IA (Gemini) e classificadas por nível de criticidade.

## 🏗️ Arquitetura

### Tech Stack
- **Backend**: Node.js + Express
- **Frontend**: React 18 + Vite
- **IA**: Gemini (Google AI Studio)
- **Persistência**: JSON Files
- **Autenticação**: LocalStorage (simples)

### Fluxo de Dados

```
OPERÁRIO/MESTRE
    ↓
[Descreve situação]
    ↓
Backend: Gemini analisa
    ↓
Classifica: Critical/High/Medium/Low
    ↓
Dashboard atualiza em tempo real
    ↓
Supervisor monitora e atribui ações
```

---

## 📁 Estrutura de Pastas

```
safesite-app/
├── server/                          # Backend Node.js
│   ├── src/
│   │   ├── index.js                # Servidor Express
│   │   ├── geminiClient.js         # Cliente Gemini + análise
│   │   ├── routes.js               # Endpoints da API
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
│   │   ├── styles.css              # Design Dashboard (Opção A)
│   │   ├── api.js                  # Chamadas HTTP
│   │   ├── components/
│   │   │   ├── LoginModal.jsx      # Login simples
│   │   │   ├── ReportForm.jsx      # Formulário de relato
│   │   │   ├── Dashboard.jsx       # Visão geral
│   │   │   └── RiskCard.jsx        # Card individual
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
# Edite .env e coloque sua GEMINI_API_KEY
npm i
npm run dev
```

Backend roda em: **http://localhost:8787**

### 2️⃣ Frontend

```bash
cd ../web
npm i
npm run dev
```

Frontend roda em: **http://localhost:5173**

### 3️⃣ Testar

1. Abra http://localhost:5173
2. Faça login (escolha um perfil ou digite seu nome)
3. Digite uma situação (ex: "Operário sem EPI na laje")
4. Sistema classifica e mostra no dashboard

---

## 🔗 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Status do servidor |
| GET | `/api/config` | Configuração de cores/categorias |
| GET | `/api/users` | Lista de usuários |
| GET | `/api/reports/:siteId` | Relatos da obra |
| POST | `/api/analyze` | Enviar relato para análise IA |
| PATCH | `/api/reports/:id` | Atualizar status do relato |

### Exemplo: Analisar Relato

```bash
curl -X POST http://localhost:8787/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Fio exposto na laje nível 3",
    "siteId": "obra-001",
    "reportedBy": "João Silva"
  }'
```

Resposta:
```json
{
  "id": "1708107600000",
  "siteId": "obra-001",
  "reportedBy": "João Silva",
  "timestamp": "2026-02-17T16:46:40.000Z",
  "description": "Fio exposto na laje nível 3",
  "aiAnalysis": {
    "riskLevel": "critical",
    "category": "equipamento",
    "summary": "Risco de choque elétrico identificado",
    "recommendedActions": [
      "Desligar circuito imediatamente",
      "Isolar a área",
      "Chamar eletricista"
    ],
    "estimatedTimeToResolve": 15
  },
  "status": "open",
  "assignedTo": null,
  "comments": []
}
```

---

## 🎨 Design: Dashboard Operacional

**Características:**
- ✅ Layout responsivo (Desktop/Mobile)
- ✅ Barra de status com 4 níveis de risco
- ✅ Cards com informações de risco
- ✅ Formulário sticky (lado esquerdo)
- ✅ Atualização automática a cada 5s
- ✅ Tema escuro profissional

### Níveis de Risco

| Nível | Ícone | Cor | Ação |
|-------|-------|-----|------|
| Critical | 🔴 | Vermelho | Parar atividade imediatamente |
| High | 🟠 | Laranja | Ação em até 30 min |
| Medium | 🟡 | Amarelo | Monitore |
| Low | 🟢 | Verde | Observar |

---

## 🔐 Autenticação

- Login simples com localStorage
- 3 perfis pré-definidos:
  - **João Silva** (operário)
  - **Carlos Supervisor** (supervisor)
  - **Maria Mestre** (mestre)
- Ou digite um nome customizado

---

## 📊 Dados Locais (JSON)

### reports.json (criado ao analisar)
```json
[
  {
    "id": "1708107600000",
    "siteId": "obra-001",
    "reportedBy": "João Silva",
    "timestamp": "2026-02-17T16:46:40.000Z",
    "description": "Fio exposto",
    "aiAnalysis": { /* ... */ },
    "status": "open",
    "assignedTo": null,
    "comments": []
  }
]
```

### users.json
```json
[
  { "id": "user-001", "name": "João Silva", "role": "operario" },
  { "id": "user-002", "name": "Carlos Supervisor", "role": "supervisor" },
  { "id": "user-003", "name": "Maria Mestre", "role": "mestre" }
]
```

### siteConfig.json
```json
{
  "sites": [ { "id": "obra-001", "name": "Obra Centro" } ],
  "riskLevels": { "critical": { "color": "#dc2626" }, ... },
  "categories": { "pessoal": "Segurança Pessoal", ... }
}
```

---

## 🚀 Próximas Melhorias

- [ ] Banco de dados (SQLite/PostgreSQL)
- [ ] Notificações em tempo real (WebSocket)
- [ ] Upload de fotos/vídeos
- [ ] Relatórios PDF
- [ ] Integração com WhatsApp/Email
- [ ] Histórico e analytics
- [ ] Multi-site
- [ ] Autenticação robusta (JWT)

---

## 🛠️ Troubleshooting

### Backend não conecta com Gemini
```
Error: GEMINI_API_KEY not set
```
→ Edite `.env` e adicione sua chave de API

### Frontend não conecta com backend
```
Error: Failed to fetch /api/reports
```
→ Verifique se backend está rodando em `http://localhost:8787`

### Port já em uso
```bash
# Backend (trocar porta)
PORT=8888 npm run dev

# Frontend (trocar porta)
npm run dev -- --port 5174
```

---

## 📝 Variáveis de Ambiente

Arquivo: `server/.env`

```env
PORT=8787
MODEL_ID=gemini-2-flash
GEMINI_API_KEY=sua-chave-aqui
```

Obter chave: https://aistudio.google.com/

---

## 📄 Licença

Este projeto é fornecido como base para evolução. Use livremente!

---

**SafeSite v1.0** | Desenvolvido para canteiros de obras mais seguros.
