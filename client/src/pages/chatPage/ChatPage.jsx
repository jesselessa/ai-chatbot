import { useRef, useState, useEffect, Fragment } from "react";
import "./chatPage.css";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown";
import model from "../../lib/gemini.js";

// Components
import PromptForm from "../../components/promptForm/PromptForm";
import Loader from "../../components/loader/Loader";

const ChatPage = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {}, // IK uploaded image data
    aiData: {}, // Data generated via AI from image
  });

  const chatEndRef = useRef(null);

  const { chatId } = useParams();

  // Automatically scroll to the bottom when new content is added
  useEffect(() => {
    if (chatEndRef.current)
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [question, answer, img.dbData]);

  // Fetch chat data
  const fetchChatData = async (chatId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${chatId}`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch chat data: ${res.statusText}`);
      }

      const data = await res.json();
      return data;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form sent !");
    e.target.reset(); // Clear form after submission
  };

  return (
    <div className="chatPage">
      <div className="chat">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <p>Something went wrong! Please try again later.</p>
        ) : (
          chatData?.history?.map((message, index) => (
            <Fragment key={message._id}>
              {/* Show image (optional) */}
              {message.img && (
                <IKImage
                  urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                  path={message.img}
                  width="400"
                  height="300"
                  transformation={[{ width: 400, height: 300 }]}
                  loading="lazy"
                  // During process of lazy loading, show low quality image
                  lqip={{ active: true, quality: 20 }}
                />
              )}

              {/* Show questions and answers */}
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

      <PromptForm chatData={chatData} onSubmit={handleSubmit} />
    </div>
  );
};

export default ChatPage;
