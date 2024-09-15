"use client";

import Cookies from "js-cookie";
import { useAppContext } from "@/context";

export default function Layout() {
  const { loggedId } = useAppContext();
  const logout = () => {
    Cookies.remove("jwt");
    window.location.href = "/login";
  };

  return (
    <>
      <nav>
        <h4>Finanças Pessoais</h4>
        <ul>
          <li>
            <a href="/">Home {}</a>
          </li>

          {loggedId ? (
            <>
              <li>
                <a href="/movimentacoes">Movimentações</a>
              </li>
              <li>
                <a href="/profile">Perfil</a>
              </li>
              <li>
                <a href="#" onClick={logout}>
                  Logout
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/login">Login</a>
              </li>
              <li>
                <a href="/register">Registrar</a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}
