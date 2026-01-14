import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getAIResponse = async (req, res) => {
  const { prompt, history } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    let chatHistory = history || [];
    
    // Gemini requires history to start with a 'user' role
    if (chatHistory.length > 0 && chatHistory[0].role === "model") {
      chatHistory = chatHistory.slice(1);
    }
    
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 4000,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (error) {
    console.error("AI API Error:", error);
    res.status(500).json({ error: "Failed to generate response", details: error.message });
  }
};
