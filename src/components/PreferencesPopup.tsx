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
        className="sm:max-w-md backdrop-blur-lg bg-white/90 dark:bg-brand-darkGray/90 border border-brand-bordeaux/20 shadow-xl "
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="font-alef text-2xl font-bold text-brand-darkGray dark:text-white flex items-center ">
            <span className="bg-brand-bordeaux text-white p-1 rounded-md ml-2 ">
              {preferences.name.charAt(0) || '?'}
            </span>
            העדפות משתמש
          </DialogTitle>
            <DialogDescription dir="rtl">
            התאם אישית את חוויית הלמידה שלך עם ההגדרות הבאות
            </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-brand-darkGray dark:text-white/90">
              שמך
            </Label>
            <Input 
              type="text" 
              id="name" 
              name="name"
              className="glass-input focus:ring-2 focus:ring-brand-yellow/30" 
              placeholder="הכנס את שמך" 
              value={preferences.name}
              onChange={handleInputChange}
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level" className="text-brand-darkGray dark:text-white/90">
              רמת שליטה בערבית
            </Label>
            <Select 
              value={preferences.level} 
              onValueChange={(value) => handleSelectChange(value, 'level')}
            >
              <SelectTrigger id="level" name="level" className="glass-input">
                <SelectValue placeholder="בחר רמה" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 dark:bg-brand-darkGray/90 backdrop-blur-md border-brand-bordeaux/20">
                <SelectItem value="beginner">מתחיל</SelectItem>
                <SelectItem value="intermediate">בינוני</SelectItem>
                <SelectItem value="advanced">מתקדם</SelectItem>
                <SelectItem value="expert">מומחה</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="week" className="text-brand-darkGray dark:text-white/90">
              שבוע
            </Label>
            <Select 
              value={preferences.week} 
              onValueChange={(value) => handleSelectChange(value, 'week')}
            >
              <SelectTrigger id="week" name="week" className="glass-input">
                <SelectValue placeholder="בחר שבוע" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 dark:bg-brand-darkGray/90 backdrop-blur-md border-brand-bordeaux/20">
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
          
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-brand-darkGray dark:text-white/90">
              מגדר
            </Label>
            <Select 
              value={preferences.gender} 
              onValueChange={(value) => handleSelectChange(value, 'gender')}
            >
              <SelectTrigger id="gender" name="gender" className="glass-input">
                <SelectValue placeholder="בחר מגדר" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 dark:bg-brand-darkGray/90 backdrop-blur-md border-brand-bordeaux/20">
                <SelectItem value="male">זכר</SelectItem>
                <SelectItem value="female">נקבה</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="language" className="text-brand-darkGray dark:text-white/90">
              שפה
            </Label>
            <Select 
              value={preferences.language} 
              onValueChange={(value) => handleSelectChange(value, 'language')}
            >
              <SelectTrigger id="language" name="language" className="glass-input">
                <SelectValue placeholder="בחר שפה" />
              </SelectTrigger>
              <SelectContent className="bg-white/90 dark:bg-brand-darkGray/90 backdrop-blur-md border-brand-bordeaux/20">
                <SelectItem value="arabic">العربية</SelectItem>
                <SelectItem value="hebrew">תמלול</SelectItem>
                <SelectItem value="english">תעתיק אנגלי</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between flex flex-row gap-2 justify-end">
          <Button 
            onClick={handleSave}
            className="bg-brand-bordeaux hover:bg-brand-bordeaux/90 text-white"
          >
            <CheckIcon className="h-4 w-4 ml-2" />
            שמור העדפות
          </Button>
          <Button
            variant="outline"
            onClick={() => onSave(preferences)}
            className="border-brand-bordeaux/20 text-brand-darkGray dark:text-white hover:bg-brand-bordeaux/10"
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
