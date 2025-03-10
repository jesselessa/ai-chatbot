import { useRef, useState, useEffect, Fragment } from "react";
import "./chatPage.css";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown";

// Components
import PromptForm from "../../components/promptForm/PromptForm.jsx";
import Loader from "../../components/loader/Loader.jsx";

const ChatPage = () => {
  const [question, setQuestion] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    dbData: {}, // Image data uploaded with ImageKit (IK)
    aiData: {}, // Image data provided for Gemini request
  });
  const [imgUrl, setImgUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const chatEndRef = useRef(null);
  const { chatId } = useParams();
  const queryClient = useQueryClient();

  // Fetch chat data from API
  const fetchChatData = async (chatId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/chats/${chatId}`,
        { credentials: "include" }
      );

      if (!res.ok) {
        const errorMsg = await res.text();

        if (res.status === 404) {
          console.error("No chat found");
          return { history: [] }; // Empty array = chat not found
        }
        throw new Error(`Failed to fetch chat: ${res.status} - ${errorMsg}`);
      }
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error in fetchChatData:", err.message);
      throw err; // Relaunch the error for React Query
    }
  };

  // Manage chat data with React Query
  const {
    isPending,
    error,
    data: chatData = { history: [] }, // By default, an empty array
  } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => fetchChatData(chatId),
  });

  // Generate AI response
  const generateAiResponse = async (prompt, imageUrl) => {
    try {
      const body = {
        ...(question && { question: prompt }), // Prevent initial message to be displayed twice
        ...(imageUrl && { img: imageUrl }),
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/chats/${chatId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const errorMsg = await res.text();
        throw new Error(
          `Failed to update chat: ${res.statusText} - ${errorMsg}`
        );
      }
      const data = await res.json();

      // Invalidate query to update databases
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
      queryClient.invalidateQueries({ queryKey: ["userChats"] }); // Update Menu
    } catch (err) {
      console.error(err);
    }
  };

  // Generate AI response for initial message
  useEffect(() => {
    const firstMessage = chatData?.history[0];
    if (chatData?.history?.length === 1 && firstMessage?.role === "user")
      generateAiResponse(firstMessage.parts[0]?.text);
  }, [chatData?.history]);

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatData?.history?.length, img.dbData?.url]);

  // Update image URL when data is available
  useEffect(() => {
    if (img.dbData?.url) setImgUrl(img.dbData.url);
  }, [img.dbData?.url]);

  // Handle form submission
  const handleSubmit = async (form) => {
    const text = form.text.value.trim();
    if (!text) return;

    setQuestion(text);
    setIsGenerating(true);

    try {
      await generateAiResponse(text, img.dbData?.url);
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      // Reset states
      setQuestion("");
      setImg({
        isLoading: false,
        dbData: {},
        aiData: {},
      });
      setImgUrl("");
      setIsGenerating(false);
    }
  };

  return (
    <div className="chatPage">
      <div className="chat">
        {isPending ? (
          <Loader width="40px" height="40px" border="4px solid transparent" />
        ) : error ? (
          <p>Something went wrong! Please try again later.</p>
        ) : (
          <>
            {/* DISPLAY CHAT MESSAGES */}
            {chatData?.history?.map((message, index) => (
              <Fragment key={index}>
                {/* Display image if it exists */}
                {message.img && (
                  <IKImage
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    src={message.img}
                    height="300"
                    width="400"
                    transformation={[{ height: 300, width: 400 }]}
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                    alt="uploaded image"
                  />
                )}

                {/* Display text */}
                <div
                  className={
                    message.role === "user" ? "message user" : "message"
                  }
                >
                  <Markdown className="markdown">
                    {message.parts[0].text}
                  </Markdown>
                </div>
              </Fragment>
            ))}
          </>
        )}

        {/* DISPLAY A NEW IMAGE */}

        {/* Display loader while loading image */}
        {img?.isLoading && (
          <Loader
            className="img-loader"
            width="40px"
            height="40px"
            border="4px solid transparent"
          />
        )}

        {/* Display image if loaded successfully */}
        {!img?.isLoading && img?.dbData?.url?.trim() && (
          <IKImage
            urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
            src={img.dbData.url}
            height="300"
            width="400"
            transformation={[{ height: 300, width: 400 }]}
            loading="lazy"
            lqip={{ active: true, quality: 20 }}
            alt="uploaded image"
          />
        )}

        {/* Auto-scroll anchor */}
        <div ref={chatEndRef} />
      </div>

      <PromptForm
        question={question}
        setQuestion={setQuestion}
        setImg={setImg}
        isGenerating={isGenerating}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ChatPage;
