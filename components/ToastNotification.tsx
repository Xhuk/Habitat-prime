
import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XIcon } from './Icons'; // Assuming you have an XCircleIcon for errors

interface ToastNotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const Icon = type === 'success' ? CheckCircleIcon : XIcon;

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg text-white ${bgColor} animate-fade-in`}>
      <Icon className="h-6 w-6 mr-3" />
      <p>{message}</p>
      <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-black/20">
        <XIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ToastNotification;
