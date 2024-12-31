import { useRef, useState, useEffect, Fragment } from "react";
import "./chatPage.css";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown";
import model from "../../lib/gemini.js";

// Components
import PromptForm from "../../components/promptForm/PromptForm.jsx";
import Loader from "../../components/loader/Loader.jsx";

const ChatPage = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {}, // IK uploaded image data
    aiData: {}, // Data generated by AI from image
  });

  const chatEndRef = useRef(null);

  const { chatId } = useParams();
  const queryClient = useQueryClient();

  // Automatically scroll to the bottom when new content is added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [question, answer, img.dbData]);

  // Fetch chat data
  const fetchChatData = async (chatId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${chatId}`,
        { credentials: "include" }
      );
      if (!res.ok)
        throw new Error(`Failed to fetch chat data: ${res.statusText}`);
      return res.json();
    } catch (err) {
      console.error("Error in fetchChatData:", err.message);
      throw err;
    }
  };

  const {
    isLoading,
    error,
    data: chatData,
  } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => fetchChatData(chatId),
  });

  // Update chat data
  const updateChat = async (question, answer, img) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${chatId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: question.length ? question : undefined,
            answer,
            img: img.dbData?.url || undefined,
          }),
        }
      );
      if (!res.ok) throw new Error(`Failed to update chat: ${res.statusText}`);
      return res.json();
    } catch (err) {
      console.error("Error in updateChat:", err.message);
      throw err;
    }
  };

  const updateMutation = useMutation({
    mutationFn: ({ question, answer, img }) =>
      updateChat(question, answer, img),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
      // Reset states
      setQuestion("");
      setAnswer("");
      setImg({ isLoading: false, error: "", dbData: {}, aiData: {} });
    },
    onError: (err) => {
      console.error("Error updating chat:", err.message);
    },
  });

  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: "Hello" }] },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
    generationConfig: {},
  });

  const generateResponse = async (prompt) => {
    setAnswer("");
    try {
      const result = await chat.sendMessageStream(
        Object.keys(img.aiData).length ? [img.aiData, prompt] : [prompt]
      );

      let accumulatedText = "";
      for await (const chunk of result.stream) {
        accumulatedText += chunk.text();
        setAnswer(accumulatedText);
      }

      updateMutation.mutate({ question: prompt, answer: accumulatedText, img });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value.trim();
    console.log("e.target", e.target);
    if (!text) {
      setAnswer("Ask your question.");
      return;
    }

    setQuestion(text);
    await generateResponse(text);
  };

  return (
    <div className="chatPage">
      <div className="chat">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <p>Something went wrong&nbsp;! Please, try again later.</p>
        ) : (
          chatData?.history?.map((message) => (
            <Fragment key={message._id}>
              {message.img && (
                <IKImage
                  urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                  path={message.img}
                  width="400"
                  height="300"
                  transformation={[{ width: 400, height: 300 }]}
                  loading="lazy"
                  lqip={{ active: true, quality: 20 }}
                />
              )}
              <div
                className={message.role === "user" ? "message user" : "message"}
              >
                <Markdown>{message.parts[0].text}</Markdown>
              </div>
            </Fragment>
          ))
        )}

        {/* Auto-scroll anchor */}
        <div ref={chatEndRef} />
      </div>
      <PromptForm
        question={question}
        setQuestion={setQuestion}
        setImg={setImg}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ChatPage;
