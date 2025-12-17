"use client";

import { useState, useCallback } from 'react';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (text) => {
    const userMessage = { id: Date.now(), from: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const botMessage = { 
        id: Date.now() + 1, 
        from: 'bot', 
        text: 'This is a demo response. Connect to your backend for real AI responses.' 
      };
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  }, []);

  return { messages, loading, sendMessage };
}
