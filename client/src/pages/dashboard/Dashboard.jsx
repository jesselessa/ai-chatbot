import "./dashboard.css";
import { useUser } from "@clerk/clerk-react";

// Component
import PromptForm from "../../components/promptForm/PromptForm.jsx";

const Dashboard = () => {
  const { user } = useUser();

  return (
    <div className="dashboard">
      <div className="texts">
        <h1>
          {user.firstName
            ? `Hello ${user.firstName}\u00A0!`
            : "Hello, I'm Jess AI\u00A0!"}
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

      <PromptForm />
    </div>
  );
};

export default Dashboard;
