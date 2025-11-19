
import React from 'react';
import { Quote } from '../types';
import { ShuffleIcon } from './icons';

interface QuoteDisplayProps {
  quoteData: Quote | null;
  isLoading: boolean;
  onRefresh: () => void;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quoteData, isLoading, onRefresh }) => {
  if (isLoading) {
    return (
      <div className="h-6 w-full flex items-center justify-center opacity-20">
        <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
      </div>
    );
  }

  if (!quoteData) return null;

  return (
    <div className="relative group text-center max-w-xl mx-auto px-4 py-2">
      <div className="relative z-10 flex flex-col items-center">
        <p className="text-base md:text-lg font-light italic leading-relaxed tracking-wide text-white/60 transition-colors duration-700 group-hover:text-white/80">
          "{quoteData.quote}"
        </p>
        <div className="flex items-center gap-2 mt-2 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
             <div className="h-[1px] w-6 bg-white/10"></div>
             <p className="text-[10px] font-semibold text-white/30 tracking-[0.25em] uppercase">{quoteData.author}</p>
             <div className="h-[1px] w-6 bg-white/10"></div>
        </div>
      </div>
      
      <button 
        onClick={onRefresh}
        disabled={isLoading}
        className="absolute -right-10 top-1/2 -translate-y-1/2 p-2 text-white/10 hover:text-white/40 transition-all duration-500 opacity-0 group-hover:opacity-100 hover:scale-110 hover:rotate-180"
        aria-label="Get new quote"
      >
        <ShuffleIcon className="w-3 h-3" />
      </button>
    </div>
  );
};

export default QuoteDisplay;
