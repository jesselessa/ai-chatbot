import "./promptForm.css";
import model from "../../lib/gemini.js";
import Upload from "../upload/Upload.jsx";

const PromptForm = ({ includeFileInput = true, onSubmit, setImg }) => {
  return (
    <form className="prompt-form" name="prompt-form" onSubmit={onSubmit}>
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
