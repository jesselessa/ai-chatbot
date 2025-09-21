export const generateChatTitle = (text, img) => {
  if (img) return "Image Analyze";
  if (text?.length > 40) return `${text.substring(0, 40)}...`;
  return text;
};
