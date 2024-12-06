import UserChats from "../models/userChats.js";

// Get all user chats
export const getUserChats = async (req, res) => {
  const { userId } = req.auth;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: No user ID found" });
  }

  try {
    const userChats = await UserChats.findOne({ userId });
    if (!userChats || !userChats.chats.length) {
      return res.status(404).json({ message: "No chats found for this user" });
    }
    res.status(200).json(userChats.chats);
  } catch (err) {
    console.error("Error fetching user chats:", err);
    res.status(500).json({ error: "Error fetching user chats" });
  }
};
