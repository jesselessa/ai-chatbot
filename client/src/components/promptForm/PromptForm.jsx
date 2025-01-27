import { useRef } from "react";
import "./promptForm.css";
import model from "../../lib/gemini.js";
import Upload from "../upload/Upload.jsx";

const PromptForm = ({
  includeFileInput = true,
  question,
  setQuestion,
  setImg,
  onSubmit,
}) => {
  const formRef = useRef(null); // Create a reference for form

  // Submit form with "Enter" key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents create a new line
      onSubmit(formRef.current); // Pass form reference with actual value
    }
  };

  return (
    <form
      className="prompt-form"
      name="prompt-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formRef.current);
      }}
      ref={formRef} // Link reference
    >
      {includeFileInput && <Upload setImg={setImg} />}

      <textarea
        type="text"
        id="text"
        name="text"
        placeholder="Ask me anything..."
        autoComplete="off"
        autoFocus // Text cursor blinking on loading page
        value={question} // State linked with input
        onChange={(e) => setQuestion(e.target.value)} // Real-time update
        onKeyDown={handleKeyDown}
      ></textarea>

      <button type="submit" className={`send-btn ${!question ? "hidden" : ""}`}>
        <img src="/arrow.png" alt="arrow" />
      </button>
    </form>
  );
};

export default PromptForm;
