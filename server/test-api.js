import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function testConnection() {
  console.log("🔑 Testando chave:", process.env.GEMINI_API_KEY ? "Encontrada (Começa com " + process.env.GEMINI_API_KEY.substring(0, 5) + "...)" : "NÃO ENCONTRADA");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    console.log("📡 Conectando ao Google para listar modelos...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Tenta pegar um pra testar
    
    // Na verdade, vamos listar todos os disponiveis
    // (A SDK pode não expor o listModels facilmente dependendo da versão, 
    // então vamos testar uma geração simples com um modelo seguro)
    
    console.log("🧪 Tentando gerar texto com 'gemini-1.5-flash'...");
    const result = await model.generateContent("Oi, funcionou?");
    console.log("✅ SUCESSO! Resposta:", result.response.text());
    
  } catch (error) {
    console.error("\n❌ ERRO FATAL:");
    console.error(error.message);
    
    if (error.message.includes("404")) {
      console.log("\n💡 DIAGNÓSTICO: Erro 404 geralmente significa:");
      console.log("1. A API 'Generative Language API' não está ativada no seu projeto do Google Cloud.");
      console.log("2. A chave de API foi criada em um projeto antigo ou sem permissão.");
      console.log("3. Sua conta pode ter restrições de faturamento (embora o tier gratuito exista).");
    }
  }
}

testConnection();