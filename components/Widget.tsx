
import React from 'react';
import { WidgetId } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface WidgetProps {
  title: string;
  children: React.ReactNode;
  widgetId?: WidgetId;
  size?: number;
  onSizeChange?: (id: WidgetId, newSize: number) => void;
}

const Widget: React.FC<WidgetProps> = ({ title, children, widgetId, size, onSizeChange }) => {
  const MIN_SIZE = 1;
  const MAX_SIZE = 3;

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 text-white border border-white/20 shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-white/90">{title}</h2>
        {widgetId && typeof size !== 'undefined' && onSizeChange && (
          <div className="flex items-center space-x-1">
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
