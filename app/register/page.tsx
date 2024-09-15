"use client";

import Layout from "@/components/layout";
import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    photo: null as File | null, // A foto será armazenada aqui
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target;

    // Se for um input de arquivo (imagem)
    if (id === "photo" && files) {
      setFormData((prevState) => ({
        ...prevState,
        photo: files[0], // Armazena o arquivo de imagem
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      alert("As senhas não coincidem!");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("password", formData.password);

    if (formData.photo) {
      formDataToSubmit.append("photo", formData.photo); // Adiciona a foto ao FormData
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: formDataToSubmit, // Envia como multipart/form-data
      });

      const data = await response.json();

      if (response.ok) {
        alert("Usuário registrado com sucesso!");
        window.location.href = "/login";
      } else {
        alert(`Erro: ${data.message}`);
      }
    } catch (error) {
      console.error("Erro ao registrar o usuário:", error);
      alert("Erro ao registrar o usuário.");
    }
  };

  return (
    <>
      <Layout />

      <div className="container mt-4">
        <div className="card">
          <div className="card-header">Formulário de Registro</div>
          <div className="card-body">
            <form>
              <div className="form-group mt-2">
                <label>Nome</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group mt-2">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group mt-2">
                <label>Senha</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group mt-2">
                <label>Confirmar Senha</label>
                <input
                  type="password"
                  className="form-control"
                  id="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group mt-2">
                <label>Foto de Perfil</label>
                <input
                  type="file"
                  className="form-control"
                  id="photo"
                  accept="image/*" // Apenas imagens serão aceitas
                  onChange={handleChange}
                />
              </div>

              <button onClick={handleClick} className="btn btn-primary mt-2">
                Registrar Usuário
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
