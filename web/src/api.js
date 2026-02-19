const API_BASE = import.meta.env.VITE_API_URL || "";
const API_URL = `${API_BASE}/api`;

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

export async function updateReport(id, updates) {
  const res = await fetch(`${API_URL}/reports/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error("Failed to update");
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
