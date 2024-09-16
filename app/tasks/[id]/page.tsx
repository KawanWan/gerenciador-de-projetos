"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/layout";
import { useAppContext } from "@/context";
import TaskList from "@/components/tasklist";

interface Participant {
  id: number;
  name: string;
  email: string;
}

export default function ProjectTasks() {
  const { loggedIn, user } = useAppContext();
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(true);
  const [addingParticipant, setAddingParticipant] = useState(false);
  const [newParticipantEmail, setNewParticipantEmail] = useState("");
  const [showInput, setShowInput] = useState(false);
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#F333FF",
    "#FF33A6",
    "#33FFF0",
    "#FFA533",
  ];

  useEffect(() => {
    if (!id) return;

    const fetchParticipants = async () => {
      setParticipantsLoading(true);
      try {
        const response = await fetch(
          `/api/project-participants?projectId=${id}`,
        );
        const data = await response.json();
        setParticipants(data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setParticipantsLoading(false);
      }
    };

    fetchParticipants();
  }, [id]);

  const handleAddParticipant = async () => {
    if (participants.length >= 10) {
      setError("O limite de participantes foi atingido.");
      return;
    }
    setAddingParticipant(true);
    try {
      const response = await fetch(
        `/api/verify-user?email=${newParticipantEmail}`,
      );
      const data = await response.json();

      if (response.ok) {
        console.log("User verified:", data);

        const addResponse = await fetch("/api/addUserToProject", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: id, email: newParticipantEmail }),
        });

        console.log("Add response:", addResponse);
        const addData = await addResponse.json();

        if (addResponse.ok) {
          setError(null);
          alert("Usuário adicionado ao projeto com sucesso!");
          setShowInput(false);
          setNewParticipantEmail("");
          const updatedParticipantsResponse = await fetch(
            `/api/project-participants?projectId=${id}`,
          );
          const updatedParticipants = await updatedParticipantsResponse.json();
          setParticipants(updatedParticipants);
        } else {
          setError(addData.message || "Erro ao adicionar usuário ao projeto");
        }
      } else {
        setError(data.message || "Este usuário não existe");
      }
    } catch (error) {
      console.error("Error adding participant:", error);
      setError("Erro ao adicionar participante");
    } finally {
      setAddingParticipant(false);
      setParticipantsLoading(true);
      try {
        const response = await fetch(
          `/api/project-participants?projectId=${id}`,
        );
        const data = await response.json();
        setParticipants(data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setParticipantsLoading(false);
      }
    }
  };

  if (!loggedIn || !user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <>
      <Layout />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Projeto {id}</h1>
          <div className="d-flex">
            {participantsLoading ? (
              <div className="spinner-border text-primary me-2" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            ) : participants.length === 0 ? (
              <p>Nenhum participante</p>
            ) : (
              participants.map((participant, index) => (
                <div
                  key={participant.id}
                  className="rounded-circle text-white d-flex justify-content-center align-items-center me-2"
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: colors[index % colors.length],
                  }}
                >
                  {participant.name.charAt(0).toUpperCase()}
                </div>
              ))
            )}

            <button
              className="btn btn-primary me-2"
              onClick={() => setShowInput(!showInput)}
            >
              {showInput ? "Cancelar" : "Adicionar Participante"}
            </button>
            {showInput && (
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email do novo participante"
                  value={newParticipantEmail}
                  onChange={(e) => setNewParticipantEmail(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handleAddParticipant}
                >
                  {addingParticipant ? (
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Carregando...</span>
                    </div>
                  ) : (
                    "Adicionar"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <TaskList
          projectId={parseInt(id as string, 10)}
          participants={participants}
        />
      </div>
    </>
  );
}
