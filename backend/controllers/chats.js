import Chat from "../models/chat.js";
import UserChats from "../models/userChats.js";

export const getChat = async (req, res, next) => {
  const { userId } = req.auth; // Get ID from Clerk auth info
  const { chatId } = req.params;

  try {
    // Fetch chat based on its ID and user ID
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) return res.status(404).json({ message: "No chat found" });

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error fetching chat:", err);
    next(err); // Propagate error to global middleware
  }
};

export const addNewChat = async (req, res, next) => {
  const { userId } = req.auth;
  const { text } = req.body;

  try {
    // Create a new chat instance with initial user message
    const newChat = new Chat({
      userId,
      history: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
    });

    const savedChat = await newChat.save(); // Send chat to database
    const chatTitle = text?.length > 40 ? `${text.substring(0, 40)}...` : text; // Generate chat title

    // Check if user already has a chat collection
    const userChats = await UserChats.findOne({ userId });

    if (!userChats) {
      // If not, create a new one and add chat
      await new UserChats({
        userId,
        chats: [
          {
            _id: savedChat._id,
            title: chatTitle,
          },
        ],
      }).save();
    } else {
      // If user already has a chat collection, update it
      await UserChats.updateOne(
        { userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: chatTitle,
            },
          },
        }
      );
    }

    res.status(201).json({
      message: "Chat saved successfully",
      chatId: savedChat._id,
    });
  } catch (err) {
    console.error("Error creating chat:", err);
    next(err);
  }
};

export const updateChat = async (req, res, next) => {
  const { userId } = req.auth;
  const { chatId } = req.params;
  const { question, answer, img } = req.body;

  try {
    // Construct new chat messages
    const newItems = [
      {
        role: "user",
        parts: [{ text: question }],
        ...(img && { img }), // Add image only if it exists
      },
      {
        role: "model",
        parts: [{ text: answer }],
      },
    ];

    // Update chat document by appending new messages
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

    if (updatedChat.matchedCount === 0)
      return res
        .status(404)
        .json({ message: "Chat not found or unauthorized" });

    // Define chat title based on input type
    const chatTitle = img
      ? "Image Analyze"
      : question?.length > 40
      ? `${question.substring(0, 40)}...`
      : question;

    // Update chat title in user chat collection
    await UserChats.updateOne(
      { userId, "chats._id": chatId },
      {
        $set: {
          "chats.$.title": chatTitle,
        },
      }
    );

    res.status(200).json({ message: "Chat updated successfully" });
  } catch (err) {
    console.error("Error updating chat:", err);
    next(err);
  }
};

export const deleteChat = async (req, res, next) => {
  const { userId } = req.auth;
  const { chatId } = req.params;

  try {
    // Find and delete chat
    const chat = await Chat.findOneAndDelete({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Remove chat reference from user's chat collection
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
