"use client";

import Layout from "@/components/layout";
import { useState, useEffect } from "react";
import { useAppContext } from "@/context";

export default function EditUser() {
  const { user } = useAppContext();
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    photo: null as string | File | null,
  });

  const bufferToBase64 = (buffer: Buffer) => {
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  };

  useEffect(() => {
    if (user) {
      const userPhoto =
        user.photo instanceof Buffer ? bufferToBase64(user.photo) : user.photo;

      setFormData({
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        password: "",
        passwordConfirm: "",
        photo: userPhoto || null,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prevState) => ({
      ...prevState,
      photo: file,
    }));
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const trimmedPassword = formData.password.trim();
    const trimmedPasswordConfirm = formData.passwordConfirm.trim();

    console.log("Senha:", trimmedPassword);
    console.log("Confirmação de Senha:", trimmedPasswordConfirm);

    if (
      (trimmedPassword || trimmedPasswordConfirm) &&
      trimmedPassword !== trimmedPasswordConfirm
    ) {
      alert("As senhas não coincidem!");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("id", formData.id.toString());
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    if (formData.password) {
      formDataToSend.append("password", formData.password);
    }
    if (formData.passwordConfirm) {
      formDataToSend.append("passwordConfirm", formData.passwordConfirm);
    }
    if (formData.photo instanceof File) {
      formDataToSend.append("photo", formData.photo);
    }

    try {
      const response = await fetch("/api/edit-user", {
        method: "PUT",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Usuário atualizado com sucesso!");
        window.location.href = "/profile";
      } else {
        alert(`Erro: ${data.message}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
      alert("Erro ao atualizar o usuário.");
    }
  };

  return (
    <>
      <Layout />

      <div className="container mt-4">
        <div className="card">
          <div className="card-header">Formulário de Edição</div>
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
                  placeholder="Deixe em branco para manter a senha atual"
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
                  placeholder="Deixe em branco se não alterar a senha"
                />
              </div>

              <div className="form-group mt-2">
                <label>Foto</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                />
              </div>

              <button onClick={handleClick} className="btn btn-primary mt-2">
                Atualizar Usuário
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
