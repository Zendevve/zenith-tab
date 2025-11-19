
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
    <div className="group/widget relative h-full flex flex-col transition-all duration-700 cubic-bezier(0.2, 0, 0, 1)">
      {/* Premium Glass Background Layer */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-2xl rounded-[2rem] border border-white/5 shadow-lg transition-all duration-700 group-hover/widget:bg-black/30 group-hover/widget:border-white/10 group-hover/widget:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"></div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col h-full p-6">
        <div className="flex justify-between items-center mb-4 min-h-[24px]">
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase transition-colors duration-500 group-hover/widget:text-white/50">{title}</h2>
          
          {(onSizeChange || onClose) && widgetId && (
              <div className="flex items-center space-x-1 opacity-0 translate-y-1 group-hover/widget:opacity-100 group-hover/widget:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)]">
                  {onSizeChange && typeof size !== 'undefined' && (
                      <div className="flex bg-white/5 rounded-full p-0.5 backdrop-blur-md border border-white/5">
                          <button
                              onClick={() => onSizeChange(widgetId, size - 1)}
                              disabled={size <= MIN_SIZE}
                              className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-10 transition-all text-white/40 hover:text-white active:scale-90"
                              aria-label="Decrease widget size"
                          >
                              <ChevronLeftIcon className="w-3 h-3" />
                          </button>
                          <button
                              onClick={() => onSizeChange(widgetId, size + 1)}
                              disabled={size >= MAX_SIZE}
                              className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-10 transition-all text-white/40 hover:text-white active:scale-90"
                              aria-label="Increase widget size"
                          >
                              <ChevronRightIcon className="w-3 h-3" />
                          </button>
                      </div>
                  )}
                  {onClose && (
                      <button
                          onClick={() => onClose(widgetId)}
                          className="p-1.5 rounded-full bg-white/5 hover:bg-red-500/20 border border-white/5 transition-all text-white/30 hover:text-red-400 active:scale-90 ml-1"
                          aria-label="Close widget"
                      >
                          <XIcon className="w-3 h-3" />
                      </button>
                  )}
              </div>
          )}
        </div>
        {/* Content Area with Subtle Bottom Fade */}
        <div 
            className="flex-grow overflow-y-auto pr-2 scrollbar-hide"
            style={{ maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)' }}
        >
          {children}
          <div className="h-4"></div>
        </div>
      </div>
    </div>
  );
};

export default Widget;
