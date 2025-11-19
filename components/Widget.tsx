
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
    <div className="group/widget relative h-full flex flex-col transition-all duration-500 ease-out">
      {/* Glass Background Layer */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-lg transition-all duration-500 group-hover/widget:bg-black/30 group-hover/widget:border-white/20 group-hover/widget:shadow-2xl"></div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col h-full p-6">
        <div className="flex justify-between items-center mb-4 min-h-[24px]">
          <h2 className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase transition-colors group-hover/widget:text-white/70">{title}</h2>
          
          {(onSizeChange || onClose) && widgetId && (
              <div className="flex items-center space-x-1 opacity-0 translate-x-2 group-hover/widget:opacity-100 group-hover/widget:translate-x-0 transition-all duration-300 ease-out">
                  {onSizeChange && typeof size !== 'undefined' && (
                      <>
                          <button
                              onClick={() => onSizeChange(widgetId, size - 1)}
                              disabled={size <= MIN_SIZE}
                              className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-0 transition-all text-white/50 hover:text-white"
                              aria-label="Decrease widget size"
                          >
                              <ChevronLeftIcon className="w-3 h-3" />
                          </button>
                          <button
                              onClick={() => onSizeChange(widgetId, size + 1)}
                              disabled={size >= MAX_SIZE}
                              className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-0 transition-all text-white/50 hover:text-white"
                              aria-label="Increase widget size"
                          >
                              <ChevronRightIcon className="w-3 h-3" />
                          </button>
                      </>
                  )}
                  {onClose && (
                      <button
                          onClick={() => onClose(widgetId)}
                          className="p-1.5 rounded-full hover:bg-white/10 hover:bg-red-500/20 transition-all text-white/50 hover:text-red-400 ml-1"
                          aria-label="Close widget"
                      >
                          <XIcon className="w-3 h-3" />
                      </button>
                  )}
              </div>
          )}
        </div>
        <div className="flex-grow overflow-y-auto pr-1 scrollbar-hide mask-fade-bottom">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Widget;
