import { useRef, useEffect } from "react";
import "./chatPage.css";

// Component
import PromptForm from "../../components/promptForm/PromptForm";

const ChatPage = () => {
  //! We use 'useRef' because we want to retain a value between renders without triggering a new render when the value changes
  const formRef = useRef();
  const chatEndRef = useRef(null);

  // Scroll automatically to the bottom of the page when opening ChatPage
  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="chatPage">
      <div className="chat">
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        <div className="message">Test message from AI</div>
        <div className="message user">Test message from user</div>
        
        <div className="chat-end" ref={chatEndRef}></div>

        <PromptForm />
      </div>
    </div>
  );
};

export default ChatPage;
