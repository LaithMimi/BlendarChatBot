import React from "react";

interface LanguageSwitchModalProps {
  targetLanguage: "english" | "arabic" | "hebrew";
  onConfirm: () => void;
  onCancel: () => void;
}

const languageLabels: Record<string, string> = {
  english: "אנגלית",
  arabic: "ערבית",
  hebrew: "עברית",
};

const prompts: Record<string, string> = {
  english: "האם לעבור לשפה",
  arabic: "האם לעבור לשפה",
  hebrew: "האם לעבור לשפה",
};

const LanguageSwitchModal: React.FC<LanguageSwitchModalProps> = ({
  targetLanguage,
  onConfirm,
  onCancel,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      dir="rtl"
    >
      <div className="bg-white dark:bg-brand-darkGray/80 text-right max-w-md w-full rounded-2xl shadow-xl border-2 border-brand-bordeaux overflow-hidden">
        <div className="bg-brand-bordeaux text-white p-4">
          <h2 className="text-xl font-semibold">
            {prompts[targetLanguage]} {languageLabels[targetLanguage]}?
          </h2>
        </div>
        <div className="p-6 flex justify-end gap-3 bg-gray-50 dark:bg-brand-darkGray/60">
          <button
            className="px-5 py-2 rounded-lg border border-gray-400 hover:bg-gray-100"
            onClick={onCancel}
          >
            ביטול
          </button>
          <button
            className="px-5 py-2 bg-brand-bordeaux text-white rounded-lg hover:bg-brand-bordeaux/90"
            onClick={onConfirm}
          >
            כן, החלף שפה
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitchModal;
