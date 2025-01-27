import UserChats from "../models/userChats.js";

// Get all user chats
export const getUserChats = async (req, res, next) => {
  const { userId } = req.auth;

  try {
    const userChats = await UserChats.findOne({ userId });
    if (!userChats)
      return res.status(404).json({ message: "No chat found for this user" });

    res.status(200).json(userChats.chats); // Array containing 1 or many objects with keys '_id', 'title' and 'createdAt'
  } catch (err) {
    console.error("Error fetching user chats:", err);
    next(err);
  }
};
