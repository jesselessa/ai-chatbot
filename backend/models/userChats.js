import mongoose from "mongoose";

// Schema for individual chat references within the user's chat collection
const chatReferenceSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // createdAt and updatedAt
);

// Schema for the user's chat collection
const userChatsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  chats: [chatReferenceSchema],
});

export default mongoose.models.user_chats ||
  mongoose.model("user_chats", userChatsSchema);
