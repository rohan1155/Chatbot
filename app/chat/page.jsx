"use client";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedInput = prompt.trim();
    if (!trimmedInput) return;

    // Add the user input to the conversation first
    setConversation((prev) => [
      ...prev,
      { sender: "user", message: trimmedInput },
    ]);
    setLoading(true);
    setPrompt("");
    try {
      const response = await axios.post("/api", {
        prompt: trimmedInput,
      });

      // Add the response from the API to the conversation
      setConversation((prev) => [
        ...prev,
        { sender: "bot", message: response.data },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearConversation = () => {
    setConversation([]); // Clear all conversations
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header section */}
      <div className="flex justify-between items-center px-11 py-3 bg-gray-800 border-b-2 border-gray-700 shadow-md">
        <div className="flex items-center">
          <Image
            src={"/chatbot.png"}
            width={32}
            height={32}
            alt="logo"
            className="invert"
          />
        </div>
        <h1 className="text-xl text-white font-semibold">Chat</h1>
        <button
          className="p-2 hover:bg-gray-700 rounded-full transition duration-300"
          onClick={handleClearConversation}
        >
          <Image
            src={"/bin.png"}
            width={24}
            height={24}
            alt="Delete"
            className="invert"
          />
        </button>
      </div>
      {/* Content section */}
      <div className="flex-grow flex flex-col text-white mt-2 overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 px-4">
        {/* Display conversation history */}
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`my-2 p-3 rounded-lg ${
              message.sender === "user"
                ? "bg-blue-500 text-white self-end max-w-[80%]"
                : "bg-gray-700 text-white self-start max-w-[80%]"
            }`}
          >
            {message.message}
          </div>
        ))}
      </div>
      {/* Input section */}
      <div className="sticky bottom-3 flex justify-center items-center px-4 my-4">
        <div className="flex items-center w-[90%] bg-[#2f2f2f] rounded-2xl px-4 py-2">
          {loading ? (
            <div className="flex-grow">Loading...</div>
          ) : (
            <textarea
              className="flex-grow bg-transparent text-white placeholder-gray-400 outline-none resize-none h-10 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
              rows={1}
              placeholder="Type a message..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onInput={(e) => {
                // Dynamically adjust the height of the textarea
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.shiftKey === false) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
          )}
          <button
            className="ml-3 p-2 hover:bg-gray-700 rounded-full transition duration-300"
            onClick={handleSubmit}
          >
            <Image
              src="/message.png"
              width={24}
              height={24}
              alt="Send"
              className="invert"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
