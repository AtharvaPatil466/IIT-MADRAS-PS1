"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, AlertCircle, Gavel } from "lucide-react";
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
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div className="flex flex-col h-[calc(100vh-12rem)] -mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Message thread area */}
      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-8 space-y-6">
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(37,99,235,0.15)]">
              <Gavel className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-200 mb-2">Legal Assistant</h2>
            <p className="text-sm text-center max-w-xs text-gray-400">
              Ask anything about traffic laws, fines, or your legal rights on the road
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} message-enter`}
          >
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1.5 px-2">
              {msg.role === "user" ? "Citizen" : "DriveLegal AI"}
            </span>

            <div
              className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-lg ${
                msg.role === "user"
                  ? "btn-primary rounded-tr-none"
                  : msg.error
                    ? "bg-red-500/10 border border-red-500/30 text-red-200 rounded-tl-none"
                    : "glass-card rounded-tl-none border-white/10"
              }`}
            >
              {msg.error && (
                <AlertCircle className="w-4 h-4 inline-block mr-2 -mt-0.5 text-red-400" />
              )}
              {msg.text}

              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                  {msg.citations.map((cite, i) => (
                    <span key={i} className="inline-flex items-center px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-tighter">
                      § {cite}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-start message-enter">
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1.5 px-2">DriveLegal AI</span>
            <div className="glass-card px-5 py-3.5 rounded-2xl rounded-tl-none flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full typing-dot" />
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full typing-dot" />
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full typing-dot" />
              </div>
              <span className="text-sm text-gray-400 font-medium italic">Analyzing law...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 bg-transparent backdrop-blur-sm border-t border-white/5">
        <div className="max-w-3xl mx-auto relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your situation or ask about a law..."
            className="w-full input-field px-6 py-4 pr-16 bg-[#060e20]/60 backdrop-blur-xl border-white/10 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all placeholder-gray-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
