import React from "react";

interface Props {
  message: string;
}

const Notification: React.FC<Props> = ({ message }) => {
  if (!message) return null;

  return <div className="notification">{message}</div>;
};

export default Notification;
