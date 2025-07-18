import { Prompt } from "../models/prompt.model.js";
import { generateContent } from "../services/assistant.service.js";

export const createPrompt = async (req, res) => {
  const { content } = req.body;
  const userId = req.userId;  

  try {
    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content is required" });
    }

    // Save user's prompt
    const userPrompt = await Prompt.create({ role: "user", content, userId });

    // Get AI response from Gemini
    const aiResponseText = await generateContent(content);

    if (!aiResponseText || aiResponseText.trim() === "") {
      return res.status(500).json({ message: "AI did not return a valid response" });
    }

    // Save assistant's prompt
    const assistantPrompt = await Prompt.create({
      role: "assistant",
      content: aiResponseText,
      userId,
    });

    res.status(201).json({
      message: "Prompt exchange successful",
      userPrompt,
      assistantPrompt,
    });

  } catch (error) {
    res.status(500).json({ message: "Error processing prompt", error: error.message });
  }
};
