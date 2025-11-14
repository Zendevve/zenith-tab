
import React from 'react';

interface WidgetProps {
  title: string;
  children: React.ReactNode;
}

const Widget: React.FC<WidgetProps> = ({ title, children }) => {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 text-white border border-white/20 shadow-lg h-full flex flex-col">
      <h2 className="text-lg font-bold mb-3 text-white/90">{title}</h2>
      <div className="flex-grow overflow-y-auto pr-1">
        {children}
      </div>
    </div>
  );
};

export default Widget;
