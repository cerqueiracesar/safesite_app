const API_BASE = import.meta.env.VITE_API_URL || "";
const API_URL = `${API_BASE}/api`;

// <-- NOVA FUNÇÃO DE LOGIN
export async function loginUser(username) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  });
  if (!res.ok) throw new Error("Falha ao fazer login");
  return res.json(); // Retorna { message, token, username }
}

export async function fetchReports(siteId = "obra-001") {
  const res = await fetch(`${API_URL}/reports/${siteId}`);
  if (!res.ok) throw new Error("Failed to fetch reports");
  return res.json();
}

export async function analyzeReport(description, siteId = "obra-001", reportedBy) {
  const res = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      description,
      siteId,
      reportedBy
    })
  });
  if (!res.ok) throw new Error("Failed to analyze");
  return res.json();
}

// <-- FUNÇÃO ATUALIZADA COM O TOKEN JWT
export async function updateReport(id, updates) {
  // 1. Busca o token salvo no navegador
  const token = localStorage.getItem("safesite_token"); 
  
  // 2. Monta os cabeçalhos padrão
  const headers = { "Content-Type": "application/json" };
  
  // 3. Se tiver token, adiciona a chave de Autorização
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/reports/${id}`, {
    method: "PATCH",
    headers, // Usa os cabeçalhos montados acima
    body: JSON.stringify(updates)
  });
  
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
       throw new Error("Não autorizado. Faça login novamente.");
    }
    throw new Error("Failed to update");
  }
  
  return res.json();
}

export async function fetchConfig() {
  const res = await fetch(`${API_URL}/config`);
  if (!res.ok) throw new Error("Failed to fetch config");
  return res.json();
}

export async function fetchUsers() {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function deleteReport(id) {
  const token = localStorage.getItem("safesite_token"); 
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/reports/${id}`, {
    method: "DELETE",
    headers
  });
  
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) throw new Error("Não autorizado.");
    throw new Error("Falha ao excluir o relato");
  }
  return res.json();
}