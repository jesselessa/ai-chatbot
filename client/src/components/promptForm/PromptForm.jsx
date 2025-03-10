import { useRef } from "react";
import "./promptForm.css";

// Component
import Upload from "../upload/Upload.jsx";

// Images
import square from "../../../src/assets/square.png";
import arrow from "../../../src/assets/arrow.png";

const PromptForm = ({
  includeFileInput = true,
  question,
  setQuestion,
  setImg,
  onSubmit,
  isGenerating,
}) => {
  const formRef = useRef(null);

  // Submit form with "Enter" key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent creating a new line
      onSubmit(formRef.current); // Pass form reference with actual value
    }
  };

  return (
    <form
      className="prompt-form"
      name="prompt-form"
      style={{ backgroundColor: isGenerating ? "#1a1824" : "" }}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formRef.current);
      }}
      ref={formRef}
    >
      {includeFileInput && !isGenerating && <Upload setImg={setImg} />}

      <textarea
        type="text"
        id="text"
        name="text"
        placeholder="Ask me anything..."
        autoComplete="off"
        autoFocus
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isGenerating}
      ></textarea>

      <button
        type="submit"
        className={`send-btn ${!question ? "hidden" : ""}`}
        disabled={isGenerating}
        style={{ transform: isGenerating && "translateY(0)" }}
      >
        <img
          src={isGenerating ? `${square}` : `${arrow}`}
          alt={isGenerating ? "generating" : "send"}
        />
      </button>
    </form>
  );
};

export default PromptForm;
