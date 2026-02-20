import { useState } from "react";
import { loginUser } from "../api"; // <-- 1. Importando a função que criamos no api.js

export function LoginModal({ onLogin }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const presets = [
    { id: "user-001", name: "João Silva" },
    { id: "user-002", name: "Carlos Supervisor" },
    { id: "user-003", name: "Maria Mestre" }
  ];

  // <-- 2. Transformamos a função em assíncrona (async/await)
  async function handleLogin(name) {
    setLoading(true);
    try {
      // 3. Bate no backend para registrar o login e pegar o Token
      const data = await loginUser(name);

      // 4. Salva o Nome e o Token (Crachá) na memória do navegador
      localStorage.setItem("safesite_user", data.username);
      localStorage.setItem("safesite_token", data.token);

      // 5. Libera a tela principal
      onLogin(data.username);
    } catch (error) {
      console.error("Falha na autenticação:", error);
      alert("Erro ao conectar com o servidor. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }

  function handleCustomLogin(e) {
    e.preventDefault();
    if (username.trim()) {
      handleLogin(username);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="login-modal">
        <h1>🏗️ SafeSite</h1>
        <h2>Gestão de Segurança em Canteiro</h2>

        <div className="login-section">
          <h3>Selecione seu perfil:</h3>
          <div className="preset-buttons">
            {presets.map((user) => (
              <button
                key={user.id}
                className="preset-btn"
                onClick={() => handleLogin(user.name)}
                disabled={loading} // <-- UX: Desabilita para evitar cliques duplos
              >
                {user.name}
              </button>
            ))}
          </div>

          <div className="divider">ou</div>

          <form onSubmit={handleCustomLogin} className="custom-login">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu nome..."
              autoFocus
              disabled={loading} // <-- UX: Desabilita o input durante o loading
            />
            <button type="submit" disabled={!username.trim() || loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}