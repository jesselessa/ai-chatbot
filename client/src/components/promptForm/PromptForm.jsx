import "./promptForm.css";
import model from "../../lib/gemini.js";

// Component
import Upload from "../upload/Upload.jsx";

const PromptForm = ({
  setQuestion,
  setAnswer,
  setImg,
  includeFileInput = true,
}) => {
  // Create a new prompt
  const createPrompt = async (prompt) => {
    setAnswer({ isLoading: true, content: "" });

    try {
      const result = await model.generateContent(prompt); // Call AI model
      const content = await result.response.text();
      // Update answer with result
      setAnswer({ isLoading: false, content });
    } catch (error) {
      console.error("Error generating content:", error);
      setAnswer({
        isLoading: false,
        content: "An error occurred. Please try again.",
      });
    }
  };

  // Handle form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle text field
    const text = e.target.text.value.trim();
    if (!text) {
      setAnswer({
        isLoading: false,
        content: "Fill up the text field.",
      });
      return;
    }

    setQuestion(text); // Update question in ChatPage
    createPrompt(text); // Generate a response
    e.target.reset(); // Reset form after submission
  };

  return (
    <form className="prompt-form" name="prompt-form" onSubmit={handleSubmit}>
      {includeFileInput && <Upload setImg={setImg} />}

      <textarea
        id="prompt-form-input"
        name="text"
        rows={3}
        placeholder="Ask me anything..."
      />

      <button className="send-btn">
        <img src="/arrow.png" alt="arrow" />
      </button>
    </form>
  );
};

export default PromptForm;
