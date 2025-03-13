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

    if (!res.ok) {
      const errorMsg = await res.text(); // Get error message
      throw new Error(`Failed to create chat: ${res.status} - ${errorMsg}`);
    }

    const data = await res.json();
    return data;
  };

  const mutation = useMutation({
    mutationFn: createChat,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
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

    mutation.mutate(prompt, {
      onSettled: () => setText(""), //! 'onSettled' = wether success or not
    });
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
