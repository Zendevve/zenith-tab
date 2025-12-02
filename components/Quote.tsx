import React from 'react';
import { Quote } from '../types';

interface QuoteDisplayProps {
  quoteData: Quote | null;
  isLoading: boolean;
  onRefresh: () => void;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quoteData, isLoading, onRefresh }) => {
  if (isLoading) return <div className="text-center text-xs text-white/20 animate-pulse">Loading inspiration...</div>;
  if (!quoteData) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-8 group cursor-pointer text-center" onClick={onRefresh}>
      <p className="text-lg md:text-xl font-light leading-relaxed text-white/80 italic">
        "{quoteData.quote}"
      </p>
      <div className="mt-3 text-xs tracking-widest uppercase text-white/40">
         {quoteData.author}
      </div>
    </div>
  );
};

export default QuoteDisplay;