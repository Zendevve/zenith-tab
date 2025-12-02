
import React from 'react';
import { WidgetId } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, XIcon, MaximizeIcon, MinimizeIcon } from './icons';

interface WidgetProps {
  title: string;
  children: React.ReactNode;
  widgetId?: WidgetId;
  size?: number;
  isMaximized?: boolean;
  onSizeChange?: (id: WidgetId, newSize: number) => void;
  onClose?: (id: WidgetId) => void;
  onToggleMaximize?: (id: WidgetId) => void;
}

const Widget: React.FC<WidgetProps> = ({ title, children, widgetId, size, isMaximized, onSizeChange, onClose, onToggleMaximize }) => {
  const MIN_SIZE = 1;
  const MAX_SIZE = 3;

  return (
    <div className={`group/widget relative w-full h-full flex flex-col transition-all duration-300 rounded-xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 min-h-0 ${isMaximized ? 'bg-transparent' : ''}`}>
      
      {/* Minimalist Floating Controls (Visible on Hover) */}
      <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover/widget:opacity-100 transition-opacity duration-200 z-10 bg-[#0a0a0a]/80 backdrop-blur rounded px-1">
        {(onSizeChange || onClose || onToggleMaximize) && widgetId && (
            <>
                {onToggleMaximize && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleMaximize(widgetId); }}
                    className="p-1 text-white/40 hover:text-white transition-colors"
                    aria-label={isMaximized ? "Minimize" : "Maximize"}
                  >
                    {isMaximized ? <MinimizeIcon className="w-3 h-3" /> : <MaximizeIcon className="w-3 h-3" />}
                  </button>
                )}
                {!isMaximized && onSizeChange && typeof size !== 'undefined' && (
                    <>
                      <button
                          onClick={(e) => { e.stopPropagation(); onSizeChange(widgetId, size - 1); }}
                          disabled={size <= MIN_SIZE}
                          className="p-1 text-white/40 hover:text-white disabled:opacity-0 transition-colors"
                          aria-label="Shrink"
                      >
                          <ChevronLeftIcon className="w-3 h-3" />
                      </button>
                      <button
                          onClick={(e) => { e.stopPropagation(); onSizeChange(widgetId, size + 1); }}
                          disabled={size >= MAX_SIZE}
                          className="p-1 text-white/40 hover:text-white disabled:opacity-0 transition-colors"
                          aria-label="Expand"
                      >
                          <ChevronRightIcon className="w-3 h-3" />
                      </button>
                    </>
                )}
                {!isMaximized && onClose && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(widgetId); }}
                        className="p-1 text-white/40 hover:text-red-400 transition-colors ml-1"
                        aria-label="Close"
                    >
                        <XIcon className="w-3 h-3" />
                    </button>
                )}
            </>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-grow flex flex-col overflow-hidden p-4 min-h-0">
        <div 
            onClick={() => onToggleMaximize && widgetId && onToggleMaximize(widgetId)}
            className={`flex-shrink-0 text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2 select-none transition-colors flex items-center gap-2 ${onToggleMaximize ? 'cursor-pointer hover:text-[var(--accent-color)]' : ''}`}
            title={isMaximized ? "Click to minimize" : "Click to focus"}
        >
          {title}
          {!isMaximized && onToggleMaximize && (
              <MaximizeIcon className="w-2.5 h-2.5 opacity-0 group-hover/widget:opacity-50 transition-all" />
          )}
        </div>
        <div className="flex-grow overflow-y-auto scrollbar-hide text-[var(--fg-color)] relative h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Widget;
