
import React from 'react';
import { Quote } from '../types';

interface QuoteDisplayProps {
  quoteData: Quote | null;
  isLoading: boolean;
  onRefresh: () => void;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quoteData, isLoading, onRefresh }) => {
  if (isLoading) return <div className="text-center animate-pulse">FETCHING_WISDOM...</div>;
  if (!quoteData) return null;

  return (
    <div className="w-full max-w-4xl mx-auto border-l-4 border-[var(--accent-color)] pl-4 py-2 my-4 group cursor-pointer" onClick={onRefresh}>
      <p className="text-lg md:text-xl font-bold uppercase leading-tight">
        "{quoteData.quote}"
      </p>
      <div className="mt-2 text-xs tracking-widest text-[var(--accent-color)]">
         -- {quoteData.author.toUpperCase()}
      </div>
      <div className="opacity-0 group-hover:opacity-100 text-[10px] mt-2 text-neutral-500">
        [CLICK_TO_REFRESH]
      </div>
    </div>
  );
};

export default QuoteDisplay;
