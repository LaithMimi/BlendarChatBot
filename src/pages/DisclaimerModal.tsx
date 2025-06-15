import React from "react";

interface DisclaimerModalProps {
  onAccept: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAccept }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
    dir="rtl"
  >
    <div className="bg-white dark:bg-brand-darkGray/80 text-right max-w-lg w-full rounded-2xl shadow-xl border-2 border-brand-bordeaux overflow-hidden">
      {/* Header */}
      <div className="bg-brand-bordeaux text-white p-4">
        <h2 className="text-2xl font-semibold">
          פרטיות ושימוש בצ’אטבוט ללימוד ערבית
        </h2>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4 font-sans">
        <p className="text-base leading-relaxed">
          השיחות שלכם עם הצ’אטבוט ללימוד ערבית נשמרות ונבדקות על-ידי צוות ההנהלה
          לצורכי שיפור השירות, ניטור איכות ומתן תמיכה בלימוד השפה.
        </p>
        <p className="font-medium">אין לשתף מידע אישי או רגיש, כגון:</p>
        <ul className="list-disc list-inside pl-5 space-y-2 text-sm">
          <li>מספרי כרטיסי אשראי</li>
          <li>סיסמאות או קודי גישה</li>
          <li>פרטי בריאות ורפואיים</li>
          <li>מסמכים מזהים (תעודות זהות, דרכונים וכו׳)</li>
        </ul>
        <p className="text-xs text-muted-foreground">
          בשימוש בצ’אטבוט אתם מאשרים שקראתם והבנתם את תנאי הפרטיות.
        </p>
      </div>

      {/* Footer */}
      <div className="p-4 flex justify-end bg-gray-50 dark:bg-brand-darkGray/60">
        <button
          type="button"
          className="px-6 py-2 bg-brand-bordeaux text-white rounded-lg hover:bg-brand-bordeaux/90 transition"
          onClick={onAccept}
        >
          אישור והמשך
        </button>
      </div>
    </div>
  </div>
);
export default DisclaimerModal;
