"use client";

import Cookies from "js-cookie";
import { useAppContext } from "@/context";

export default function Layout() {
  const { loggedIn } = useAppContext();
  const logout = () => {
    Cookies.remove("jwt");
    window.location.href = "/login";
  };

  return (
    <>
      <nav>
        <h4>Gerenciador de Projetos</h4>
        <ul>
          <li>
            <a href="/">Home {}</a>
          </li>

          {loggedIn ? (
            <>
              <li>
                <a href="/projects">Projetos</a>
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
