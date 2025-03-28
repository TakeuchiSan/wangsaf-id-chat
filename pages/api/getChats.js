import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "database", "chats.json");

  if (fs.existsSync(filePath)) {
    const chatData = JSON.parse(fs.readFileSync(filePath));
    res.status(200).json(chatData);
  } else {
    res.status(200).json([]);
  }
}
