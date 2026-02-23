import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SYSTEM_PROMPT_PATH = path.join(__dirname, "../../prompts/system-prompt.txt");

export function makeGeminiClient() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Como engenheiro de dados, priorizamos modelos estáveis para pipelines
  const modelId = process.env.MODEL_ID || "gemini-1.5-flash"; 

  // CONFIGURAÇÃO DE ENGENHARIA: Forçamos o esquema de resposta JSON
  const model = genAI.getGenerativeModel({ 
    model: modelId,
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  return {
    async analyzeReport(description) {
      try {
        let systemInstruction = "";
        if (fs.existsSync(SYSTEM_PROMPT_PATH)) {
          systemInstruction = fs.readFileSync(SYSTEM_PROMPT_PATH, "utf-8");
        } else {
          // Fallback estruturado para manter o pipeline rodando
          systemInstruction = "Expert in safety. Return valid JSON with riskLevel, category, summary, and recommendedActions.";
        }

        const prompt = `${systemInstruction}\n\nINPUT REPORT:\n"${description}"`;

        // Chamada da IA - O retorno já será um JSON puro, sem markdown
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        // No modo JSON, a resposta não vem com blocos de código ```json
        const analysis = JSON.parse(response.text());
        
        return analysis;

      } catch (error) {
        console.error("❌ Data Pipeline Error (IA Analysis):", error);
        
        return {
          riskLevel: "critical", // Fallback conservador para segurança
          category: "error",
          summary: "Automatic analysis failed. Record marked for manual review.",
          recommendedActions: ["Check original input", "Verify API Quota"],
          dataQualityFlag: "failed" // Metadata útil para o Engenheiro de Dados
        };
      }
    },
  };
}