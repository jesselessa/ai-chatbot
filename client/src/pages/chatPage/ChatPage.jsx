import { useRef, useState, useEffect } from "react";
import "./chatPage.css";
import { IKImage } from "imagekitio-react";

// Components
import PromptForm from "../../components/promptForm/PromptForm";
import Loader from "../../components/loader/Loader";

const ChatPage = () => {
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
  });

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

        {/* Add a new chat */}
        {img.isLoading && (
          <div className="">
            <Loader width="30px" height="30px" border="3px solid transparent" />
          </div>
        )}

        {img.dbData?.filePath && (
          <IKImage
            urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
            path={img.dbData?.filePath}
            width="380"
            transformation={[{ width: 380 }]}
            alt="uploaded image"
          />
        )}

        <div className="chat-end" ref={chatEndRef}></div>

        <PromptForm setImg={setImg} ref={formRef} />
      </div>
    </div>
  );
};

export default ChatPage;
