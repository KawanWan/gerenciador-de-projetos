"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import Loading from "@/components/loading";

const AppContext = createContext({
  loggedId: false,
});

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({
    loggedId: false,
    user: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Executando...");
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const cookieToken = Cookies.get("jwt");
      console.log("Token:", cookieToken);

      if (!cookieToken) {
        console.log("No JWT token found");
        setLoading(false); // Se não houver cookie, termine o carregamento
        return;
      }

      const response = await fetch("/api/isLoggedIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cookieToken }),
      });

      if (!response.ok) {
        console.error("Error in API response:", response.statusText);
        setLoading(false); // API falhou, termina o carregamento
        return;
      }

      const result = await response.json();
      console.log("API result:", result);

      if (result && result.id) {
        // Supondo que a resposta traga um usuário válido
        setState({
          loggedId: true,
          user: result,
        });
      }
    } catch (error) {
      console.error("Error checking login:", error);
    } finally {
      setLoading(false); // Garante que o loading seja desativado
    }
  };

  if (loading) {
    return <Loading />; // Exibir uma mensagem de carregamento ou um spinner
  }

  return (
    <React.StrictMode>
      <AppContext.Provider value={state}>{children}</AppContext.Provider>
    </React.StrictMode>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
