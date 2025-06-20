// ChatWrapper.tsx
import React, { useState, useEffect } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebaseConfig";
import Chat from "./Chat";
import DisclaimerModal from "./DisclaimerModal";

const ChatWrapper: React.FC = () => {
  const [accepted, setAccepted] = useState<boolean | null>(null);

  // Listen for auth state and pull the flag
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      if (!user) {
        setAccepted(false);
        return;
      }
      const userDocRef = doc(db, "users", user.uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists() && snap.data().acceptedDisclaimer) {
        setAccepted(true);
      } else {
        setAccepted(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAccept = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    // if you know the doc exists, you can update; otherwise set with merge
    await setDoc(
      userDocRef,
      { acceptedDisclaimer: true },
      { merge: true }
    );
    setAccepted(true);
  };

  // still loading flag?
  if (accepted === null) return null;

  return (
    <>
      {!accepted && <DisclaimerModal onAccept={handleAccept} />}
      {accepted && <Chat />}
    </>
  );
};

export default ChatWrapper;
