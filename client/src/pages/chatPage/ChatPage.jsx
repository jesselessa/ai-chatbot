import { useRef, useState, useEffect } from "react";
import "./chatPage.css";
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown";

// Components
import PromptForm from "../../components/promptForm/PromptForm";
import Loader from "../../components/loader/Loader";

const ChatPage = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState({ isLoading: false, content: "" });
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
  });

  //! We use 'useRef' because we want to retain a value between renders without triggering a new render when the value changes
  const chatEndRef = useRef(null);
  const formRef = useRef();
  const imgRef = useRef();

  // Scroll automatically to the bottom of the page
  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [question, answer, img.dbData]); // Update when dependencies change

  return (
    <div className="chatPage">
      <div className="chat">
        {/* Display user question */}
        {question && <div className="message user">{question}</div>}

        {/* Bot answer loading */}
        {answer.isLoading && (
          <Loader width="30px" height="30px" border="3px solid transparent" />
        )}

        {/* Display bot answer */}
        {!answer.isLoading && answer.content && (
          <div className="message">
            <Markdown>{answer.content}</Markdown>
          </div>
        )}

        {/* Image loading */}
        {img.isLoading && (
          <div className="">
            <Loader width="30px" height="30px" border="3px solid transparent" />
          </div>
        )}

        {/* Image uploaded */}
        {img.dbData?.filePath && (
          <IKImage
            urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
            path={img.dbData?.filePath}
            width="380"
            transformation={[{ width: 380 }]}
            ref={imgRef}
            alt="uploaded image"
          />
        )}

        <div className="chat-end" ref={chatEndRef}></div>
      </div>

      <PromptForm
        setQuestion={setQuestion}
        setAnswer={setAnswer}
        setImg={setImg}
        ref={formRef}
      />
    </div>
  );
};

export default ChatPage;
