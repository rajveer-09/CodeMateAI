import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({});

export const generateContent = async (text) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${text}`,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Error generating content from Gemini API");
  }
};