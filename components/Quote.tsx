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
      <div className="text-center text-white/80" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
        <p className="text-lg italic">"Loading an insight..."</p>
      </div>
    );
  }

  if (!quoteData) return null;

  return (
    <div className="relative group text-center text-white [animation:fadeIn_1s_ease-in-out]" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
      <p className="text-2xl md:text-3xl italic leading-relaxed max-w-2xl mx-auto">"{quoteData.quote}"</p>
      <p className="mt-3 text-md text-white/70">— {quoteData.author}</p>
      <button 
        onClick={onRefresh}
        disabled={isLoading}
        className="absolute -top-2 -right-4 md:-right-8 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-wait"
        aria-label="Get new quote"
      >
        <ShuffleIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default QuoteDisplay;