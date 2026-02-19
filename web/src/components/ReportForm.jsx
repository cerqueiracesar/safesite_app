import React, { useState } from "react";
import { analyzeReport } from "../api";

export function ReportForm({ onReportSubmitted, currentUser, siteId }) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim()) {
      setError("Digite uma descrição");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const report = await analyzeReport(description, siteId, currentUser);
      setDescription("");
      onReportSubmitted?.(report);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      <h3>📋 Registrar Nova Situação</h3>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descreva a situação de segurança observada..."
        rows={4}
        disabled={loading}
      />

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={loading || !description.trim()}>
        {loading ? "Analisando... ⏳" : "Registrar"}
      </button>
    </form>
  );
}
