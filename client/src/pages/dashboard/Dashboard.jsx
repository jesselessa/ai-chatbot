import { useState } from "react";
import "./dashboard.css";
import { useUser } from "@clerk/clerk-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

// Component
import PromptForm from "../../components/promptForm/PromptForm.jsx";

const Dashboard = () => {
  const { user } = useUser();

  const navigate = useNavigate();

  // Access the client
  const queryClient = useQueryClient();

  // Create a new chat
  const mutation = useMutation({
    mutationFn: async (text) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (chatId) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${chatId}`);
    },
    onError: (err) => {
      console.error("Error creating chat:", err.message);
    },
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value.trim();
    if (!text) return;

    mutation.mutate(text);
  };

  return (
    <div className="dashboard">
      <div className="texts">
        <h1>
          {user?.firstName
            ? `Hello ${user.firstName}\u00A0!`
            : "Hello, I'm Jessbot\u00A0!"}
          <br />
          <span className="subtitle">How can I help you&nbsp;?</span>
        </h1>

        <div className="options">
          <div className="option">
            <img src="/chat.png" alt="chat" />
            <span>Create a new chat</span>
          </div>

          <div className="option">
            <img src="/image.png" alt="images" />
            <span>Analyze images</span>
          </div>

          <div className="option">
            <img src="/code.png" alt="code" />
            <span>Help me with my code</span>
          </div>
        </div>
      </div>

      <PromptForm includeFileInput={false} onSubmit={handleSubmit} />
    </div>
  );
};

export default Dashboard;
