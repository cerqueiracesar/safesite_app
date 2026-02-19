import "dotenv/config";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ ERRO: Nenhuma GEMINI_API_KEY encontrada no arquivo .env");
  process.exit(1);
}

console.log(`🔑 Usando chave: ${API_KEY.substring(0, 8)}...`);
console.log("📡 Perguntando ao Google quais modelos você pode usar...");

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("\n❌ ERRO NA API:");
      console.error(JSON.stringify(data.error, null, 2));
      return;
    }

    if (!data.models) {
      console.log("⚠️ Nenhum modelo retornado. Sua chave pode não ter a API 'Generative Language' ativada.");
      return;
    }

    console.log("\n✅ MODELOS DISPONÍVEIS PARA VOCÊ:");
    console.log("------------------------------------------------");
    
    // Filtra apenas modelos que geram conteúdo (chat)
    const chatModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    
    chatModels.forEach(model => {
      console.log(`Nome: ${model.name.replace("models/", "")}`);
      console.log(`Versão: ${model.version}`);
      console.log("------------------------------------------------");
    });

    if (chatModels.length > 0) {
      console.log(`\n💡 SUGESTÃO: Use o modelo '${chatModels[0].name.replace("models/", "")}' no seu código.`);
    }

  } catch (error) {
    console.error("Erro de conexão:", error);
  }
}

listModels();