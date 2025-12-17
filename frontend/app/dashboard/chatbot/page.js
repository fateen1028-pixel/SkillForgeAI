"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Hi! I'm your AI placement assistant. I can help you with DSA problems, interview prep, and study recommendations. How can I help you today?", time: "2:30 PM" },
    { id: 2, from: "user", text: "Can you show me how to solve the Two Sum problem?", time: "2:31 PM" },
    { id: 3, from: "bot", text: "Great question! Here's an optimal solution using a hash map:\n\n```python\ndef two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []\n```\n\n**Time Complexity:** O(n)\n**Space Complexity:** O(n)\n\nWould you like me to explain the approach step by step?", time: "2:31 PM", hasCode: true },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseMessage = (text) => {
    const parts = [];
    let lastIndex = 0;
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    
    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      }
      parts.push({ type: 'code', language: match[1] || 'code', content: match[2].trim() });
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }
    
    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
  };

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 text-xs font-mono">$1</code>');
  };

  const copyToClipboard = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), from: "user", text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponses = [
        "That's a great approach! Let me analyze your query and provide tailored recommendations...\n\n**Key Points:**\n• Focus on understanding the problem first\n• Break it down into smaller steps\n• Consider edge cases",
        "Based on your current progress, I suggest focusing on graph algorithms next.\n\n```python\n# BFS Template\nfrom collections import deque\n\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    while queue:\n        node = queue.popleft()\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n```\n\nWould you like practice problems for this?",
        "I've prepared a detailed explanation for you. The key concepts you need to understand are **time complexity** and **space optimization**.\n\nRemember: `O(n log n)` is typically better than `O(n²)` for large inputs!",
      ];
      const botMsg = {
        id: Date.now() + 1,
        from: "bot",
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="container-app py-4 md:py-6 lg:py-8">
      <div className="rounded-xl md:rounded-2xl border border-white/6 bg-linear-to-br from-white/3 to-transparent backdrop-blur-sm overflow-hidden">
        <div className="flex flex-col h-[calc(100vh-10rem)] md:h-150 lg:h-175 xl:h-200">
          {/* Chat Header */}
          <div className="px-4 md:px-6 lg:px-8 py-3 md:py-4 lg:py-5 border-b border-white/6 bg-linear-to-r from-violet-500/5 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-lg bg-white/3 border border-white/6 text-slate-400 hover:text-white hover:bg-white/6 hover:border-white/12 transition-all group"
                  title="Back to Dashboard"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div className="relative">
                  <div className="absolute -inset-1 md:-inset-1.5 bg-linear-to-r from-violet-500 to-cyan-500 rounded-lg md:rounded-xl blur opacity-40" />
                  <div className="relative w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-lg md:rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-base md:text-lg lg:text-xl">Forge AI</h3>
                  <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs lg:text-sm text-emerald-400">
                    <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-emerald-500" />
                    </span>
                    <span className="font-medium">Online</span>
                  </div>
                </div>
              </div>
              <button className="p-2 md:p-2.5 rounded-lg md:rounded-xl bg-white/3 border border-white/6 hover:bg-white/6 transition-all text-slate-400 hover:text-white">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 md:p-5 lg:p-6 xl:p-8 space-y-4 md:space-y-6">
            {messages.map((msg, index) => (
              <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-end gap-2 md:gap-3 max-w-[95%] sm:max-w-[85%] lg:max-w-[80%] ${msg.from === "user" ? "flex-row-reverse" : ""}`}>
                  {msg.from === "bot" && (
                    <div className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-md md:rounded-lg lg:rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    </div>
                  )}
                  {msg.from === "user" && (
                    <div className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-md md:rounded-lg lg:rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 text-[10px] md:text-xs lg:text-sm font-bold">
                      DU
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <div className={`rounded-xl md:rounded-2xl ${msg.from === "user" ? "bg-linear-to-br from-violet-500 to-purple-600 text-white rounded-br-sm px-3 py-2 md:px-4 md:py-3 lg:px-5 lg:py-4" : "bg-white/3 border border-white/6 text-slate-100 rounded-bl-sm overflow-hidden"}`}>
                      {msg.from === "user" ? (
                        <p className="text-xs md:text-sm lg:text-base leading-relaxed">{msg.text}</p>
                      ) : (
                        <div className="space-y-2 md:space-y-3">
                          {parseMessage(msg.text).map((part, i) => (
                            part.type === 'code' ? (
                              <div key={i} className="relative group">
                                <div className="flex items-center justify-between px-3 md:px-4 py-1.5 md:py-2 bg-black/30 border-b border-white/5">
                                  <span className="text-[10px] md:text-xs font-mono text-slate-400">{part.language}</span>
                                  <button onClick={() => copyToClipboard(part.content, `${msg.id}-${i}`)} className="flex items-center gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                    {copiedCode === `${msg.id}-${i}` ? (
                                      <><svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-emerald-400 hidden sm:inline">Copied!</span></>
                                    ) : (
                                      <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg><span className="hidden sm:inline">Copy</span></>
                                    )}
                                  </button>
                                </div>
                                <pre className="p-3 md:p-4 overflow-x-auto bg-black/20">
                                  <code className="text-[10px] md:text-xs lg:text-sm font-mono text-slate-300 leading-relaxed">{part.content}</code>
                                </pre>
                              </div>
                            ) : (
                              <div key={i} className="px-3 py-2 md:px-4 md:py-3 lg:px-5 lg:py-4 text-xs md:text-sm lg:text-base leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: formatText(part.content) }} />
                            )
                          ))}
                        </div>
                      )}
                    </div>
                    <p className={`text-[9px] md:text-[10px] lg:text-xs text-slate-500 font-medium ${msg.from === "user" ? "text-right" : ""}`}>{msg.time}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end gap-2 md:gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-md md:rounded-lg bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                  </div>
                  <div className="bg-white/3 border border-white/6 rounded-xl md:rounded-2xl rounded-bl-sm px-3 py-2 md:px-4 md:py-3">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 md:p-4 lg:p-6 border-t border-white/6 bg-linear-to-r from-transparent via-violet-500/3 to-transparent">
            {/* Quick suggestions - Scrollable on mobile */}
            <div className="flex gap-2 mb-3 md:mb-4 overflow-x-auto pb-1 scrollbar-hide">
              {["DSA tips", "Interview prep", "Today's plan", "Mock test"].map((suggestion) => (
                <button key={suggestion} onClick={() => setInput(suggestion)} className="shrink-0 px-2.5 md:px-3 lg:px-4 py-1 md:py-1.5 lg:py-2 rounded-md md:rounded-lg lg:rounded-xl bg-white/3 border border-white/6 text-[10px] md:text-xs lg:text-sm font-medium text-slate-400 hover:text-white hover:bg-white/6 hover:border-violet-500/30 transition-all whitespace-nowrap">
                  {suggestion}
                </button>
              ))}
            </div>
            
            <form onSubmit={handleSend} className="flex gap-2 md:gap-3">
              <input id="chat-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything..." className="flex-1 rounded-lg md:rounded-xl lg:rounded-2xl border border-white/8 bg-white/3 px-3 md:px-4 lg:px-5 py-2.5 md:py-3 lg:py-3.5 text-sm outline-none transition-all placeholder:text-slate-500 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 focus:bg-white/5" />
              <button type="submit" className="group relative px-4 md:px-5 py-2.5 md:py-3 rounded-lg md:rounded-xl font-medium overflow-hidden transition-all active:scale-95">
                <div className="absolute inset-0 bg-linear-to-r from-violet-500 to-purple-600" />
                <div className="absolute inset-0 bg-linear-to-r from-violet-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg className="relative w-4 h-4 md:w-5 md:h-5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
            <p className="mt-2 md:mt-3 text-[9px] md:text-[10px] text-slate-500 text-center font-medium">Powered by SkillForgeAI</p>
          </div>
        </div>
      </div>
    </div>
  );
}
