"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, AlertCircle } from "lucide-react";
import { queryChat } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  citations?: string[];
  error?: boolean;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await queryChat(userMessage.text, "en");
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: response.answer,
        citations: response.citations,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: "Something went wrong. Please try again.",
        error: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto pb-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">
              Ask anything about traffic laws, fines, or your rights
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <span className="text-xs text-gray-500 mb-1">
                  {message.role === "user" ? "You" : "DriveLegal"}
                </span>
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : message.error
                      ? "bg-white border-2 border-red-500 text-gray-800"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  {message.error && (
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Citations:</p>
                      <ul className="text-xs text-gray-600 list-disc list-inside">
                        {message.citations.map((citation, idx) => (
                          <li key={idx}>{citation}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-500 mb-1">DriveLegal</span>
                <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200" />
                    </div>
                    <span className="text-gray-600 text-sm">
                      DriveLegal is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about traffic laws..."
            className="flex-1 bg-gray-100 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 text-white rounded-lg px-4 py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
