// Placeholder for ChatWindow component
// This will contain the main chat interface

export default function ChatWindow({ messages, onSendMessage, isTyping }) {
  return (
    <div className="flex flex-col h-full">
      {/* Messages will be rendered here */}
      <div className="flex-1 p-4">
        {/* Chat messages */}
      </div>
      {/* Input area */}
      <div className="p-4 border-t border-white/6">
        {/* Chat input */}
      </div>
    </div>
  );
}
