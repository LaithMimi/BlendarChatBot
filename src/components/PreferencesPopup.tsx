import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckIcon, XIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface PreferencesPopupProps {
  onSave: (preferences: UserPreferences) => void;
  isOpen: boolean;
}

export interface UserPreferences {
  name: string;
  level: string;
  week: string;
  gender: string;
  language: string;
}

const PreferencesPopup: React.FC<PreferencesPopupProps> = ({ onSave, isOpen }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    name: '',
    level: 'beginner',
    week: 'week01',
    gender: 'male',
    language: 'english'
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPreferences(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSelectChange = (value: string, field: keyof UserPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      const apiBaseUrl = import.meta.env.PROD 
        ? '/api' 
        : 'http://192.168.241.1:8888';
      await axios.post(`${apiBaseUrl}/update-preferences`, {
        userId: btoa(encodeURIComponent(preferences.name)),
        userName: preferences.name,
        level: preferences.level,
        week: preferences.week,
        gender: preferences.gender,
        language: preferences.language
      });
      toast({
        title: "העדפות נשמרו",
        description: "ההעדפות שלך נשמרו בהצלחה.",
      });
      onSave(preferences);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "אזהרה",
        description: "ההעדפות נשמרו מקומית, אך לא ניתן היה לעדכן את השרת.",
        variant: "destructive"
      });
      onSave(preferences);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onSave(preferences);
    }}>
      <DialogContent 
        className="w-full max-w-sm mx-auto sm:max-w-md md:max-w-lg backdrop-blur-lg bg-white/90 dark:bg-brand-darkGray/90 border border-brand-bordeaux/20 shadow-xl p-4 sm:p-6 rounded-xl"
        dir="rtl"
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="font-alef text-xl sm:text-2xl font-bold text-brand-darkGray dark:text-white flex items-center flex-wrap gap-2">
            <span>העדפות משתמש</span>
          </DialogTitle>
          <DialogDescription dir="rtl" className="text-sm sm:text-base">
            התאם אישית את חוויית הלמידה שלך עם ההגדרות הבאות
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-3 sm:py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="name" className="text-brand-darkGray dark:text-white/90 text-sm sm:text-base">
              שמך
            </Label>
            <Input 
              type="text" 
              id="name" 
              name="name"
              className="glass-input focus:ring-2 focus:ring-brand-yellow/30 text-sm sm:text-base rounded-lg" 
              placeholder="הכנס את שמך" 
              value={preferences.name}
              onChange={handleInputChange}
              autoComplete="name"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="level" className="text-brand-darkGray dark:text-white/90 text-sm sm:text-base">
              רמת שליטה בערבית
            </Label>
            <Select 
              value={preferences.level} 
              onValueChange={(value) => handleSelectChange(value, 'level')}
            >
              <SelectTrigger id="level" name="level" className="glass-input text-sm sm:text-base rounded-lg">
                <SelectValue placeholder="בחר רמה" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 dark:bg-brand-darkGray/90 backdrop-blur-md border-brand-bordeaux/20 text-sm sm:text-base rounded-lg">
                <SelectItem value="beginner">מתחיל</SelectItem>
                <SelectItem value="intermediate">בינוני</SelectItem>
                <SelectItem value="advanced">מתקדם</SelectItem>
                <SelectItem value="expert">מומחה</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="week" className="text-brand-darkGray dark:text-white/90 text-sm sm:text-base">
              שבוע
            </Label>
            <Select 
              value={preferences.week} 
              onValueChange={(value) => handleSelectChange(value, 'week')}
            >
              <SelectTrigger id="week" name="week" className="glass-input text-sm sm:text-base rounded-lg">
                <SelectValue placeholder="בחר שבוע" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 dark:bg-brand-darkGray/90 backdrop-blur-md border-brand-bordeaux/20 text-sm sm:text-base max-h-60 rounded-lg">
                <SelectItem value="week01">שבוע 01</SelectItem>
                <SelectItem value="week02">שבוע 02</SelectItem>
                <SelectItem value="week03">שבוע 03</SelectItem>
                <SelectItem value="week04">שבוע 04</SelectItem>
                <SelectItem value="week05">שבוע 05</SelectItem>
                <SelectItem value="week06">שבוע 06</SelectItem>
                <SelectItem value="week07">שבוע 07</SelectItem>
                <SelectItem value="week08">שבוע 08</SelectItem>
                <SelectItem value="week09">שבוע 09</SelectItem>
                <SelectItem value="week10">שבוע 10</SelectItem>
                <SelectItem value="week11">שבוע 11</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="gender" className="text-brand-darkGray dark:text-white/90 text-sm sm:text-base">
              מגדר
            </Label>
            <Select 
              value={preferences.gender} 
              onValueChange={(value) => handleSelectChange(value, 'gender')}
            >
              <SelectTrigger id="gender" name="gender" className="glass-input text-sm sm:text-base rounded-lg">
                <SelectValue placeholder="בחר מגדר" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 dark:bg-brand-darkGray/90 backdrop-blur-md border-brand-bordeaux/20 text-sm sm:text-base rounded-lg">
                <SelectItem value="male">זכר</SelectItem>
                <SelectItem value="female">נקבה</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="language" className="text-brand-darkGray dark:text-white/90 text-sm sm:text-base">
              השפה של לית'
            </Label>
            <Select 
              value={preferences.language} 
              onValueChange={(value) => handleSelectChange(value, 'language')}
            >
              <SelectTrigger id="language" name="language" className="glass-input text-sm sm:text-base rounded-lg">
                <SelectValue placeholder="בחר שפה" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 dark:bg-brand-darkGray/90 backdrop-blur-md border-brand-bordeaux/20 text-sm sm:text-base rounded-lg">
                <SelectItem value="arabic">العربية</SelectItem>
                <SelectItem value="hebrew">תמלול</SelectItem>
                <SelectItem value="english">תעתיק אנגלי</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2 mt-2 sm:mt-4">
          <Button 
            onClick={handleSave}
            className="bg-brand-bordeaux hover:bg-brand-bordeaux/90 text-white w-full sm:w-auto rounded-lg"
          >
            <CheckIcon className="h-4 w-4 ml-2" />
            שמור העדפות
          </Button>
          <Button
            variant="outline"
            onClick={() => onSave(preferences)}
            className="border-brand-bordeaux/20 text-brand-darkGray dark:text-white hover:bg-brand-bordeaux/10 w-full sm:w-auto rounded-lg"
          >
            <XIcon className="h-4 w-4 ml-2" />
            ביטול
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreferencesPopup;