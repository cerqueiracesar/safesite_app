import { useEffect, useState } from "react";
import { fetchReports, fetchConfig, updateReport } from "./api";
import { ReportForm } from "./components/ReportForm";
import { Dashboard } from "./components/Dashboard";
import { LoginModal } from "./components/LoginModal";
import "./styles.css";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [siteId] = useState("obra-001");

  // Autenticação ao carregar
  useEffect(() => {
    const saved = localStorage.getItem("safesite_user");
    if (saved) {
      setCurrentUser(saved);
    }
  }, []);

  // Carregar dados quando usuário faz login
  useEffect(() => {
    if (!currentUser) return;

    async function loadData(showLoading = true) {
      try {
        if (showLoading) setLoading(true);
        const [reportsData, configData] = await Promise.all([
          fetchReports(siteId),
          fetchConfig()
        ]);
        setReports(reportsData);
        setConfig(configData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        if (showLoading) setLoading(false);
      }
    }

    loadData(true);
    
    const interval = setInterval(() => {
        loadData(false); 
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentUser, siteId]);

  function handleReportSubmitted(newReport) {
    setReports((prev) => [newReport, ...prev]);
  }

  // <-- A NOVA FUNÇÃO DE RESOLUÇÃO COM SEGURANÇA JWT
  async function handleResolveReport(id) {
    try {
      // 1. Tenta atualizar no backend. Se não tiver Token, o api.js vai disparar o erro.
      const updatedReport = await updateReport(id, {
        status: "resolved",
        comment: "Situação verificada e resolvida de forma segura."
      });

      // 2. Se deu certo (Token válido), atualiza a tela na mesma hora
      setReports((prevReports) =>
        prevReports.map((report) => (report.id === id ? updatedReport : report))
      );
    } catch (error) {
      // 3. Se o Token for inválido, o alerta aparece na tela!
      alert(error.message); 
      console.error("Erro ao resolver relato:", error);
    }
  }

  function handleLogout() {
    localStorage.removeItem("safesite_user");
    localStorage.removeItem("safesite_token"); // <-- Remove o token também
    setCurrentUser(null);
  }

  if (!currentUser) {
    return <LoginModal onLogin={setCurrentUser} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>🏗️ CanteiroSeguro</h1>
          <p>Canteiro: Obra Centro | {new Date().toLocaleDateString("pt-BR")}</p>
        </div>
        <div className="header-right">
          <span className="user-badge">👤 {currentUser}</span>
          <button onClick={handleLogout} className="logout-btn">
            Sair
          </button>
        </div>
      </header>

      <main className="app-main">
        <section className="form-section">
          <ReportForm onReportSubmitted={handleReportSubmitted} currentUser={currentUser} siteId={siteId} />
        </section>

        <section className="dashboard-section">
          {/* <-- Passando a função handleResolveReport para o Dashboard */}
          <Dashboard 
            reports={reports} 
            config={config} 
            loading={loading} 
            onResolve={handleResolveReport} 
          />
        </section>
      </main>

      <footer className="app-footer">
        <small>CanteiroSeguro v1.0 | Gestão de Segurança em Canteiro de Obras</small>
      </footer>
    </div>
  );
}