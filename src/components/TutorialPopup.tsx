import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface TutorialPopupProps {
  onClose: () => void;
}

const TutorialPopup: React.FC<TutorialPopupProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('tutorialShown', 'true');
    onClose();
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="relative max-w-md w-full bg-white dark:bg-brand-darkGray rounded-lg shadow-xl p-6 animate-scale-in rtl">
        <h3 className="text-xl font-bold mb-4 text-brand-darkGray dark:text-white text-right">
          ברוכים הבאים ל-Blend.Ar!
        </h3>
        
        <p className="mb-6 text-brand-darkGray/80 dark:text-white/80 text-right">
          לפני שתתחילו, תוכלו להתאים אישית את חווית הלמידה שלכם על ידי הגדרת העדפות.
        </p>
        
        <div className="relative mb-8">
          <div className="flex items-center gap-3 border-2 border-brand-bordeaux rounded-md p-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center h-9 w-9 rounded-full bg-brand-bordeaux text-white overflow-hidden">
                <Settings size={16} />
              </div>
            </div>
            <span className="text-sm text-right">
              לחצו על האייקון הזה כדי לגשת להעדפות שלכם
            </span>
          </div>
          
          <div className="absolute -top-2 right-16 transform rotate-45 w-4 h-4 bg-brand-bordeaux"></div>
        </div>
        
        <p className="mb-6 text-brand-darkGray/80 dark:text-white/80 text-right">
          אתם יכולים להגדיר את:
        </p>
        
        <ul className="list-disc list-inside mb-6 space-y-2 text-brand-darkGray/80 dark:text-white/80 text-right">
          <li>שם</li>
          <li>רמת שפה</li>
          <li>שבוע לימודים</li>
          <li>העדפת מגדר</li>
          <li>שפת הלימוד</li>
        </ul>
        
        <div className="flex justify-start">
          <Button onClick={handleDismiss} className="bg-brand-bordeaux hover:bg-brand-bordeaux/90 text-white">
            הבנתי!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TutorialPopup;
