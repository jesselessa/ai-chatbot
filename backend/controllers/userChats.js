import UserChats from "../models/userChats.js";

//? lean() is a Mongoose-specific method that improves read performance by returning plain JavaScript objects instead of full Mongoose documents
//? Useful when we only need to read data from the database to display or send to a client, without intending to modify the data or use Mongoose document methods

//* Get all chats for the authenticated user
export const getUserChats = async (req, res, next) => {
  const { userId } = req.auth;

  try {
    // Fetch user chats and sort them in memory
    const userChats = await UserChats.findOne({ userId }).lean();
    if (!userChats) return res.status(200).json([]);

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
