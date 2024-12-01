import "./promptForm.css";

const PromptForm = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="form-container">
      <form name="prompt-form" onSubmit={handleSubmit}>
        <input type="file" name="file" id="file" multiple={false} hidden />
        <label htmlFor="file">
          <img
            className="attachment-btn"
            src="/attachment.png"
            alt="attachment"
          />
        </label>

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
