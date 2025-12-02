import React, { useState } from 'react';
import { SearchIcon } from './icons';

const SearchWidget: React.FC = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="h-full flex flex-col justify-center px-4">
      <form onSubmit={handleSearch} className="w-full relative group">
        <SearchIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[var(--accent-color)] transition-colors" />
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-b border-white/10 py-2 pl-8 text-lg font-light text-white focus:outline-none focus:border-[var(--accent-color)] placeholder-white/20 transition-colors"
            placeholder="Search..."
        />
      </form>
    </div>
  );
};

export default SearchWidget;