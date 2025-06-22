import React, { useRef, useEffect, useState, useMemo } from 'react';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import { Message } from '@/hooks/useChat';
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { Globe } from 'lucide-react';

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
  currentLanguage: string; // New prop for current language
}

// 1️⃣ Templates for constructing “how do you say…” in each language
const TRANSLATION_TEMPLATES: Record<string, (text: string) => string> = {
  arabic: (txt) => `كيف نقول "${txt}" بالعربية؟`,
  hebrew: (txt) => `איך אומרים "${txt}" בעברית?`,
  english: (txt) => `How do you say "${txt}" in English?`,
};

const DEFAULT_STATIC_SUGGESTIONS: Record<string, string[]> = {
  arabic: [
    'מה המילה הכי יפה שלמדתי השבוע? 🌸',
    'איך אפשר להגיד משהו חמוד בערבית? 💕',
    'בואו נתרגל ביטוי חדש! 🎯',
    'יש לך טיפ מעניין ללמידה? 🤔'
  ],
  hebrew: [
    'מה המילה הכי חשובה שלמדתי השבוע? 📚',
    'אפשר ללמד אותי משפט שימושי חדש? 🗣️',
    'בא לך ללמוד ביטוי יומי? ☀️',
  ],
  english: [
    'What’s the most beautiful word I learned this week? 🌸',
    'Can you teach me a cute phrase in English? 💕',
    'Let’s practice a new expression! 🎯',
    'Any interesting learning tips? 🤔'
  ],
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const languageSwitchTriggers: Record<string, Record<string, string>> = {
  english: {
    arabic: 'switch to arabic',
    hebrew: 'switch to hebrew',
  },
  hebrew: {
    arabic: 'תעבור לערבית',
    english: 'תעבור לאנגלית',
  },
  arabic: {
    hebrew: 'غير اللغة للعبرية',
    english: 'غير اللغة للإنجليزية',
  },
};

const languageLabels: Record<string, string> = {
  arabic: 'العربية',
  hebrew: 'תמלול',
  english: 'תעתיק אנגלית',
};

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  messages, 
  isTyping, 
  onSendMessage,
  disabled = false,
  remainingMessages,
  level,
  week,
  lessonData = [],
  currentLanguage, // Default language
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
 const [fallbackSuggestions, setFallbackSuggestions] = useState<string[]>(DEFAULT_STATIC_SUGGESTIONS[currentLanguage]);

  // Whenever language changes, reset fallback pool
  useEffect(() => {
    setFallbackSuggestions(DEFAULT_STATIC_SUGGESTIONS[currentLanguage]);
  }, [currentLanguage]);

  // Fetch extra materials once
  useEffect(() => {
    async function fetchMaterialSuggestions() {
      try {
        const materialsCol = collection(db, "materials");
        const snapshot = await getDocs(materialsCol);
        const suggestions: string[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.hebrew_input) {
            // Use the template for the current language
            suggestions.push(TRANSLATION_TEMPLATES[currentLanguage](data.hebrew_input));
          }
        });
        if (suggestions.length > 0) {
          setFallbackSuggestions(suggestions);
        }
      } catch {
        // keep the existing static fallback
      }
    }
    fetchMaterialSuggestions();
  }, [currentLanguage]);

  // Build lesson-based suggestions, then choose fallback if none
  const rawSuggestions = useMemo(() => {
    const prefix = `${level}_week_${week}_`;
    const lessonBased = lessonData
      .filter(item => item.id.startsWith(prefix))
      .map(item => TRANSLATION_TEMPLATES[currentLanguage](item.hebrew_input));

    return lessonBased.length > 0
      ? lessonBased
      : fallbackSuggestions;
  }, [lessonData, level, week, fallbackSuggestions, currentLanguage]);

  // Shuffle & pick top 3
  const suggestions = useMemo(() => {
    return shuffleArray(rawSuggestions).slice(0, 3);
  }, [rawSuggestions]);

    
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); // Scroll to the bottom when messages change
  }, [messages]);

  const isLTR = currentLanguage === 'english';

  return (
      <div
      className="
        chat-container
        border-brand-bordeaux/20 backdrop-blur-sm flex flex-col
        w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] xl:h-[90vh] 2xl:h-[95vh]"
    >
         <div className="px-6 py-4 border-b /* … */">
        <div className="flex gap-3 justify-center">
          {(['arabic','hebrew','english'] as const).map(langKey => (
            <button
              key={langKey}
              onClick={() => onSendMessage(languageSwitchTriggers[currentLanguage][langKey])}
              disabled={disabled}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium
                transition-all duration-200 shadow-md
                ${currentLanguage === langKey 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900'
                  : 'bg-white/80 text-gray-700 hover:bg-white/90'
                }
              `}
            >
              <Globe className="w-4 h-4"/>
              {languageLabels[langKey]}
            </button>
          ))}
        </div>
      </div>
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
            className="bg-yellow-200 dark:bg-yellow-700 border border-yellow-400 rounded-full px-4 py-2 text-sm text-right hover:bg-yellow-300 transition disabled:opacity-50 rtl:text-right"
            onClick={() => onSendMessage(s)}
            disabled={disabled}
            type="button"
            dir={isLTR ? 'ltr' : 'rtl'}
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
          currentLanguage={currentLanguage}
        />
      </div>
    </div>
  );
};

export default ChatContainer;