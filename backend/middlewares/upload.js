import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory as Buffer objects

// Initialize upload middleware
export const upload = multer({ storage }).single("file");
