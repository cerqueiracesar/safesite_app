import React, { useState } from "react";

export function LoginModal({ onLogin }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const presets = [
    { id: "user-001", name: "João Silva" },
    { id: "user-002", name: "Carlos Supervisor" },
    { id: "user-003", name: "Maria Mestre" }
  ];

  function handleLogin(name) {
    setLoading(true);
    localStorage.setItem("safesite_user", name);
    onLogin(name);
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
            />
            <button type="submit" disabled={!username.trim()}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
