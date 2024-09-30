import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const { conversation } = await req.json();

  // Format conversation into a single string that provides context
  const conversationHistory = conversation
    .map((msg) => `${msg.sender === "user" ? "User" : "Bot"}: ${msg.message}`)
    .join("\n");

  // Send the conversation history to the model
  const result = await model.generateContent(conversationHistory);

  return NextResponse.json(result.response.text());
}
