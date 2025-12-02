
import React, { useState } from 'react';

const SearchWidget: React.FC = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="h-full flex flex-col justify-center">
      <form onSubmit={handleSearch} className="w-full">
        <label className="text-xs font-bold text-[var(--accent-color)] block mb-1">SEARCH_QUERY::</label>
        <div className="flex">
            <span className="bg-[var(--fg-color)] text-[var(--bg-color)] px-3 py-2 font-bold">{'>'}</span>
            <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-2 border-[var(--fg-color)] border-l-0 px-4 py-2 text-[var(--fg-color)] focus:outline-none focus:bg-[var(--border-color)] font-bold placeholder-neutral-700"
            placeholder="..."
            />
        </div>
      </form>
    </div>
  );
};

export default SearchWidget;
