import "./menu.css";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Component
import Loader from "../loader/Loader.jsx";

const Menu = () => {
  // Fetch user chats
  const fetchUserChats = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user-chats`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch user chats: ${res.statusText}`);
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error in fetchUserChats:", err.message);
      throw err; // Rethrow error for further handling
    }
  };

  const {
    isLoading,
    error,
    data: userChats,
  } = useQuery({
    queryKey: ["userChats"],
    queryFn: fetchUserChats, // Utilisation directe
  });

  return (
    <div className="menu">
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard">Create a new chat</Link>
      <Link to="/">Explore Ask Jessbot</Link>
      <Link to="/">Contact</Link>

      <hr />

      <span className="title">RECENT CHATS</span>

      <div className="list">
        {isLoading ? (
          <Loader width="30px" height="30px" border="3px solid transparent" />
        ) : error ? (
          <p>Something went wrong&nbsp;! Please, try again later.</p>
        ) : Array.isArray(userChats) ? (
          userChats.map((chat) => (
            <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
              {/* Title limited to the 1st 20 characters*/}
              <p className="chat-title">
                {chat.title.length > 20
                  ? `${chat.title.substring(0, 20)}...`
                  : chat.title}
              </p>
            </Link>
          ))
        ) : (
          <p>No chat available.</p>
        )}
      </div>

      <hr />

      <div className="upgrade">
        <img src="/logo.png" alt="logo" />
        <div className="texts">
          <span>Ask Jessbot answers are generated by Gemini</span>
          <span>
            <a
              href="https://gemini.google.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about Google AI
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Menu;
