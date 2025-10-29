import React from 'react';
import { PlusIcon } from './Icons';

interface FloatingActionButtonProps {
  onClick: () => void;
  tooltip: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick, tooltip }) => {
  return (
    <div className="fixed bottom-6 right-6 group">
      <button
        onClick={onClick}
        className="bg-primary hover:bg-secondary text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        aria-label={tooltip}
      >
        <PlusIcon className="h-6 w-6" />
      </button>
      <div className="absolute bottom-1/2 translate-y-1/2 right-full mr-3 px-2 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {tooltip}
      </div>
    </div>
  );
};

export default FloatingActionButton;
