import React, { useRef, useEffect } from 'react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { Message } from '@/hooks/useChat';
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

interface LessonItem {
  id: string;
  hebrew_input: string;
  // ...other lesson fields if needed
}

interface ChatContainerProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  remainingMessages?: number;
  level: string;
  week: string;
  lessonData?: LessonItem[];
}

const DEFAULT_STATIC_SUGGESTIONS = [
  'מה המילה הכי יפה שלמדתי השבוע? 🌸',
  'איך אפשר להגיד משהו חמוד בערבית? 💕',
  'בואו נתרגל ביטוי חדש! 🎯',
  'יש לך טיפ מעניין ללמידה? 🤔'
];

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  messages, 
  isTyping, 
  onSendMessage,
  disabled = false,
  remainingMessages,
  level,
  week,
  lessonData = []
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [defaultSuggestions, setDefaultSuggestions] = React.useState<string[]>(DEFAULT_STATIC_SUGGESTIONS);

  React.useEffect(() => {
    async function fetchMaterialSuggestions() {
      try {
        const materialsCol = collection(db, "materials");
        const snapshot = await getDocs(materialsCol);
        const suggestions: string[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.hebrew_input) {
            suggestions.push(`איך אומרים "${data.hebrew_input}" בערבית?`);
          }
        });
        if (suggestions.length > 0) {
          setDefaultSuggestions(suggestions.slice(0, 3));
        }
      } catch (e) {
        // fallback to static
        setDefaultSuggestions(DEFAULT_STATIC_SUGGESTIONS);
      }
    }
    fetchMaterialSuggestions();
  }, []);

  // Suggestion chips logic
  const prefix = `${level}_week_${week}_`;
  const lessonSuggestions = lessonData
    .filter(item => item.id && item.id.startsWith(prefix))
    .map(item => `איך אומרים "${item.hebrew_input}" בערבית?`)
    .slice(0, 3);
  const suggestions = lessonSuggestions.length > 0 ? lessonSuggestions : defaultSuggestions;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
      <div
      className="
        chat-container
        border-brand-bordeaux/20 backdrop-blur-sm flex flex-col
        w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] xl:h-[90vh] 2xl:h-[95vh]"
    >
    <div className="chat-message-container p-4 flex-1 overflow-y-auto">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
        {isTyping && (
          <div className="flex w-full max-w-[80%] mr-auto justify-start">
            <div className="bg-brand-darkGray text-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="block h-2 w-2 rounded-full bg-white/50 animate-pulse"></span>
                <span className="block h-2 w-2 rounded-full bg-white/50 animate-pulse delay-150"></span>
                <span className="block h-2 w-2 rounded-full bg-white/50 animate-pulse delay-300"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Suggestion Chips at the Bottom */}
      <div className="w-full px-4 pb-2 flex flex-wrap gap-2 justify-end rtl flex-row-reverse ">
        {suggestions.map((s, i) => (
          <button
            key={i}
            className="bg-yellow-200 border border-yellow-400 rounded-full px-4 py-2 text-sm text-right hover:bg-yellow-300 transition disabled:opacity-50 rtl:text-right"
            onClick={() => onSendMessage(s)}
            disabled={disabled}
            type="button"
            dir="rtl"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="chat-input-container border-t-brand-bordeaux/20">
        <ChatInput 
          onSendMessage={onSendMessage} 
          disabled={disabled}
          remainingMessages={remainingMessages} 
        />
      </div>
    </div>
  );
};

export default ChatContainer;