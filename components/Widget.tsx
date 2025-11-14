
import React from 'react';
import { WidgetId } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from './icons';

interface WidgetProps {
  title: string;
  children: React.ReactNode;
  widgetId?: WidgetId;
  size?: number;
  onSizeChange?: (id: WidgetId, newSize: number) => void;
  onClose?: (id: WidgetId) => void;
}

const Widget: React.FC<WidgetProps> = ({ title, children, widgetId, size, onSizeChange, onClose }) => {
  const MIN_SIZE = 1;
  const MAX_SIZE = 3;

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 text-white border border-white/20 shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-3 group">
        <h2 className="text-lg font-bold text-white/90">{title}</h2>
        
        {(onSizeChange || onClose) && widgetId && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {onSizeChange && typeof size !== 'undefined' && (
                    <>
                        <button
                            onClick={() => onSizeChange(widgetId, size - 1)}
                            disabled={size <= MIN_SIZE}
                            className="p-1 rounded-full hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                            aria-label="Decrease widget size"
                        >
                            <ChevronLeftIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onSizeChange(widgetId, size + 1)}
                            disabled={size >= MAX_SIZE}
                            className="p-1 rounded-full hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                            aria-label="Increase widget size"
                        >
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </>
                )}
                {onClose && (
                    <button
                        onClick={() => onClose(widgetId)}
                        className="p-1 rounded-full hover:bg-white/20 transition-colors"
                        aria-label="Close widget"
                    >
                        <XIcon className="w-4 h-4" />
                    </button>
                )}
            </div>
        )}
      </div>
      <div className="flex-grow overflow-y-auto pr-1">
        {children}
      </div>
    </div>
  );
};

export default Widget;
