import { useState } from "react"; 

export function RiskCard({ report, config, onResolve, onDelete }) { 
  const riskInfo = config?.riskLevels?.[report.aiAnalysis.riskLevel] || {
    color: "#666",
    icon: "⚫",
    priority: 5
  };

  const categoryName = config?.categories?.[report.aiAnalysis.category] || report.aiAnalysis.category;

  const formatDate = (dateString) => {
    if (!dateString) return "--/-- --:--";
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div
      className="risk-card"
      style={{ borderLeftColor: riskInfo.color }}
      data-risk-level={report.aiAnalysis.riskLevel}
    >
      <div className="risk-header">
        <span className="risk-icon">{riskInfo.icon}</span>
        <span className="risk-level">{report.aiAnalysis.riskLevel.toUpperCase()}</span>
        <span className="risk-time">
            📅 {formatDate(report.timestamp || report.created_at)}
        </span>
      </div>

      <div className="risk-content">
        <p className="risk-description">{report.description}</p>
        <p className="risk-summary">{report.aiAnalysis.summary}</p>
        <span className="risk-category">{categoryName}</span>
      </div>

      <div className="risk-actions">
        <strong>Ações Recomendadas:</strong>
        <ul>
          {report.aiAnalysis.recommendedActions.map((action, idx) => (
            <li key={idx}>{action}</li>
          ))}
        </ul>
      </div>

      <div className="risk-footer">
        <small>Por: {report.reportedBy} | {new Date(report.timestamp).toLocaleTimeString("pt-BR")}</small>
        
        <div style={{ display: "flex", gap: "10px" }}>
          {/* BOTÃO DE EXCLUIR */}
          <button 
            onClick={() => onDelete(report.id)} 
            style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1.2rem" }}
            title="Excluir permanentemente"
          >
            🗑️
          </button>
          
          {/* BOTÃO DE RESOLVER */}
          <button
            className={`status-btn ${report.status}`}
            onClick={() => onResolve(report.id)}
            disabled={report.status === "resolved"} 
          >
            {report.status === "open" ? "✓ Resolver" : "Resolvido"}
          </button>
        </div>
      </div>
    </div>
  );
}