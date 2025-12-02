
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
    <div className="group/widget relative h-full flex flex-col border-2 border-[var(--border-color)] bg-[var(--bg-color)] hover:border-[var(--accent-color)] transition-colors duration-0">
      
      {/* Brutalist Header */}
      <div className="flex justify-between items-stretch border-b-2 border-[var(--border-color)] bg-[var(--border-color)] text-[var(--bg-color)] min-h-[32px]">
        <div className="px-3 flex items-center bg-[var(--accent-color)] text-[var(--bg-color)] font-bold text-xs tracking-widest uppercase">
          {title}
        </div>
        
        <div className="flex-grow flex items-center justify-end px-2 space-x-2">
            {(onSizeChange || onClose) && widgetId && (
                <div className="flex h-full items-center space-x-2">
                    {onSizeChange && typeof size !== 'undefined' && (
                        <>
                          <button
                              onClick={() => onSizeChange(widgetId, size - 1)}
                              disabled={size <= MIN_SIZE}
                              className="h-5 w-5 flex items-center justify-center bg-black text-white hover:bg-white hover:text-black disabled:opacity-20 transition-colors"
                              aria-label="Shrink"
                          >
                              <ChevronLeftIcon className="w-3 h-3" />
                          </button>
                          <button
                              onClick={() => onSizeChange(widgetId, size + 1)}
                              disabled={size >= MAX_SIZE}
                              className="h-5 w-5 flex items-center justify-center bg-black text-white hover:bg-white hover:text-black disabled:opacity-20 transition-colors"
                              aria-label="Expand"
                          >
                              <ChevronRightIcon className="w-3 h-3" />
                          </button>
                        </>
                    )}
                    {onClose && (
                        <button
                            onClick={() => onClose(widgetId)}
                            className="h-5 w-5 flex items-center justify-center bg-red-600 text-white hover:bg-red-500"
                            aria-label="Close"
                        >
                            <XIcon className="w-3 h-3" />
                        </button>
                    )}
                </div>
            )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto p-4 scrollbar-hide text-[var(--fg-color)]">
        {children}
      </div>
      
      {/* Decoration: Corner Marker */}
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-[var(--accent-color)]"></div>
    </div>
  );
};

export default Widget;
