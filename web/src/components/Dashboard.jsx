import { RiskCard } from "./RiskCard";

export function Dashboard({ reports, config, loading, onResolve, onDelete }) {
  if (!config) {
    return <div className="loading">Carregando configurações...</div>;
  }

  const now = new Date();
  const DOIS_DIAS_EM_MS = 2 * 24 * 60 * 60 * 1000;

  // 1. Remove os resolvidos há mais de 2 dias
  const visibleReports = reports.filter(r => {
    if (r.status !== "resolved") return true; // Mostra todos os abertos
    
    // Se está resolvido, calcula a diferença de dias
    const resolvedDate = r.resolvedAt ? new Date(r.resolvedAt) : new Date(r.timestamp);
    return (now - resolvedDate) < DOIS_DIAS_EM_MS;
  });

  // 2. Só conta os relatos que estão "open" (Abertos)
  const openReports = visibleReports.filter(r => r.status === "open");

  // Agrupar por risco
  const grouped = {
    critical: reports.filter((r) => r.aiAnalysis.riskLevel === "critical"),
    high: reports.filter((r) => r.aiAnalysis.riskLevel === "high"),
    medium: reports.filter((r) => r.aiAnalysis.riskLevel === "medium"),
    low: reports.filter((r) => r.aiAnalysis.riskLevel === "low")
  };

  const statusCounts = {
    open: reports.filter((r) => r.status === "open").length,
    resolved: reports.filter((r) => r.status === "resolved").length
  };

  return (
    <div className="dashboard">
      <div className="status-bar">
        <div className="status-item critical">
          <span className="status-icon">🔴</span>
          <span className="status-label">CRÍTICAS</span>
          <span className="status-count">{grouped.critical.length}</span>
        </div>
        <div className="status-item high">
          <span className="status-icon">🟠</span>
          <span className="status-label">ALTOS</span>
          <span className="status-count">{grouped.high.length}</span>
        </div>
        <div className="status-item medium">
          <span className="status-icon">🟡</span>
          <span className="status-label">MÉDIOS</span>
          <span className="status-count">{grouped.medium.length}</span>
        </div>
        <div className="status-item low">
          <span className="status-icon">🟢</span>
          <span className="status-label">BAIXOS</span>
          <span className="status-count">{grouped.low.length}</span>
        </div>
      </div>

      <div className="reports-stats">
        <div className="stat-open">Abertos: {statusCounts.open}</div>
        <div className="stat-resolved">Resolvidos: {statusCounts.resolved}</div>
      </div>

      {loading ? (
        <div className="loading">Carregando relatos...</div>
      ) : reports.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum relato registrado ainda.</p>
          <small>Use o formulário acima para registrar a primeira situação!</small>
        </div>
      ) : (
        <div className="reports-container">
          {visibleReports.map((report) => (
            <RiskCard key={report.id} report={report} config={config} onResolve={onResolve} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
