import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate AI response
export const generateResponse = async (chatHistory, imageUrl) => {
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_AI_MODEL,
    safetySettings,
  });

  // Initialize chat with previous messages
  const chat = model.startChat({ history: chatHistory });

  // Request content to be sent to API
  let content = [];

  // Add user's last message
  if (
    chatHistory?.length > 0 &&
    chatHistory[chatHistory.length - 1].role === "user"
  ) {
    content.push(chatHistory[chatHistory.length - 1].parts[0].text);

    // If image exists, retrieve its URL from the frontend
    if (imageUrl) {
      try {
        const imageResp = await fetch(imageUrl).then((response) =>
          response.arrayBuffer()
        );
        const base64Data = Buffer.from(imageResp).toString("base64");

        // Add image data to content request
        content.push({
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg", // Default value
          },
        });
      } catch (error) {
        console.error("Error fetching or encoding image:", error);
      }
    }
  } else {
    // If no user message, return an error or default message
    return "No user message provided.";
  }

  try {
    const result = await chat.sendMessageStream(content);

    let accumulatedText = "";
    for await (const chunk of result.stream) {
      accumulatedText += chunk.text();
    }
    return accumulatedText;
  } catch (err) {
    console.error("Error generating AI response:", err);

    if (err.message.includes("SAFETY")) {
      return "The response was blocked due to safety concerns. Please, rephrase your question or try to upload a different image.";
    } else {
      return "An error occurred. Please try again later.";
    }
  }
};
