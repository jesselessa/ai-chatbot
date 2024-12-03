import "./promptForm.css";

// Component
import Upload from "../upload/Upload.jsx";

const PromptForm = ({ setImg, includeFileInput = true }) => {
  // Handle form
  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="prompt-form-container">
      <form className="prompt-form" name="prompt-form" onSubmit={handleSubmit}>
        {includeFileInput && <Upload setImg={setImg} />}

        <textarea
          id="text"
          name="text"
          rows="3"
          placeholder="Ask me anything..."
        />

        <button className="send-btn">
          <img src="/arrow.png" alt="arrow" />
        </button>
      </form>
    </div>
  );
};

export default PromptForm;
