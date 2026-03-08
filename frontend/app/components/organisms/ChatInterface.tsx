"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ChatMessage } from "../molecules/ChatMessage";
import { usePantry } from "../../context/PantryContext";
import { getChatResponse, generateRecipes } from "../../utils/mockApi";

export function ChatInterface() {
  const { ingredients, chatHistory, addChatMessage, setRecipes } = usePantry();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: message,
      timestamp: new Date(),
    };

    addChatMessage(userMessage);
    setMessage("");
    setIsLoading(true);

    try {
      const ingredientNames = ingredients.map((ing) => ing.name);

      const response = await getChatResponse(message, ingredientNames);

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: response,
        timestamp: new Date(),
      };

      addChatMessage(assistantMessage);

      if (
        message.toLowerCase().includes("recipe") ||
        message.toLowerCase().includes("what can i make") ||
        message.toLowerCase().includes("show")
      ) {
        const recipes = await generateRecipes(ingredientNames);
        setRecipes(recipes);
      }
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      addChatMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle>Smart Chef Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-green-100 rounded-full p-6 mb-4">
              <Send className="size-12 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
            <p className="text-gray-600 max-w-md">
              Ask me what you can cook with your ingredients, get recipe suggestions,
              or find out what you&apos;re missing!
            </p>
            <div className="mt-6 space-y-2 text-sm text-left bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-700">Try asking:</p>
              <ul className="space-y-1 text-gray-600">
                <li>• &quot;What can I make for dinner?&quot;</li>
                <li>• &quot;Show me quick and easy recipes&quot;</li>
                <li>• &quot;What healthy meals can I cook?&quot;</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 p-4 text-gray-500">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2 w-full"
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me what you can cook..."
            disabled={isLoading}
            className="flex-1"
            aria-label="Chat message input"
          />
          <Button type="submit" disabled={isLoading || !message.trim()}>
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

export default ChatInterface;
