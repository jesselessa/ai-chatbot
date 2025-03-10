import UserChats from "../models/userChats.js";

export const getUserChats = async (req, res, next) => {
  const { userId } = req.auth;

  try {
    const userChats = await UserChats.findOne({ userId });

    if (!userChats)
      return res.status(404).json({ message: "No chat found for this user" });

    // Sort chats by 'updatedAt' from newest to oldest
    const sortedChats = userChats.chats.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    ); //! If we don't add 'newDate()', comparison between 2 strings instead of 2 Date objects in JS

    res.status(200).json(sortedChats);
  } catch (err) {
    console.error("Error fetching user chats:", err);
    next(err);
  }
};
