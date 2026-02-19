#!/bin/bash
# SafeSite - Quick Setup Script

echo "🏗️ SafeSite - Gestão de Segurança em Canteiro"
echo "=============================================="

# Backend Setup
echo ""
echo "[1/4] Configurando Backend..."
cd server
cp .env.example .env
echo "⚠️  IMPORTANTE: Edite server/.env e coloque sua GEMINI_API_KEY"
echo "Obtenha em: https://aistudio.google.com/"
echo ""
npm i
echo ""

# Frontend Setup
echo "[2/4] Configurando Frontend..."
cd ../web
npm i
echo ""

echo "[3/4] Estrutura criada! ✅"
echo ""
echo "[4/4] Para rodar a aplicação:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd server"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd web"
echo "  npm run dev"
echo ""
echo "Depois abra: http://localhost:5173"
echo ""
echo "✅ Pronto para usar!"
