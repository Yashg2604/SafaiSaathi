"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  X,
  Bot,
  User,
  Minimize2,
  Maximize2
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface CampusBotProps {
  language: string; // Passed from Page.tsx
}

const suggestedQuestions = [
  "How do I segregate wet and dry waste?",
  "What are the benefits of waste segregation?",
  "Can segregated waste be sold? How?",
  "What are some eco-friendly disposal methods?"
];

const CampusBot: React.FC<CampusBotProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(true); // Always open on page
  const [isFullSize, setIsFullSize] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `🌱 Hello! I'm EcoChatBot — your guide for waste segregation techniques, benefits, and resale values. Ask me anything in your selected language (${language}).`,
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToGemini = async (userMessage: string) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `You are EcoChatBot, an expert on waste segregation techniques, their benefits, and the resale value of segregated waste.
                    Always respond in ${language}. 
                    
                    User: ${userMessage}`
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();
      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "❌ Sorry, I couldn’t understand that."
      );
    } catch (error) {
      console.error("Error contacting Gemini:", error);
      return "⚠️ Something went wrong. Please try again!";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    const botReply = await sendMessageToGemini(userMessage.text);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botReply,
      sender: "bot",
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleSuggestedClick = (question: string) => {
    setInputText(question);
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSendMessage(fakeEvent);
    }, 100);
  };

  return (
    <>
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isFullSize
              ? "inset-0 p-4 bg-black/40 flex items-center justify-center"
              : "bottom-24 left-15 w-98 h-[500px]"
          }`}
        >
          <div
            className={`w-full h-full ${
              isFullSize
                ? "max-w-5xl max-h-[90vh]"
                : "w-[27vw] h-[500px]"
            } bg-white rounded-2xl shadow-2xl border border-green-200 flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-teal-500 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">EcoChatBot</h3>
                  <p className="text-xs">Helping with waste segregation ♻️</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsFullSize(!isFullSize)}
                  className="p-2 hover:bg-white/20 rounded-full"
                >
                  {isFullSize ? (
                    <Minimize2 className="h-5 w-5" />
                  ) : (
                    <Maximize2 className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat window */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-green-50/30 to-teal-50/30">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 ${
                    msg.sender === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-green-500 to-teal-500"
                        : "bg-gradient-to-r from-yellow-400 to-green-500"
                    } text-white`}
                  >
                    {msg.sender === "user" ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </div>
                  <div
                    className={`flex-1 px-4 py-3 rounded-2xl shadow-sm ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-green-500 to-teal-500 text-white ml-12"
                        : "bg-white text-gray-800 mr-12 border border-green-100"
                    }`}
                  >
                    <div className="text-sm leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                    {isMounted && (
                      <p
                        className={`text-xs mt-2 ${
                          msg.sender === "user"
                            ? "text-green-100"
                            : "text-gray-500"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-green-500 text-white flex items-center justify-center">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="flex-1 px-4 py-3 rounded-2xl bg-white mr-12 border border-green-100">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions */}
            {messages.length <= 3 && (
              <div className="px-4 py-2 bg-white border-t border-green-100">
                <p className="text-xs mb-2 text-gray-500">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedClick(question)}
                      className="text-xs bg-gradient-to-r from-green-500 to-teal-500 px-2 py-1 rounded-full text-white hover:opacity-80"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input box */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white border-t border-green-100"
            >
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Ask about waste segregation, recycling... ♻️`}
                  className="flex-1 px-4 py-3 border-2 border-green-200 rounded-full focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-100 text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full hover:scale-105 focus:ring-4 focus:ring-green-200 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CampusBot;
