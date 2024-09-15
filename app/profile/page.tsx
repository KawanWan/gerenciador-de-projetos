"use client";

import Layout from "@/components/layout";
import { useAppContext } from "@/context";
import Image from "next/image";

export default function Profile() {
  const { loggedIn, user } = useAppContext();

  if (!loggedIn || !user) {
    window.location.href = "/login";
    return null;
  }

  // Converte o BLOB da imagem para base64
  const base64Image = user.photo
    ? Buffer.from(user.photo).toString("base64")
    : null;

  const imageUrl = base64Image
    ? `data:image/png;base64,${base64Image}`
    : "/avatar.png";

  return (
    <>
      <Layout />
      <div className="container mt-4">
        <div className="row">
          <div className="col-4">
            <div className="card p-12">
              <div className="avatar-ctn bg-white">
                <Image
                  src={imageUrl}
                  alt="user profile picture"
                  width={100}
                  height={100}
                  className="avatar card-img-top img-fluid"
                />
              </div>

              <div className="card-body mt-2 d-flex justify-content-center flex-column">
                <div className="d-flex justify-content-center">
                  <h4 className="card-text mb-4">Informações pessoais</h4>
                </div>
                <p className="card-text">Nome: {user.name}</p>
                <p className="card-text">Email: {user.email}</p>
                <a href="/edit-user" className="btn btn-secondary">
                  Editar
                </a>
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="card text-center">
              <div className="card-header">Página de Perfil</div>
              <div className="card-body">
                <p className="card-text">Seja Bem-vindo {user.name}!</p>
                <a href="/projects" className="btn btn-primary">
                  Meus Projetos
                </a>
              </div>
              <div className="card-footer text-muted">
                Desafio - Gerenciador de Projetos
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
