import { useRef, useState, useEffect } from "react";
import "./chatPage.css";
import { useParams } from "react-router-dom";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini.js";
import Markdown from "react-markdown";

// Components
import PromptForm from "../../components/promptForm/PromptForm";
import Loader from "../../components/loader/Loader";

const ChatPage = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: { filePath: "" },
    aiData: {}, // Data generated via AI from image
  });

  const chatEndRef = useRef(null);
  const formRef = useRef();
  const imgRef = useRef();

  // Chat history and configuration
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
    generationConfig: {},
  });

  // Automatically scroll to the bottom when new content is added
  useEffect(() => {
    if (chatEndRef.current)
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [question, answer, img.dbData.filePath]);

  const generateResponse = async (prompt) => {
    setAnswer(""); // Reset answer before accumulating text

    // Update image state if data generated by AI
    if (Object.entries(img.aiData).length)
      setImg((prevState) => ({ ...prevState, isLoading: true }));

    try {
      // Send message with or without image
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, prompt] : [prompt]
      );

      // Accumulate IA answer
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        accumulatedText += chunk.text();
        setAnswer(accumulatedText);
      }

      // Reset image state
      setImg({ isLoading: false, error: "", dbData: {}, aiData: {} });
    } catch (error) {
      if (error.message.includes("SAFETY")) {
        setAnswer(
          "I'm sorry, I can't answer this request. Try another question."
        );
      } else if (error.message.includes("IMAGE")) {
        setImg((prevState) => ({
          ...prevState,
          error: "Image processing failed",
        }));
        setAnswer(
          "An error occurred while processing the image. Please try again."
        );
      } else {
        console.error("Error generating content:", error);
        setAnswer("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="chatPage">
      <div className="chat">
        {/* Loader while image is processing */}
        {img.isLoading && (
          <Loader width="30px" height="30px" border="3px solid transparent" />
        )}

        {/* Render uploaded image */}
        {img.dbData?.filePath && (
          <IKImage
            urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
            path={img.dbData.filePath}
            width="380"
            transformation={[{ width: 380 }]}
            ref={imgRef}
            alt="uploaded image"
          />
        )}

        {/* Render user question */}
        {question && <div className="message user">{question}</div>}

        {/* Render AI response */}
        {answer && (
          <div className="message">
            <Markdown>{answer}</Markdown>
          </div>
        )}

        {/* Auto-scroll reference */}
        <div className="chat-end" ref={chatEndRef}></div>
      </div>

      <PromptForm
        setQuestion={setQuestion}
        img={img}
        setImg={setImg}
        generateResponse={generateResponse}
        ref={formRef}
      />
    </div>
  );
};

export default ChatPage;
