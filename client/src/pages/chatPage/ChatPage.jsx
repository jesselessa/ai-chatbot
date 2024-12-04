import { useRef, useState, useEffect } from "react";
import "./chatPage.css";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini.js";
import Markdown from "react-markdown";

// Components
import PromptForm from "../../components/promptForm/PromptForm";
import Loader from "../../components/loader/Loader";

const ChatPage = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(""); // 'isLoading' no longer needed because we use stream chat
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  //! We use 'useRef' because we want to retain a value between renders without triggering a new render when the value changes
  const chatEndRef = useRef(null);
  const formRef = useRef();
  const imgRef = useRef();

  // Create a streamed chat with history
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
    generationConfig: {
      // maxOutputTokens: 100,
      // temperature: 0.7, // Generate more creative answers
    },
  });

  // Scroll automatically to the bottom of the page
  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [question, answer, img.dbData]); // Update when dependencies change

  const generateResponse = async (prompt) => {
    // Reset answer before accumulating text
    setAnswer("");

    try {
      // Call AI model (streamed chat with history)
      const result = await chat.sendMessageStream(
        // Check if image exists
        Object.entries(img.aiData)?.length ? [img.aiData, prompt] : [prompt]
      );

      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;

        // Update answer with result
        setAnswer(accumulatedText);
      }

      // Reset image
      setImg({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {},
      });
    } catch (error) {
      if (error.message.includes("SAFETY")) {
        setAnswer(
          "I'm sorry, I can't answer this request. Try another question."
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
        {/* Handle image display */}
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
            ref={imgRef}
            alt="uploaded image"
          />
        )}

        {/* Handle question and answer display */}
        {question && <div className="message user">{question}</div>}

        {answer && (
          <div className="message">
            <Markdown>{answer}</Markdown>
          </div>
        )}

        <div className="chat-end" ref={chatEndRef}></div>
      </div>

      <PromptForm
        setQuestion={setQuestion}
        img={img}
        setImg={setImg}
        onSubmit={generateResponse}
        ref={formRef}
      />
    </div>
  );
};

export default ChatPage;
