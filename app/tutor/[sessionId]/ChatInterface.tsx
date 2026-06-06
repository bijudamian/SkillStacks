"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Loader2, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "model";
  content: string;
}

export default function ChatInterface({ sessionId, productTitle }: { sessionId: string; productTitle: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content: `Hi there! I'm your AI Tutor for **${productTitle}**. How can I help you execute on the playbook today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: userMessage,
          history: messages.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      setMessages((prev) => [...prev, { role: "model", content: data.reply }]);
    } catch (error: unknown) {
      const err = error as Error;
      setMessages((prev) => [
        ...prev,
        { role: "model", content: `**Error:** ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col max-w-4xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "model" && (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-primary" />
              </div>
            )}
            
            <div
              className={`max-w-[85%] rounded-2xl p-4 prose prose-invert prose-p:leading-relaxed prose-pre:bg-background ${
                msg.role === "user"
                  ? "bg-primary text-white rounded-br-none"
                  : "bg-surface border border-white/10 rounded-bl-none"
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div className="bg-surface border border-white/10 rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-text-secondary text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-background border-t border-white/5">
        <form
          onSubmit={handleSend}
          className="flex items-center bg-surface border border-white/10 rounded-xl overflow-hidden focus-within:border-primary/50 transition-colors"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the playbook..."
            className="flex-1 bg-transparent border-none text-white px-4 py-4 focus:ring-0 placeholder:text-text-secondary/50 outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-primary hover:bg-primary/90 text-white p-4 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
