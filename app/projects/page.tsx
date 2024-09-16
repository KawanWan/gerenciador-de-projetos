"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import { useAppContext } from "@/context";

interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const { loggedIn, user } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    description: "",
  });
  const router = useRouter();

  const fetchProjects = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/projects?userId=${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const deleteProject = async (id: number) => {
    if (!loggedIn) return;

    try {
      await fetch(`/api/projects?projectId=${id}`, {
        method: "DELETE",
      });

      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== id),
      );
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const editProject = (project: Project) => {
    setIsEditing(true);
    setFormData({
      id: project.id,
      name: project.name,
      description: project.description,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loggedIn || !user) return;

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          userId: user.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to create project");

      const newProject = await response.json();
      setProjects((prevProjects) => [...prevProjects, newProject]);

      setFormData({
        id: 0,
        name: "",
        description: "",
      });
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loggedIn || !user) return;

    try {
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: formData.id,
          name: formData.name,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update project");
      }

      const updatedProject = await response.json();
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === formData.id ? updatedProject : project,
        ),
      );
      setFormData({
        id: 0,
        name: "",
        description: "",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleProjectClick = (id: number) => {
    router.push(`/tasks/${id}`);
  };

  if (!loggedIn || !user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <>
      <Layout />

      <div className="container mt-4">
        <div className="jumbotron">
          <h1 className="display-4">Meus Projetos</h1>

          <div className="card mt-5">
            <div className="card-header">
              {isEditing ? "Editar Projeto" : "Adicionar Projeto"}
            </div>
            <div className="card-body">
              <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
                <div className="form-group mt-2">
                  <label>Nome</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group mt-2">
                  <label>Descrição</label>
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                {isEditing ? (
                  <button type="submit" className="btn btn-primary mt-2">
                    Atualizar
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary mt-2">
                    Salvar
                  </button>
                )}
              </form>
            </div>
          </div>

          <div className="mt-4">
            <h2>Lista de Projetos</h2>
            <ol className="list-group list-group-numbered">
              {projects.length === 0 ? (
                <li className="list-group-item">No projects found</li>
              ) : (
                projects.map((project) => (
                  <li
                    key={project.id}
                    className="list-group-item d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">
                        <p>{project.name}</p>
                      </div>
                      {project.description}
                    </div>
                    <div>
                      <span className="badge text-bg-primary rounded-pill d-flex justify-content-center">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <div className="d-flex justify-content-end mt-2 gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleProjectClick(project.id)}
                        >
                          Visualizar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => editProject(project)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteProject(project.id)}
                        >
                          Deletar
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
