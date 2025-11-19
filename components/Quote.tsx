
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
      <div className="text-center text-white/20 h-8 flex items-center justify-center">
        <div className="w-1 h-1 bg-white/20 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (!quoteData) return null;

  return (
    <div className="relative group text-center max-w-2xl mx-auto px-4 py-2 transition-all duration-500">
      <div className="relative z-10">
        <p className="text-lg md:text-xl font-light italic leading-relaxed tracking-wide text-white/70 transition-colors group-hover:text-white/90">
          "{quoteData.quote}"
        </p>
        <div className="flex items-center justify-center mt-3 gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
             <div className="h-[1px] w-4 bg-white/20"></div>
             <p className="text-xs font-medium text-white/40 tracking-[0.2em] uppercase">{quoteData.author}</p>
             <div className="h-[1px] w-4 bg-white/20"></div>
        </div>
      </div>
      
      <button 
        onClick={onRefresh}
        disabled={isLoading}
        className="absolute -right-8 top-1/2 -translate-y-1/2 p-2 text-white/10 hover:text-white/50 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
        aria-label="Get new quote"
      >
        <ShuffleIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default QuoteDisplay;
