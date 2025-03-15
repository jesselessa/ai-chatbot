import { useState } from "react";
import "./menu.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Components
import Loader from "../loader/Loader.jsx";
import ConfirmDialog from "../confirmDialog/ConfirmDialog.jsx";

// Images
import bin from "../../../src/assets/delete.png";
import gemini from "../../../src/assets/gemini.png";

const Menu = ({ onClose }) => {
  const [dialogBox, setDialogBox] = useState({
    isOpen: false,
    chatId: null,
  });

  const { chatId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user chats
  const fetchUserChats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user-chats`, {
        credentials: "include",
      });
      if (!res.ok) {
        const errorMsg = await res.text();

        if (res.status === 404) {
          console.error(`${res.status} - No chat found for this user`);
          return [];
        }
        throw new Error(
          `Failed to fetch user chats: ${res.status} - ${errorMsg}`
        );
      }

      const data = await res.json();
      return data; // Returns an array of objects
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
    queryFn: fetchUserChats,
  });

  const handleDeleteChat = async (chatId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/chats/${chatId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        const errorMsg = await res.text;
        throw new Error(`Failed to delete chat: ${res.status} - ${errorMsg}`);
      }
      const data = await res.json();

      // Invalidate query to update databases
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
    } catch (err) {
      console.error("Error in handleDeleteChat :", err.message);
      throw err;
    }
  };

  const openDeletionDialogBox = (e, chatId) => {
    e.preventDefault();
    setDialogBox({ isOpen: true, chatId });
  };

  const confirmDeletion = () => {
    handleDeleteChat(dialogBox.chatId);
    setDialogBox({ isOpen: false, chatId: null });
    navigate(`/dashboard`);
  };

  const cancelDeletion = () => {
    setDialogBox({ isOpen: false, chatId: null });
  };

  return (
    <div className="menu">
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard" onClick={onClose}>
        Create a new chat
      </Link>

      <Link
        to="https://github.com/jesselessa"
        target="_blank"
        rel="noopener noreferrer"
      >
        Contact
      </Link>

      <hr />

      <span className="title">RECENT CHATS</span>

      <div className="list">
        {isLoading ? (
          <Loader width="30px" height="30px" border="3px solid transparent" />
        ) : error ? (
          <p>Something went wrong&nbsp;! Please, try again later.</p>
        ) : Array.isArray(userChats) && userChats.length > 0 ? (
          userChats.map((chat) => (
            <Link
              to={`/dashboard/chats/${chat._id}`}
              key={chat._id}
              onClick={onClose}
            >
              {/* Delete icon */}
              <img
                className="delete"
                src={bin}
                alt="delete"
                onClick={(e) => openDeletionDialogBox(e, chat._id)}
              />

              {/* Chat title */}
              <p className="chat-title">
                {chat.title?.length > 25
                  ? `${chat.title.substring(0, 25)}...`
                  : chat.title}
              </p>
            </Link>
          ))
        ) : (
          <p>No chat available.</p>
        )}
      </div>

      {/* Confirm chat deletion */}
      <ConfirmDialog
        isOpen={dialogBox.isOpen}
        message="Delete Chat ?"
        onConfirm={confirmDeletion}
        onCancel={cancelDeletion}
      />

      <hr />

      <div className="upgrade">
        <div className="text">
          Ask Jessbot answers are generated by Gemini
          <span>
            <img src={gemini} alt="gemini" />
          </span>
        </div>

        <a
          href="https://gemini.google.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about Google&nbsp;AI
        </a>
      </div>
    </div>
  );
};

export default Menu;
