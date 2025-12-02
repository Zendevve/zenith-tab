
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
    <div className="group/widget relative w-full h-full flex flex-col transition-all duration-300 rounded-xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 min-h-0">
      
      {/* Minimalist Floating Controls (Visible on Hover) */}
      <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover/widget:opacity-100 transition-opacity duration-200 z-10">
        {(onSizeChange || onClose) && widgetId && (
            <>
                {onSizeChange && typeof size !== 'undefined' && (
                    <>
                      <button
                          onClick={() => onSizeChange(widgetId, size - 1)}
                          disabled={size <= MIN_SIZE}
                          className="p-1 text-white/40 hover:text-white disabled:opacity-0 transition-colors"
                          aria-label="Shrink"
                      >
                          <ChevronLeftIcon className="w-4 h-4" />
                      </button>
                      <button
                          onClick={() => onSizeChange(widgetId, size + 1)}
                          disabled={size >= MAX_SIZE}
                          className="p-1 text-white/40 hover:text-white disabled:opacity-0 transition-colors"
                          aria-label="Expand"
                      >
                          <ChevronRightIcon className="w-4 h-4" />
                      </button>
                    </>
                )}
                {onClose && (
                    <button
                        onClick={() => onClose(widgetId)}
                        className="p-1 text-white/40 hover:text-red-400 transition-colors ml-2"
                        aria-label="Close"
                    >
                        <XIcon className="w-4 h-4" />
                    </button>
                )}
            </>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden p-4 min-h-0">
        <div className="flex-shrink-0 text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2 select-none">
          {title}
        </div>
        <div className="flex-grow overflow-y-auto scrollbar-hide text-[var(--fg-color)] relative h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Widget;