import "./promptForm.css";
import model from "../../lib/gemini.js";

// Component
import Upload from "../upload/Upload.jsx";

const PromptForm = ({
  includeFileInput = true,
  setQuestion,
  img,
  setImg,
  generateResponse,
}) => {
  // Handle form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle text field
    const text = e.target.text.value.trim();

    if (!text) {
      setQuestion("Ask your question.");
      return;
    }

    setQuestion(text); // Update question in ChatPage
    await generateResponse(text); // Call generateResponse from ChatPage
    e.target.reset(); // Reset form after submission
  };

  return (
    <form className="prompt-form" name="prompt-form" onSubmit={handleSubmit}>
      {includeFileInput && <Upload setImg={setImg} />}

      <input
        type="text"
        id="text"
        name="text"
        placeholder="Ask me anything..."
        autoComplete="off"
      />

      <button type="submit" className="send-btn">
        <img src="/arrow.png" alt="arrow" />
      </button>
    </form>
  );
};

export default PromptForm;
