import dotenv from "dotenv";
dotenv.config({ path: new URL("../.env", import.meta.url) });

import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./swagger.js";
import { makeGeminiClient } from "./geminiClient.js";
import { makeRoutes } from "./routes.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 8787;
const MODEL_ID = process.env.MODEL_ID || "gemini-1.5-flash";

const app = express();

app.use(helmet()); 

app.use(cors({
    origin: ["http://localhost:5173", "https://safesite-app.vercel.app"], 
    credentials: true
}));
app.use(express.json({ limit: "10mb" }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const ai = makeGeminiClient();

app.use("/api", makeRoutes({ ai, modelId: MODEL_ID }));

app.listen(PORT, () => {
  console.log(`[server] SafeSite running on http://localhost:${PORT} (model=${MODEL_ID})`);
  console.log(`[server] Swagger Docs em http://localhost:${PORT}/api-docs`);
});