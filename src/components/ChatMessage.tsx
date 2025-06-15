import React, { useEffect, useState } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import Card3D from './Card3D';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser, timestamp }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  // Detect Arabic/Hebrew characters for RTL support
  const containsArabic = /[\u0600-\u06FF]/.test(content);
  const containsHebrew = /[\u0590-\u05FF]/.test(content);
  const isRtl = containsArabic || containsHebrew;

  // Function to format text with inline styles and insert horizontal rules between paragraphs.
  const formatText = (text: string) => {
    let formatted = text
      // Bold Arabic words
      .replace(/([\u0600-\u06FF]+)/g, '<strong>$1</strong>')
      .replace(/"([^"]+)\?"/g, '"$1?"<br/>')
      .replace(/\(([^)]+)\?\)/g, '($1?)<br/>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="font-size: larger;">$1</strong>')
      .replace(/__(.*?)__/g, '<em>$1</em>')
      .replace(/~~(.*?)~~/g, '<u>$1</u>')
      .replace(/`(.*?)`/g, '<span style="color: #ff6347;">$1</span>');

    // Split the formatted text into paragraphs using double newlines as delimiters.
    const paragraphs = formatted.split(/\n\s*\n/);
    // Wrap each paragraph in <p> tags and join them with an <hr> to add separation.
    return paragraphs
      .map(paragraph => `<p>${paragraph.trim()}</p>`)
      .join('<hr style="margin: 1rem 0; border: none; border-top: 1px solid #ccc;">');
  };

  const handleCopyMessage = async () => {
    setIsPressed(true);
    setShowRipple(true);

    try {
      await navigator.clipboard.writeText(content);
      
      // Add a slight delay for better UX
      setTimeout(() => {
        setIsCopied(true);
        setIsPressed(false);
      }, 150);

      // Reset states after animation
      setTimeout(() => {
        setIsCopied(false);
        setShowRipple(false);
      }, 2500);

    } catch (error) {
      console.error('Failed to copy message:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setTimeout(() => {
        setIsCopied(true);
        setIsPressed(false);
      }, 150);

      setTimeout(() => {
        setIsCopied(false);
        setShowRipple(false);
      }, 2500);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className={cn(
        "flex w-full max-w-[80%] transition-all duration-300 ease-in-out relative group",
        isUser ? "ml-auto justify-end" : "mr-auto justify-start",
        isVisible ? "opacity-100 animate-fade-in" : "opacity-0"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card3D
        intensity={isUser ? 5 : 2}
        className={cn(
          "rounded-2xl overflow-visible shadow-lg relative transition-all duration-300",
          isUser ? "rounded-tr-none" : "rounded-tl-none",
          isHovered && "shadow-xl transform scale-[1.02]"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-md text-sm leading-relaxed relative overflow-hidden",
            isUser
              ? "bg-brand-yellow text-brand-darkGray rounded-tr-none"
              : "bg-brand-darkGray text-white rounded-tl-none"
          )}
        >
          {/* Enhanced Copy Button */}
          <div
            className={cn(
              "absolute bottom-2 right-2 z-20 transition-all duration-300 ease-out",
              isHovered 
                ? "opacity-100 translate-y-0 scale-100" 
                : "opacity-0 translate-y-2 scale-90 pointer-events-none"
            )}
          >
            <button
              onClick={handleCopyMessage}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onMouseLeave={() => setIsPressed(false)}
              className={cn(
                "relative p-2 rounded-lg transition-all duration-200 overflow-hidden",
                "backdrop-blur-md border shadow-lg",
                "active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2",
                isUser ? (
                  isCopied 
                    ? "bg-green-100/90 border-green-300/50 text-green-700 focus:ring-green-500/50" 
                    : "bg-white/90 hover:bg-white border-brand-darkGray/20 text-brand-darkGray hover:text-brand-darkGray/80 focus:ring-brand-yellow/50"
                ) : (
                  isCopied
                    ? "bg-green-500/20 border-green-400/30 text-green-400 focus:ring-green-400/50"
                    : "bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 text-white/90 hover:text-white focus:ring-white/50"
                ),
                isPressed && "scale-90",
                "group/button"
              )}
              aria-label={isRtl ? "העתק הודעה" : "Copy message"}
              title={isRtl ? "העתק הודעה" : "Copy message"}
            >
              {/* Ripple Effect */}
              {showRipple && (
                <div className="absolute inset-0 animate-ping">
                  <div className={cn(
                    "w-full h-full rounded-lg",
                    isCopied 
                      ? "bg-green-400/30" 
                      : isUser 
                        ? "bg-brand-yellow/30" 
                        : "bg-white/30"
                  )} />
                </div>
              )}

              {/* Icon with Animation */}
              <div className="relative z-10 flex items-center justify-center">
                {isCopied ? (
                  <Check 
                    size={12} 
                    className="text-green-500" 
                  />
                ) : (
                  <Copy 
                    size={12} 
                    className={cn(
                      "transition-transform duration-200 group-hover/button:scale-90",
                      isPressed && "scale-90"
                    )} 
                  />
                )}
              </div>

              {/* Simple copied text under icon */}
              {isCopied && (
                <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className={cn(
                    "text-xs font-medium px-2 py-1 rounded",
                    isUser 
                      ? "text-brand-darkGray/70 bg-white/80" 
                      : "text-white/80 bg-black/20"
                  )}>
                    {isRtl ? "הועתק" : "Copied"}
                  </span>
                </div>
              )}

              {/* Shine Effect */}
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover/button:opacity-100",
                "bg-gradient-to-r from-transparent via-white/20 to-transparent",
                "transform -skew-x-12 translate-x-[-100%] group-hover/button:translate-x-[100%]",
                "transition-transform duration-700 ease-out"
              )} />
            </button>
          </div>

          {/* Message Content */}
          <div
            className={cn(
              "whitespace-pre-wrap break-words",
              isRtl ? "text-right" : "text-left"
            )}
            dir={isRtl ? "rtl" : "ltr"}
            lang={containsArabic ? "ar" : containsHebrew ? "he" : "en"}
            dangerouslySetInnerHTML={{ __html: formatText(content) }}
          />
          
          {/* Timestamp */}
          <div
            className={cn(
              "text-xs mt-2 opacity-70 transition-opacity duration-300",
              isRtl ? "text-left" : "text-right",
              isUser ? "text-brand-darkGray/70" : "text-white/70",
              isHovered && "opacity-50"
            )}
          >
            {formatTime(timestamp)}
          </div>
        </div>
      </Card3D>

      {/* Subtle Background Glow on Hover */}
      <div className={cn(
        "absolute inset-0 rounded-2xl transition-opacity duration-300 -z-10",
        isUser ? "rounded-tr-none" : "rounded-tl-none",
        isHovered 
          ? "opacity-100 bg-gradient-to-br from-brand-yellow/5 to-brand-bordeaux/5 blur-xl scale-110" 
          : "opacity-0"
      )} />
    </div>
  );
};

export default ChatMessage;