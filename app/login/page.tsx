"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import Loading from "@/components/loading";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!email || !password) {
      alert("Informe email e senha!");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    setLoading(false);

    if (response.ok) {
      const result = await response.json();

      Cookies.set("jwt", result.token);

      window.location.href = "/profile";
    } else {
      alert("Email ou Senha incorretos");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <nav>
        <h4>Gerenciador de Projetos</h4>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/login">Login</a>
          </li>
          <li>
            <a href="/register">Registrar</a>
          </li>
        </ul>
      </nav>

      <div className="container mt-4">
        <div className="card">
          <div className="card-header">Formulário de Login</div>
          <div className="card-body">
            <div className="form-group mt-2">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group mt-2">
              <label>Senha</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button onClick={handleClick} className="btn btn-primary mt-2">
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
