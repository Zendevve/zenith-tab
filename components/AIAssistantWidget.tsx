
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
      <div ref={responseContainerRef} className="flex-grow overflow-y-auto mb-3 pr-2 text-sm space-y-4">
        {!isLoading && !response && !error && (
            <div className="flex flex-col items-center justify-center h-full text-center text-white/60 p-4">
                <LightbulbIcon className="w-10 h-10 mb-3" />
                <h3 className="font-bold text-white/80">Zenith AI</h3>
                <p>Ask complex questions, brainstorm ideas, or get help with a tricky problem.</p>
            </div>
        )}
        {isLoading && (
          <div className="flex items-center space-x-2 text-white/80">
            <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            <span>Thinking...</span>
          </div>
        )}
        {error && <pre className="text-red-400 whitespace-pre-wrap font-sans">{error}</pre>}
        {response && <pre className="text-white/90 whitespace-pre-wrap font-sans">{response}</pre>}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask me anything..."
          disabled={isLoading}
          className="w-full bg-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/50 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors font-semibold disabled:bg-blue-800 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AIAssistantWidget;
