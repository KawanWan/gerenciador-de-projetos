"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import Loading from "@/components/loading";

interface User {
  id: number;
  name: string;
  email: string;
  photo: Buffer | null;
}

interface AppContextType {
  loggedIn: boolean;
  user: User | null;
}

const AppContext = createContext<AppContextType>({
  loggedIn: false,
  user: null,
});

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppContextType>({
    loggedIn: false,
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
        setLoading(false);
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
        setLoading(false);
        return;
      }

      const result = await response.json();
      console.log("API result:", result);

      if (result && result.id) {
        setState({
          loggedIn: true,
          user: result,
        });
      }
    } catch (error) {
      console.error("Error checking login:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
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
