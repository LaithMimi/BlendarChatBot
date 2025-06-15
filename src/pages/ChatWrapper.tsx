import React, { useState } from "react";
import Chat from "./Chat"; // your existing Chat page component
import DisclaimerModal from "./DisclaimerModal"; // the disclaimer modal component

const ChatWrapper: React.FC = () => {
  const [accepted, setAccepted] = useState(false);

  return (
    <>
      {!accepted && <DisclaimerModal onAccept={() => setAccepted(true)} />}
      {accepted && <Chat />}
    </>
  );
};

export default ChatWrapper;
