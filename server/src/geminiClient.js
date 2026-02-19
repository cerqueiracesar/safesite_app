import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Configuração para caminhos de arquivo (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORREÇÃO 1: Caminho do arquivo.
// Assume que system-prompt.txt está na pasta 'server' (um nível acima de 'src')
const SYSTEM_PROMPT_PATH = path.join(__dirname, "../../prompts/system-prompt.txt");

export function makeGeminiClient() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // CORREÇÃO 2: Nome do Modelo.
  // Mudamos de 'gemini-2-flash' (que não existe) para 'gemini-1.5-flash' (estável)
  const modelId = process.env.MODEL_ID || "gemini-2.5-flash"; 

  const model = genAI.getGenerativeModel({ model: modelId });

  return {
    async analyzeReport(description) {
      try {
        // 1. Tentar ler o System Prompt
        let systemInstruction = "";
        try {
            if (fs.existsSync(SYSTEM_PROMPT_PATH)) {
                systemInstruction = fs.readFileSync(SYSTEM_PROMPT_PATH, "utf-8");
                console.log("✅ System Prompt carregado com sucesso.");
            } else {
                console.warn(`⚠️ AVISO: system-prompt.txt não encontrado em: ${SYSTEM_PROMPT_PATH}`);
                // Instrução de emergência caso o arquivo falhe
                systemInstruction = `
                  Você é um especialista em segurança do trabalho.
                  IMPORTANTE: Se o relato mencionar corpo, morte, arma ou crime, classifique como CRITICAL e categoria POLICIAL.
                  Responda apenas com JSON válido.
                `;
            }
        } catch (err) {
            console.error("Erro ao ler arquivo de prompt:", err);
        }

        // 2. Montar o prompt final
        const prompt = `${systemInstruction}\n\n---\n\nRELATO DE ENTRADA:\n"${description}"`;

        console.log(`🚀 Enviando para modelo (${modelId}): "${description.substring(0, 50)}..."`);

        // 3. Chamar a IA
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // 4. Limpeza da resposta (Markdown Clean)
        // Remove ```json, ``` e espaços extras
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        // 5. Parse do JSON
        const analysis = JSON.parse(text);
        
        return analysis;

      } catch (error) {
        console.error("❌ Erro na análise da IA:", error);
        
        // Retorno de Fallback (Segurança)
        return {
          riskLevel: "medium", // Valor padrão seguro
          category: "outro",
          summary: "Erro na análise automática (Verificar manualmente)",
          recommendedActions: ["Verificar relato original", "Contactar suporte de TI"],
          estimatedTimeToResolve: 0
        };
      }
    },
  };
}