import mongoose from "mongoose";

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
  { timestamps: true }
);

const userChatsSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  chats: [chatReferenceSchema],
});

export default mongoose.models.user_chats ||
  mongoose.model("user_chats", userChatsSchema);
