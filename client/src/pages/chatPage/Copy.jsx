import { useRef, useState, useEffect } from "react";
import "./chatPage.css";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown";
import model from "../../lib/gemini.js";

// Components
import PromptForm from "../../components/promptForm/PromptForm.jsx";
import Loader from "../../components/loader/Loader.jsx";

const Copy = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {}, // Data generated via AI from image
  });

  const chatEndRef = useRef(null);
  const imgRef = useRef(null);
  const formRef = useRef(null);

  const { chatId } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  // Automatically scroll to the bottom when new content is added
  useEffect(() => {
    if (chatEndRef.current)
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [question, answer, img.dbData]);

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
    generationConfig: {
      // maxOutputTokens: 100,
    },
  });

  const generateResponse = async (prompt) => {
    setAnswer(""); // Reset before accumulating text

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle text field
    const text = e.target.text.value.trim();
    if (!text) {
      setQuestion("Ask your question.");
      return;
    }

    setQuestion(text); // Update parent state
    await generateResponse(text);
    e.target.reset(); // Reset form after submission
  };

  return (
    <div className="chatPage">
      <div className="chat">
        {/* Display loader while image is processing */}
        {img.isLoading && (
          <Loader width="30px" height="30px" border="3px solid transparent" />
        )}

        {/* Display uploaded image */}
        {img.dbData?.filePath && (
          <IKImage
            urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
            path={message.img}
            width="400"
            height="300"
            transformation={[{ width: 400, height: 300 }]}
            loading="lazy"
            // During process of lazy loading, show a loer quality image
            lqip={{ active: true, quality: 20 }}
          />
        )}

        {/* Display question and answer */}
        {question && <div className="message user">{question}</div>}

        {answer && (
          <div className="message">
            <Markdown>{answer}</Markdown>
          </div>
        )}

        {/* Auto-scroll reference */}
        <div className="chat-end" ref={chatEndRef}></div>
      </div>

      <PromptForm
        setImg={setImg}
        generateResponse={generateResponse}
        onSubmit={handleSubmit}
        ref={formRef}
      />
    </div>
  );
};

export default Copy;
