// Placeholder for MessageBubble component
export default function MessageBubble({ message, isBot }) {
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        isBot 
          ? 'bg-white/5 border border-white/10' 
          : 'bg-linear-to-r from-violet-500 to-purple-600'
      }`}>
        {message.text}
      </div>
    </div>
  );
}
