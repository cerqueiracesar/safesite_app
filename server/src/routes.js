import fs from "fs";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTS_FILE = path.join(__dirname, "data", "reports.json");
const USERS_FILE = path.join(__dirname, "data", "users.json");
const CONFIG_FILE = path.join(__dirname, "data", "siteConfig.json");

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

  // Health check
  router.get("/health", (req, res) => {
    res.json({ status: "ok", model: modelId });
  });

  // Get all reports
  router.get("/reports", (req, res) => {
    const reports = loadJSON(REPORTS_FILE, []);
    res.json(reports);
  });

  // Get reports by site
  router.get("/reports/:siteId", (req, res) => {
    const reports = loadJSON(REPORTS_FILE, []);
    const filtered = reports.filter((r) => r.siteId === req.params.siteId);
    res.json(filtered);
  });

  // Analyze and create report
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

  // Update report status
  router.patch("/reports/:id", (req, res) => {
    const { status, assignedTo, comment } = req.body;
    const reports = loadJSON(REPORTS_FILE, []);
    const report = reports.find((r) => r.id === req.params.id);

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    if (status) report.status = status;
    if (assignedTo) report.assignedTo = assignedTo;
    if (comment) {
      report.comments.push({
        timestamp: new Date().toISOString(),
        text: comment
      });
    }

    saveJSON(REPORTS_FILE, reports);
    res.json(report);
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
