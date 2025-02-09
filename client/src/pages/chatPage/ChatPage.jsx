import { useRef, useState, useEffect, Fragment } from "react";
import "./chatPage.css";
import { useParams, useLocation } from "react-router-dom";
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
    error: "", // Error message when uploading image
    dbData: {}, // Image data uploaded with ImageKit (IK)
    aiData: {}, // Image data provided within Gemini API request
  });
  const [imgUrl, setImgUrl] = useState(""); // Image URL in a distinct state
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState({ error: false, message: "" });

  const chatEndRef = useRef(null);
  const { chatId } = useParams();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Fetch chat data from API
  const fetchChatData = async (chatId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/chats/${chatId}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        const errorMsg = await res.text();

        if (res.status === 404) {
          console.error("No chat found");
          return { history: [] }; // Return chat data as an empty array
        }

        throw new Error(`Failed to fetch chat: ${res.status} - ${errorMsg}`);
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error in fetchChatData:", err.message);
      throw err; // Relaunch error for React Query
    }
  };

  // Handle data with React Query
  const {
    isPending,
    error,
    data: chatData = { history: [] }, // Default value
  } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => fetchChatData(chatId),
  });

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

    if (!res.ok) {
      const errorMsg = await res.text();
      throw new Error(`Failed to update chat: ${res.statusText} - ${errorMsg}`);
    }

    const data = await res.json();
    return data;
  };

  // Mutation to update chat using React Query
  const updateMutation = useMutation({
    mutationFn: (data) => updateChat(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] }),
    onError: (err) => {
      console.error("Error updating chat:", err.message);
    },
  });

  // Fetch AI response
  const fetchAiResponse = async (prompt) => {
    try {
      // Request content to be sent from text-and-image input
      const content = [
        prompt,
        ...(Object.entries(img?.aiData)?.length ? [img.aiData] : []),
      ];
      const result = await chat.sendMessageStream(content);

      // Build answer gradually
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        accumulatedText += chunk.text();
        setAnswer(accumulatedText);
      }

      return accumulatedText;
    } catch (err) {
      console.error("Error generating response:", err);
      throw new Error(
        err.message.includes("SAFETY")
          ? "The response was blocked due to safety concerns. Please, rephrase your question or try to upload a different image."
          : "An error occurred. Please try again later."
      );
    }
  };

  // Generate AI response
  const generateAiResponse = async (prompt) => {
    try {
      const aiResponse = await fetchAiResponse(prompt);
      if (!aiResponse) throw new Error("No response received from AI");

      setAnswer(aiResponse);

      // Save chat to database
      updateMutation.mutate({
        ...(question && { question: prompt }),
        answer: aiResponse,
        ...(imgUrl && { img: imgUrl }),
      });
    } catch (err) {
      // Display error message temporarly
      setAiError({ error: true, message: err.message });
      setTimeout(() => setAiError({ error: false, message: "" }), 5000);
    }
  };

  // Generate AI response for initial message
  useEffect(() => {
    const firstMessage = chatData?.history[0];
    if (chatData?.history?.length === 1 && firstMessage?.role === "user")
      generateAiResponse(firstMessage.parts[0]?.text);
  }, [chatData?.history]);

  // Scroll to the latest message
  useEffect(() => {
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatData?.history?.length, img.dbData?.url, img.error, aiError.message]);

  // Update image URL when available
  useEffect(() => {
    if (img.dbData?.url) setImgUrl(img.dbData.url);
  }, [img.dbData?.url]);

  // Reset newly added image when changing page
  useEffect(() => {
    if (img?.dbData?.url)
      setImg({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {},
      });
  }, [location]);

  // Format chat history for Gemini
  const formattedHistory =
    chatData?.history?.map(({ role, parts }) => ({
      role,
      parts: parts.map(({ text }) => ({ text })),
    })) || [];

  // Initialize chat with previous messages
  const chat = model.startChat({
    history: formattedHistory,
  });

  // Handle form submission
  const handleSubmit = async (form) => {
    const text = form.text.value.trim();
    if (!text) return;

    setQuestion(text);
    setIsGenerating(true);

    try {
      await generateAiResponse(text);

      // Reset image state immediately on success
      setImg({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {},
      });
    } catch (err) {
      console.error("Error handling submission:", err.message);
      setAiError({
        error: true,
        message: "An error occurred during submission. Please try again later.",
      });

      // Reset AI error and image states after 5 seconds
      setTimeout(() => {
        setAiError({
          error: false,
          message: "",
        });
        setImg({
          isLoading: false,
          error: "",
          dbData: {},
          aiData: {},
        });
      }, 5000);
    } finally {
      setQuestion("");
      setAnswer("");
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

        {/* Handle loading image states */}
        {img?.isLoading && (
          <Loader
            className="img-loader"
            width="40px"
            height="40px"
            border="4px solid transparent"
          />
        )}

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

        {/* Display IK error message when loading image */}
        {!img?.isLoading && img.error?.trim() && (
          <div className="message">{img.error}</div>
        )}

        {/* Display AI error message when generating a response*/}
        {aiError && aiError.message?.trim() && (
          <div className="message">{aiError.message}</div>
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
