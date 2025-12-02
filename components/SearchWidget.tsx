
import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon } from './icons';

const SearchWidget: React.FC = () => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search when pressing '/' if not already inputting text
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="h-full flex items-center justify-center p-4">
      <form onSubmit={handleSearch} className="w-full relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-white/30 group-focus-within:text-[var(--accent-color)] transition-colors duration-300" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/5 rounded-full text-white placeholder-white/20 focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-300 shadow-lg backdrop-blur-md"
          placeholder="Search Google..."
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
             <span className="text-[10px] font-mono text-white/30 px-1.5 py-0.5 rounded border border-white/10 bg-black/20">↵</span>
        </div>
        <div className="absolute -bottom-8 w-full text-center text-[10px] text-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
             Press <span className="font-mono bg-white/10 px-1 rounded">/</span> to focus
        </div>
      </form>
    </div>
  );
};

export default SearchWidget;
