import "./home.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const Home = () => {
  const [typingStatus, setTypingStatus] = useState("john");

  return (
    <div className="home">
      <img src="/orbital.png" alt="orbital" className="orbital" />
      {/* Left */}
      <div className="left">
        <h1>ASK&nbsp;JOSIE</h1>
        <h2>
          Your friendly mini assistant for big ideas and quick&nbsp;answers
        </h2>
        <h3>
          Ask Jessbot is a compact and intuitive chatbot, using Google Gemini
          AI.
          <br />
          Smart, fast, and always ready, it makes your life simpler, one chat at
          a time&nbsp;!
        </h3>
        <Link to="/dashboard">Get Started</Link>
      </div>

      {/* Right */}
      <div className="right">
        <div className="img-container">
          {/* Animated bg */}
          <div className="bg-container">
            <div className="bg"></div>
          </div>

          {/* Animated image*/}
          <img src="/bot.png" alt="bot" className="bot" />

          {/* Chatbox */}
          <div className="chatbox">
            <img
              src={
                typingStatus === "john"
                  ? "/john.jpeg"
                  : typingStatus === "jane"
                  ? "/jane.jpg"
                  : "/bot.png"
              }
              alt={
                typingStatus === "john"
                  ? "user"
                  : typingStatus === "jane"
                  ? "user"
                  : "bot"
              }
            />

            {/* Animated text */}
            <TypeAnimation
              sequence={[
                "John : What is the capital of France\u00A0?",
                2000, // A callback function is added after each animation
                () => {
                  setTypingStatus("bot");
                },
                "Bot : Paris is the capital of France.",
                2000,
                () => {
                  setTypingStatus("jane");
                },
                "Jane : How much are 15\u00A0x\u00A015\u00A0?",
                2000,
                () => {
                  setTypingStatus("bot");
                },
                "Bot : 15 x 15 = 225",
                2000,
                () => {
                  setTypingStatus("john");
                },
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>

      <div className="terms">
        <img src="/logo.png" alt="logo" />
        <div className="links">
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
