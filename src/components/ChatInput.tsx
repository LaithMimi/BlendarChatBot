import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  remainingMessages?: number;
  currentLanguage: 'english' | 'hebrew' | 'arabic';
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  remainingMessages,
  currentLanguage,
}) => {
  const [message, setMessage] = useState('');
  const [isRtl, setIsRtl] = useState(false);
  const navigate = useNavigate();
  const { isPremium } = useAuth();

  // Update RTL based on message content or explicit language
  useEffect(() => {
    const rtlPattern = /[\u0590-\u05FF\u0600-\u06FF]/;
    setIsRtl(
      rtlPattern.test(message) || ['hebrew', 'arabic'].includes(currentLanguage)
    );
  }, [message, currentLanguage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed && !disabled) {
      onSendMessage(trimmed);
      setMessage('');
      setIsRtl(false);
    }
  };

  const handleUpgrade = () => {
    navigate('/subscription');
  };

  const getPlaceholder = () => {
    if (disabled) {
      return currentLanguage === 'english'
        ? 'Upgrade to Premium to send more messages'
        : 'שדרג לפרמיום כדי לשלוח עוד הודעות';
    }

    if (
      remainingMessages !== undefined &&
      remainingMessages <= 5 &&
      !isPremium
    ) {
      return currentLanguage === 'english'
        ? `${remainingMessages} message${
            remainingMessages === 1 ? '' : 's'
          } remaining – Type your message`
        : `נותרו ${remainingMessages} הודעות – כתוב הודעה`;
    }

    return currentLanguage === 'english'
      ? 'Type your message here...'
      : 'כתוב כאן את ההודעה שלך...';
  };

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={getPlaceholder()}
            className={`w-full py-3 px-4 rounded-full 
              ${
                disabled
                  ? 'bg-gray-100 dark:bg-gray-800 border-red-300 dark:border-red-900/30 opacity-70 cursor-not-allowed'
                  : 'bg-white/80 dark:bg-black/20 border-white/20 dark:border-white/10 focus:ring-brand-yellow/30'
              } 
              backdrop-blur-md border focus:outline-none transition-all duration-300 
              ${isRtl ? 'text-right' : 'text-left'}`}
            dir={isRtl ? 'rtl' : 'ltr'}
            lang={
              isRtl
                ? currentLanguage === 'arabic'
                  ? 'ar'
                  : 'he'
                : 'en'
            }
            autoComplete="off"
            disabled={disabled}
          />

          {remainingMessages !== undefined &&
            remainingMessages < 10 &&
            !isPremium &&
            !disabled && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs rounded-full">
                    {remainingMessages}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {currentLanguage === 'english'
                      ? `${remainingMessages} message${
                          remainingMessages === 1 ? '' : 's'
                        } remaining`
                      : `נותרו ${remainingMessages} הודעות`}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
        </div>

        {disabled ? (
          <Button
            type="button"
            onClick={handleUpgrade}
            className="py-3 px-4 rounded-full bg-brand-yellow text-brand-darkGray transition-all duration-300 hover:shadow-md hover:scale-[1.02] flex items-center gap-2"
            aria-label={
              currentLanguage === 'english'
                ? 'Upgrade to premium'
                : 'שדרג לפרמיום'
            }
          >
            <Crown size={18} />
            <span className="hidden sm:inline-block">
              {currentLanguage === 'english'
                ? 'Upgrade to Premium'
                : 'שדרג לפרמיום'}
            </span>
            <span className="inline-block sm:hidden">
              {currentLanguage === 'english' ? 'Upgrade' : 'שדרג'}
            </span>
          </Button>
        ) : (
          <button
            type="submit"
            disabled={!message.trim()}
            className={`p-3 rounded-full bg-brand-bordeaux text-white transition-all duration-300 ${
              message.trim()
                ? 'opacity-100 hover:shadow-md hover:scale-[1.02]'
                : 'opacity-50 cursor-not-allowed'
            }`}
            aria-label={
              currentLanguage === 'english'
                ? 'Send message'
                : 'שלח הודעה'
            }
          >
            <Send size={20} />
          </button>
        )}
      </form>
    </TooltipProvider>
  );
};

export default ChatInput;
