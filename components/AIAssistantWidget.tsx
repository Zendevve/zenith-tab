
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
            <div className="flex flex-col items-center justify-center h-full text-center text-white/30 p-4 animate-fadeIn">
                <LightbulbIcon className="w-8 h-8 mb-4 opacity-50" />
                <h3 className="font-bold text-white/60 uppercase tracking-widest text-xs mb-2">Zenith AI</h3>
                <p className="font-light leading-relaxed">Ask, brainstorm, or solve.</p>
            </div>
        )}
        {isLoading && (
          <div className="flex items-center space-x-2 text-white/40 h-full justify-center">
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
        )}
        {error && <pre className="text-red-400/80 whitespace-pre-wrap font-sans text-xs leading-relaxed">{error}</pre>}
        {response && <pre className="text-white/80 whitespace-pre-wrap font-sans font-light leading-relaxed animate-fadeIn">{response}</pre>}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center relative group">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask anything..."
          disabled={isLoading}
          className="w-full bg-white/5 rounded-full px-4 py-2.5 text-sm font-light focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-white/20 placeholder-white/20 transition-all duration-300 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="absolute right-1 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all disabled:opacity-0 disabled:scale-90"
        >
          <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19V5M5 12l7-7 7 7"></path></svg>
        </button>
      </form>
    </div>
  );
};

export default AIAssistantWidget;
