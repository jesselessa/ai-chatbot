import "./promptForm.css";
import model from "../../lib/gemini.js";

// Component
import Upload from "../upload/Upload.jsx";

const PromptForm = ({
  includeFileInput = true,
  // setQuestion,
  // setAnswer,
  setImg,
  // generateResponse,
}) => {
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle text field
    const text = e.target.text.value.trim();
    if (!text) {
      // setQuestion("Ask your question.");
      return;
    }

    // setQuestion(text); // Update parent state
    // await generateResponse(text);
    // e.target.reset(); // Reset form after submission

    await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text }),
    });
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
