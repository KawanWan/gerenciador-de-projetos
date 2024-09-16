"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppContext } from "@/context";

interface Task {
  id: number;
  name: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  userId: number;
}

interface Participant {
  id: number;
  name: string;
}

interface TaskListProps {
  projectId: number;
  participants: Participant[];
}

const TaskList: React.FC<TaskListProps> = ({ projectId, participants }) => {
  const { loggedIn, user } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    description: "",
    userId: 0,
    dueDate: "",
    status: "PENDING",
  });
  const getParticipantInitial = (userId: number) => {
    const participant = participants.find((p) => p.id === userId);
    return participant ? participant.name.charAt(0).toUpperCase() : "?";
  };

  const parseDateForBackend = (date: string) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date format:", date);
      return "";
    }
    return parsedDate.toISOString();
  };

  const fetchTasks = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/tasks?projectId=${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [projectId, user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const deleteTask = async (id: number) => {
    if (!loggedIn) return;

    try {
      await fetch(`/api/tasks/?taskId=${id}`, {
        method: "DELETE",
      });

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const editTask = (task: Task) => {
    setIsEditing(true);
    setFormData({
      id: task.id,
      name: task.name,
      description: task.description,
      userId: task.userId,
      dueDate: task.dueDate,
      status: task.status,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          userId: formData.userId,
          dueDate: parseDateForBackend(formData.dueDate),
          projectId: projectId,
        }),
      });

      if (!response.ok) throw new Error("Failed to create task");

      const newTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]);

      setFormData({
        id: 0,
        name: "",
        description: "",
        userId: 0,
        dueDate: "",
        status: "PENDING",
      });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loggedIn || !user) return;

    try {
      const response = await fetch("/api/tasks?taskId=" + formData.id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          userId: formData.userId,
          dueDate: parseDateForBackend(formData.dueDate),
          status: formData.status,
          projectId: projectId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update task");
      }

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === formData.id ? updatedTask : task)),
      );
      setFormData({
        id: 0,
        name: "",
        description: "",
        userId: 0,
        dueDate: "",
        status: "PENDING",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  if (!loggedIn || !user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <>
      <div className="container mt-4">
        <div className="jumbotron">
          <h1 className="display-4">Tarefas</h1>

          <div className="card mt-5">
            <div className="card-header">
              {isEditing ? "Editar Tarefa" : "Adicionar Tarefa"}
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
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group mt-2">
                  <label>Data de Vencimento</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group mt-2">
                  <label>Atribuir para</label>
                  <select
                    className="form-select"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                  >
                    <option value="">Selecionar participante</option>
                    {participants.map((participant) => (
                      <option key={participant.id} value={participant.id}>
                        {participant.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group mt-2">
                  <label>Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="PENDING">Pendente</option>
                    <option value="IN_PROGRESS">Em Progresso</option>
                    <option value="COMPLETED">Concluída</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary mt-2">
                  {isEditing ? "Atualizar" : "Salvar"}
                </button>
              </form>
            </div>
          </div>

          <div className="mt-4">
            <h2>Lista de Tarefas</h2>
            <ol className="list-group list-group-numbered">
              {tasks.length === 0 ? (
                <li className="list-group-item">Nenhuma tarefa encontrada</li>
              ) : (
                tasks.map((task) => (
                  <li
                    key={task.id}
                    className="list-group-item d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{task.name}</div>
                      <p>{task.description}</p>
                      <small>
                        Data de Vencimento:{" "}
                        {new Date(task.dueDate).toLocaleDateString()}
                      </small>
                    </div>
                    <div
                      className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                      style={{
                        width: "40px",
                        height: "40px",
                        fontSize: "18px",
                      }}
                    >
                      {getParticipantInitial(task.userId)}
                    </div>
                    <div>
                      <span
                        className={`badge ${task.status === "COMPLETED" ? "bg-success" : task.status === "IN_PROGRESS" ? "bg-warning" : "bg-secondary"}`}
                      >
                        {task.status}
                      </span>
                      <div className="d-flex justify-content-end mt-2 gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => editTask(task)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteTask(task.id)}
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
};

export default TaskList;
