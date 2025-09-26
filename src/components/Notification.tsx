import React from "react";

interface Props {
  message: string;
}

const Notification: React.FC<Props> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="mb-4 p-2 rounded bg-green-500/20 text-center">
      {message}
    </div>
  );
};

export default Notification;
