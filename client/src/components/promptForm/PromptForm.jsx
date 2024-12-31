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
  return (
    <form className="prompt-form" name="prompt-form" onSubmit={onSubmit}>
      {includeFileInput && <Upload setImg={setImg} />}
      <input
        type="text"
        id="text"
        name="text"
        placeholder="Ask me anything..."
        autoComplete="off"
        autoFocus // Text cursor blinking on loading page
        value={question} // State linked with input
        onChange={(e) => setQuestion(e.target.value)} // Update in real time
      />
      <button type="submit" className={`send-btn ${!question ? "hidden" : ""}`}>
        <img src="/arrow.png" alt="arrow" />
      </button>
    </form>
  );
};

export default PromptForm;
