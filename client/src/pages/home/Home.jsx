import "./home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <Link to="/dashboard">Dashboard</Link>
    </div>
  );
};

export default Home;
