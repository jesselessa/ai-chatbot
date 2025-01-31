import { useState } from "react";
import "./dashboard.css";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation } from "@tanstack/react-query";

// Component
import PromptForm from "../../components/promptForm/PromptForm.jsx";

const Dashboard = () => {
  const [text, setText] = useState("");

  const { user } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Access the client

  // Create a new chat
  const createChat = async (text) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
        }),
      });

      if (!res.ok)
        throw new Error(
          `Failed to create chat: ${res.status} ${res.statusText}`
        );

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error in createChat:", err.message);
      throw err; // Rethrow error for further handling
    }
  };

  const mutation = useMutation({
    mutationFn: (text) => createChat(text),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      setText(""); // Clear form after submission
      navigate(`/dashboard/chats/${data.chatId}`); // Redirect to ChatPage
    },
    onError: (err) => {
      console.error("Error creating chat:", err.message);
    },
  });

  // Handle form submission
  const handleSubmit = async (form) => {
    // Access textarea via its attribute name:text using form reference
    const prompt = form.text.value.trim();
    if (!prompt) return;

    setText(prompt);
    mutation.mutate(prompt);
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

      <PromptForm
        includeFileInput={false}
        question={text}
        setQuestion={setText}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Dashboard;
