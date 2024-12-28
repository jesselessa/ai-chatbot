import Chat from "../models/chat.js";
import UserChats from "../models/userChats.js";

// Get a specific chat
export const getChat = async (req, res, next) => {
  const { userId } = req.auth; // Get ID from Clerk auth info
  const { id } = req.params;
  // const { id: chatId } = req.params;

  try {
    const chat = await Chat.findOne({ _id: id, userId });
    // const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.status(200).json(chat);
  } catch (err) {
    console.error("Error fetching chat:", err);
    next(err); // Propagate the error to the global middleware
  }
};

// Add a new chat
export const addNewChat = async (req, res, next) => {
  const { userId } = req.auth;
  const { text } = req.body;
  // const { text, img } = req.body;

  try {
    // Create a new chat
    const newChat = new Chat({
      userId,
      history: [{ role: "user", parts: [{ text }] }],
      // history: [{ role: "user", parts: [{ text }], ...(img && { img }) }],
    });
    const savedChat = await newChat.save();

    // Check if list of user chats exists
    const userChats = await UserChats.findOne({ userId });
    // If not, create a new one and store new chat in it
    if (!userChats || userChats.chats.length === 0) {
      await new UserChats({
        userId,
        chats: [{ _id: savedChat._id, title: text.substring(0, 40) }], // Substring takes the 1st 40 characters
      }).save();
    } else {
      // Add chat to existing list
      await UserChats.updateOne(
        { userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );
    }

    res
      .status(201)
      .json({ message: "Chat saved successfully", chatId: savedChat._id });
  } catch (err) {
    console.error("Error creating chat:", err);
    next(err);
  }
};

// Update a chat
export const updateChat = async (req, res, next) => {
  const { userId } = req.auth;
  const { id } = req.params;
  // const { id: chatId } = req.params;
  const { question, answer, img } = req.body;

  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: id, userId },
      // { _id: chatId, userId },
      { $push: { history: { $each: newItems } } }
    );
    res.status(200).json(updatedChat);
  } catch (err) {
    console.error("Error updating chat:", err);
    next(err);
  }
};

// Delete a chat
export const deleteChat = async (req, res, next) => {
  const { userId } = req.auth;
  const { id } = req.params;
  // const { id: chatId } = req.params;

  try {
    const chat = await Chat.findOneAndDelete({ _id: id, userId });
    // const chat = await Chat.findOneAndDelete({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    await UserChats.updateOne(
      { userId },
      { $pull: { chats: { _id: id } } }
      // { $pull: { chats: { _id: chatId } } }
    );

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (err) {
    console.error("Error deleting chat:", err);
    next(err);
  }
};
