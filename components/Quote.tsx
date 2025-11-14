import React from 'react';
import { Quote } from '../types';

interface QuoteDisplayProps {
  quoteData: Quote | null;
  isLoading: boolean;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quoteData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center text-white/80" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
        <p className="text-lg italic">"Loading an insight..."</p>
      </div>
    );
  }

  if (!quoteData) return null;

  return (
    <div className="text-center text-white [animation:fadeIn_1s_ease-in-out]" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
      <p className="text-2xl md:text-3xl italic leading-relaxed">"{quoteData.quote}"</p>
      <p className="mt-3 text-md text-white/70">— {quoteData.author}</p>
    </div>
  );
};

export default QuoteDisplay;