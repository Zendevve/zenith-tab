import React, { useState, useRef, useEffect } from 'react';
import { fetchComplexResponse } from '../services/geminiService';
import { LightbulbIcon } from './icons';

const AIAssistantWidget: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const responseContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (responseContainerRef.current) {
      responseContainerRef.current.scrollTop = responseContainerRef.current.scrollHeight;
    }
  }, [response]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError('');
    setResponse('');
    
    const result = await fetchComplexResponse(prompt.trim());
    
    if (result.startsWith('An error occurred')) {
        setError(result);
    } else {
        setResponse(result);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={responseContainerRef} className="flex-grow overflow-y-auto mb-4 pr-2 text-sm space-y-4 scrollbar-hide">
        {!isLoading && !response && !error && (
            <div className="flex flex-col items-center justify-center h-full text-center text-white/30">
                <LightbulbIcon className="w-6 h-6 mb-3 opacity-30 stroke-1" />
                <p className="font-light text-xs">How can I help?</p>
            </div>
        )}
        {isLoading && (
          <div className="flex items-center space-x-2 text-white/40 h-full justify-center">
            <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse delay-75"></div>
            <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse delay-150"></div>
          </div>
        )}
        {error && <p className="text-red-400/80 text-xs font-light">{error}</p>}
        {response && <p className="text-white/80 font-light text-sm leading-relaxed whitespace-pre-wrap">{response}</p>}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center relative">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask AI..."
          disabled={isLoading}
          className="w-full bg-transparent border-b border-white/10 py-2 text-sm font-light focus:outline-none focus:border-white/40 placeholder-white/20 transition-colors"
        />
      </form>
    </div>
  );
};

export default AIAssistantWidget;