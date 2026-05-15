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

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await queryChat(trimmed, "en");
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: result.answer,
        citations: result.citations,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: "Something went wrong. Please try again.",
        error: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] -mt-8 -mx-4 sm:-mx-4">
      {/* Message thread area */}
      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageCircle className="w-10 h-10 mb-3" />
            <p className="text-sm text-center">
              Ask anything about traffic laws, fines, or your rights
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <span className="text-xs text-gray-500 mb-1 px-1">
              {msg.role === "user" ? "You" : "DriveLegal"}
            </span>

            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-lg text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : msg.error
                    ? "bg-white border border-red-300 text-red-700"
                    : "bg-white border border-gray-200 text-gray-800"
              }`}
            >
              {msg.error && (
                <AlertCircle className="w-4 h-4 inline-block mr-1.5 -mt-0.5 text-red-500" />
              )}
              {msg.text}

              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                  {msg.citations.map((cite, i) => (
                    <span key={i} className="block">
                      📄 {cite}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-500 mb-1 px-1">DriveLegal</span>
            <div className="max-w-[80%] px-4 py-2.5 rounded-lg text-sm bg-white border border-gray-200 text-gray-500 flex items-center gap-2">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]" />
              </span>
              <span>DriveLegal is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about traffic laws..."
            className="flex-1 bg-gray-100 text-gray-900 text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
