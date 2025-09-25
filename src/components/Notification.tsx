import React from "react";

interface NotificationProps {
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ message }) => {
  if (!message) return null;
  return <div className="notification">{message}</div>;
};

export default Notification;
