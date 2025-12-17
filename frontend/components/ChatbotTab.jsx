"use client";
import { useEffect, useState } from "react";
import { fetchMessages, sendMessage } from "../src/app/services/api";

export default function ChatbotTab() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages().then(setMessages);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { id: Date.now(), from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    const botMsg = await sendMessage(input);
    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="h-72 overflow-y-auto border p-2 rounded">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.from === "user" ? "text-right" : ""}>
            <span className="block">{msg.text}</span>
          </div>
        ))}
        {loading && <div className="text-sm text-slate-400">Assistant is typing...</div>}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 border rounded px-2 py-1 text-sm"
        />
        <button className="bg-sky-500 px-4 py-1 rounded text-white">Send</button>
      </form>
    </div>
  );
}
