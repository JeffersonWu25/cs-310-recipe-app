import { Bot, User } from "lucide-react";
import { ChatMessage as ChatMessageType } from "../../context/PantryContext";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <article
      className={`flex gap-3 p-4 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div
        className={`flex-shrink-0 size-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-blue-500" : "bg-green-500"
        }`}
      >
        {isUser ? (
          <User className="size-5 text-white" />
        ) : (
          <Bot className="size-5 text-white" />
        )}
      </div>
      <div
        className={`flex-1 ${
          isUser ? "flex justify-end" : "flex justify-start"
        }`}
      >
        <div
          className={`max-w-[80%] p-3 rounded-lg ${
            isUser
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
          <time className={`text-xs mt-1 block ${
            isUser ? "text-blue-100" : "text-gray-500"
          }`}>
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>
      </div>
    </article>
  );
}
