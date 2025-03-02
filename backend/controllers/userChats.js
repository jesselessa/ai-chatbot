import UserChats from "../models/userChats.js";

export const getUserChats = async (req, res, next) => {
  const { userId } = req.auth;

  try {
    const userChats = await UserChats.findOne({ userId });

    if (!userChats)
      return res.status(404).json({ message: "No chat found for this user" });

    res.status(200).json(userChats.chats);
  } catch (err) {
    console.error("Error fetching user chats:", err);
    next(err);
  }
};
