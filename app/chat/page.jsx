"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Markdown from "react-markdown";

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  // Create a ref for the conversation container
  const conversationEndRef = useRef(null);

  // Scroll to the bottom whenever the conversation updates
  const scrollToBottom = () => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = async () => {
    const trimmedInput = prompt.trim();
    if (!trimmedInput) return;

    // Add the user input to the conversation first
    const updatedConversation = [
      ...conversation,
      { sender: "user", message: trimmedInput },
    ];

    setConversation(updatedConversation);
    setLoading(true);
    setPrompt("");

    try {
      // Send the entire conversation to the API
      const response = await axios.post("/api", {
        conversation: updatedConversation, // Send the conversation history
      });

      // Add the bot's response to the conversation
      setConversation((prev) => [
        ...prev,
        { sender: "bot", message: response.data }, // Assume response.data contains the bot's message
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
      <div className="flex-grow flex flex-col text-white overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 px-4">
        {/* Display conversation history */}
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`my-2 p-3 rounded-lg ${
              message.sender === "user"
                ? "bg-blue-900 text-white self-end max-w-[80%]"
                : "bg-gray-700 text-white self-start max-w-[80%]"
            }`}
          >
            <div className="prose prose-white max-w-none">
              <Markdown>{message.message}</Markdown>
            </div>
          </div>
        ))}

        {/* This element is used to scroll to the bottom */}
        <div ref={conversationEndRef} />
      </div>

      {/* Input section */}
      <div className="sticky bottom-3 flex justify-center items-center px-4 my-2">
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
