import fs from "fs";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken"; // <-- 1. Importando JWT

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTS_FILE = path.join(__dirname, "data", "reports.json");
const USERS_FILE = path.join(__dirname, "data", "users.json");
const CONFIG_FILE = path.join(__dirname, "data", "siteConfig.json");

// Chave secreta para assinar o token (Em produção, vem do .env)
const JWT_SECRET = process.env.JWT_SECRET || "safesite_super_secret_key_2026";

function loadJSON(filePath, defaultValue = []) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }
  } catch (e) {
    console.error(`Error loading ${filePath}:`, e);
  }
  return defaultValue;
}

function saveJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function makeRoutes({ ai, modelId }) {
  const router = express.Router();

  // <-- 2. MIDDLEWARE DE AUTENTICAÇÃO (O "Segurança da Porta")
  const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    }

    // O header vem no formato: "Bearer TOKEN_AQUI"
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // Guarda os dados do usuário para usar na rota
      next(); // Permite que a requisição continue
    } catch (error) {
      return res.status(403).json({ error: "Token inválido ou expirado." });
    }
  };

  // Health check
  router.get("/health", (req, res) => {
    res.json({ status: "ok", model: modelId });
  });

  // <-- 3. ROTA DE LOGIN (Gera o Token)
  router.post("/login", (req, res) => {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Usuário é obrigatório" });
    }

    // Gera um token válido por 8 horas
    const token = jwt.sign({ username, role: "engineer" }, JWT_SECRET, {
      expiresIn: "8h"
    });

    res.json({ message: "Login realizado", token, username });
  });

  // Get all reports (Rota Pública)
  router.get("/reports", (req, res) => {
    const reports = loadJSON(REPORTS_FILE, []);
    res.json(reports);
  });

  // Get reports by site (Rota Pública)
  router.get("/reports/:siteId", (req, res) => {
    const reports = loadJSON(REPORTS_FILE, []);
    const filtered = reports.filter((r) => r.siteId === req.params.siteId);
    res.json(filtered);
  });

  // Analyze and create report (Pode ser pública para qualquer operário relatar)
  router.post("/analyze", async (req, res) => {
    const { description, siteId = "obra-001", reportedBy = "anonymous" } = req.body;

    if (!description || description.trim().length === 0) {
      return res.status(400).json({ error: "Description is required" });
    }

    try {
      const analysis = await ai.analyzeReport(description);

      const report = {
        id: Date.now().toString(),
        siteId,
        reportedBy,
        timestamp: new Date().toISOString(),
        description,
        aiAnalysis: analysis,
        status: "open",
        assignedTo: null,
        comments: []
      };

      const reports = loadJSON(REPORTS_FILE, []);
      reports.unshift(report);
      saveJSON(REPORTS_FILE, reports);

      res.json(report);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // <-- 4. ROTA PROTEGIDA COM `verifyToken`
  router.patch("/reports/:id", verifyToken, (req, res) => {
    const { status, assignedTo, comment } = req.body;
    const reports = loadJSON(REPORTS_FILE, []);
    const report = reports.find((r) => r.id === req.params.id);

    if (!report) return res.status(404).json({ error: "Report not found" });

    if (status) {
      report.status = status;
      // Registra a hora exata em que foi resolvido (para o sumiço em 2 dias)
      if (status === "resolved") report.resolvedAt = new Date().toISOString();
    }
    
    if (assignedTo) report.assignedTo = assignedTo;
    if (comment) {
      report.comments.push({
        timestamp: new Date().toISOString(),
        author: req.user.username, 
        text: comment
      });
    }

    saveJSON(REPORTS_FILE, reports);
    res.json(report);
  });

  router.delete("/reports/:id", verifyToken, (req, res) => {
    let reports = loadJSON(REPORTS_FILE, []);
    const initialLength = reports.length;
    
    // Filtra removendo o ID que o usuário quer apagar
    reports = reports.filter(r => r.id !== req.params.id);
    
    if (reports.length === initialLength) {
      return res.status(404).json({ error: "Report not found" });
    }

    saveJSON(REPORTS_FILE, reports);
    res.json({ message: "Relato excluído com sucesso" });
  });

  // Get users
  router.get("/users", (req, res) => {
    const users = loadJSON(USERS_FILE, []);
    res.json(users);
  });

  // Get site config
  router.get("/config", (req, res) => {
    const config = loadJSON(CONFIG_FILE, {});
    res.json(config);
  });

  return router;
}