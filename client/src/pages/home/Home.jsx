import "./home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <img src="/orbital.png" alt="orbital" className="orbital" />
      {/* Left */}
      <div className="left">
        <h1>AI&nbsp;CHATBOT</h1>
        <h2>Supercharge your creativity and productivity</h2>
        <h3>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium
          porro praesentium commodi magni odio maiores velit, expedita atque
          saepe ducimus?
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
        </div>
      </div>
    </div>
  );
};

export default Home;
