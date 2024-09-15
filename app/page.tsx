"use client";

import Layout from "@/components/layout";
import { useAppContext } from "@/context";

export default function Home() {
  const { loggedIn } = useAppContext();

  if (!loggedIn) {
    window.location.href = "/login";
  }
  return (
    <>
      <Layout />

      <div className="container mt-4">
        <div className="jumbotron">
          <h1 className="display-4">Desafio MindGroup</h1>
          <p className="lead">
            Sistema de Gerenciamento de Projetos e Tarefas.
          </p>
          <hr className="my-4" />
          <p>
            Solução para o desafio proposto pela MindGroup utilizando Typescript
            como linguagem, ReactJS e NextJS como Frontend, NodeJS como backend
            e MySQL com o prisma como ORM do banco de dados
          </p>
          <p className="lead">
            <a className="btn btn-primary btn-lg" href="/profile" role="button">
              Visualizar Perfil
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
