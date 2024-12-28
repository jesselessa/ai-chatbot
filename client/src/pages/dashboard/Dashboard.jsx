import "./dashboard.css";
import { useUser } from "@clerk/clerk-react";

// Component
import PromptForm from "../../components/promptForm/PromptForm.jsx";

const Dashboard = () => {
  const { user } = useUser();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle text field
    const text = e.target.text.value.trim();
    if (!text) return;

    await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text }),
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
