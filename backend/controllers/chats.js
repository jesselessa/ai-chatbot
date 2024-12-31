import Chat from "../models/chat.js";
import UserChats from "../models/userChats.js";

// Get a specific chat
export const getChat = async (req, res, next) => {
  const { userId } = req.auth; // Get ID from Clerk auth info
  const { chatId } = req.params;

  try {
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) return res.status(404).json({ message: "No chat found" });

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error fetching chat:", err);
    next(err); // Propagate error to global middleware
  }
};

// Create a new chat
export const addNewChat = async (req, res, next) => {
  const { userId } = req.auth;
  const { text } = req.body;

  try {
    const newChat = new Chat({
      userId,
      history: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
    });
    const savedChat = await newChat.save();

    // Check if an array with user chats exists
    const userChats = await UserChats.findOne({ userId });

    // If not, create a new one and add chat
    if (!userChats) {
      await new UserChats({
        userId,
        chats: [
          {
            _id: savedChat._id,
            title: text?.length > 40 ? `${text.substring(0, 40)}...` : text,
          }, // Title limited to the 1st 40 characters
        ],
      }).save();
    } else {
      // Add chat to existing array
      await UserChats.updateOne(
        { userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text?.length > 40 ? `${text.substring(0, 40)}...` : text,
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
  const { chatId } = req.params;
  const { question, answer, img } = req.body;

  // Question(s) and answer(s) are sent together after getting the answer completed version
  const newItems = [
    ...(question
      ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: chatId, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );

    // Update chat title in UserChats based on the fact image is present or not in request 
    const chatTitle = img
      ? "Image Analyze"
      : question?.length > 40
      ? `${question.substring(0, 40)}...`
      : question;

    await UserChats.updateOne(
      { userId, "chats._id": chatId },
      {
        $set: {
          "chats.$.title": chatTitle,
        },
      }
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
  const { chatId } = req.params;

  try {
    const chat = await Chat.findOneAndDelete({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    await UserChats.updateOne(
      { userId },
      { $pull: { chats: { _id: chatId } } }
    );

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (err) {
    console.error("Error deleting chat:", err);
    next(err);
  }
};
