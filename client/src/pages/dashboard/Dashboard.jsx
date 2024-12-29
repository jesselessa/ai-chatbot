import { useState } from "react";
import "./dashboard.css";
import { useUser } from "@clerk/clerk-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

// Component
import PromptForm from "../../components/promptForm/PromptForm.jsx";

const Dashboard = () => {
  const [question, setQuestion] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {}, // IK uploaded image data
    aiData: {}, // Data generated via AI from image
  });

  const { user } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Create a new chat mutation
  const mutation = useMutation({
    mutationFn: async ({ text, img }) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, img }),
      });
      if (!res.ok) {
        throw new Error(`Failed to create chat: ${res.statusText}`);
      }
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      if (data?.chatId) {
        navigate(`/dashboard/chats/${data.chatId}`);
      } else {
        console.error("Chat ID missing in server response");
      }
    },
    onError: (err) => {
      console.error("Error creating chat:", err.message);
    },
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value.trim();
    const imgUrl = img?.dbData?.url;

    if (!text && !imgUrl) {
      console.error("Text or image is required to create a chat");
      return;
    }

    setQuestion(text);
    setImg((prev) => ({
      ...prev,
      dbData: { url: imgUrl },
    }));

    mutation.mutate({ text, img: imgUrl });

    // Reset form after submission
    setQuestion("");
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

      <PromptForm setImg={setImg} onSubmit={handleSubmit} />
    </div>
  );
};

export default Dashboard;
