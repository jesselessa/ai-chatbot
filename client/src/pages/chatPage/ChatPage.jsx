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
  const [initialResponse, setInitialResponse] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {}, // Image data uploaded with ImageKit
    aiData: {}, // Image data provided within Gemini API request
  });
  const [imgUrl, setImgUrl] = useState("");

  const chatEndRef = useRef(null);
  const { chatId } = useParams();
  const queryClient = useQueryClient();

  // Fetch chat data
  const fetchChatData = async (chatId) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/chats/${chatId}`, {
      credentials: "include",
    });

    if (!res.ok) {
      if (res.status === 404) {
        console.error("No chat found");
        return [];
      }
      throw new Error(`Failed to fetch user chats: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  };

  const {
    isPending,
    error,
    data: chatData,
  } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => fetchChatData(chatId),
  });

  // Generate response for initial message
  useEffect(() => {
    if (
      !initialResponse &&
      chatData?.history?.length === 1 &&
      chatData?.history[0]?.role === "user"
    ) {
      setInitialResponse(true); // Prevent duplications
      generateResponse(chatData?.history[0]?.parts[0]?.text);
    }
  }, [chatData?.history, initialResponse]);

  // Scroll to the latest message
  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatData?.history, img.dbData]);

  // Update image URL if available
  useEffect(() => {
    if (img.dbData?.url) setImgUrl(img.dbData.url);
  }, [img.dbData]);

  // Update chat data
  const updateChat = async ({ question, answer, img }) => {
    const body = {
      ...(question?.length && { question }),
      answer,
      ...(imgUrl && { img: imgUrl }),
    };

    const res = await fetch(`${import.meta.env.VITE_API_URL}/chats/${chatId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`Failed to update chat: ${res.statusText}`);
    const data = await res.json();
    return data;
  };

  const updateMutation = useMutation({
    mutationFn: (data) => updateChat(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] }),
    onError: (err) => {
      console.error("Error updating chat:", err.message);
    },
  });

  // Create and format a chat history with Gemini
  const formattedHistory =
    chatData?.history?.map(({ role, parts }) => ({
      role,
      parts: parts.map(({ text }) => ({ text })),
    })) || [];

  const chat = model.startChat({
    history: formattedHistory,
  });

  // Generate AI response
  const generateResponse = async (prompt) => {
    try {
      // Prepare request content to be sent to API from text-and-image input
      const content = [
        prompt,
        ...(Object.entries(img?.aiData)?.length ? [img.aiData] : []),
      ];

      const result = await chat.sendMessageStream(content);

      // Build answer progressively
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        accumulatedText += chunk.text();
        setAnswer(accumulatedText);
      }

      updateMutation.mutate({
        ...(question && { question: prompt }),
        answer: accumulatedText,
        ...(imgUrl && { img: imgUrl }),
      });
    } catch (err) {
      console.error("Error generating response:", err);
      setAnswer(
        err.message.includes("SAFETY")
          ? "The response was blocked due to safety concerns. Please rephrase your question or try a different image."
          : "An error occurred. Please, try again later."
      );
    }
  };

  const handleSubmit = async (form) => {
    const text = form.text.value.trim();
    if (!text) return;
    setQuestion(text);

    try {
      await generateResponse(text);
    } catch (err) {
      console.error("Error handling submission:", err.message);
      setAnswer(
        "An error occurred during submission. Please, try again later."
      );
    } finally {
      // Reset question and image data
      setQuestion("");
      setAnswer("");
      setImg({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {},
      });
    }
  };

  return (
    <div className="chatPage">
      <div className="chat">
        {isPending ? (
          <Loader width="40px" height="40px" border="4px solid transparent" />
        ) : error ? (
          <p>Something went wrong! Please, try again later.</p>
        ) : (
          <>
            {/* Display chat */}
            {chatData?.history?.map((message, index) => (
              <Fragment key={index}>
                {/* Image */}
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

                {/* Text */}
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

        {/* Add a new image */}
        {img?.isLoading && (
          <Loader width="40px" height="40px" border="4px solid transparent" />
        )}

        {!img?.isLoading && img?.dbData?.url && (
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
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ChatPage;
