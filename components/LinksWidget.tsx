
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Link } from '../types';
import { PlusIcon, TrashIcon, GlobeIcon } from './icons';

const LinksWidget: React.FC = () => {
  const [links, setLinks] = useLocalStorage<Link[]>('quick_links', [
    { id: '1', title: 'Google', url: 'https://google.com' },
    { id: '2', title: 'YouTube', url: 'https://youtube.com' },
    { id: '3', title: 'GitHub', url: 'https://github.com' },
    { id: '4', title: 'Reddit', url: 'https://reddit.com' },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const getFavicon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return '';
    }
  };

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    let formattedUrl = newUrl;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const title = newTitle || new URL(formattedUrl).hostname.replace('www.', '').split('.')[0];
    const newLink: Link = {
      id: Date.now().toString(),
      title: title.charAt(0).toUpperCase() + title.slice(1),
      url: formattedUrl,
    };

    setLinks([...links, newLink]);
    setNewUrl('');
    setNewTitle('');
    setIsAdding(false);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setLinks(links.filter(l => l.id !== id));
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="grid grid-cols-4 gap-4 overflow-y-auto p-1 scrollbar-hide">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 relative aspect-square"
          >
            <div className="w-8 h-8 mb-2 rounded-full overflow-hidden bg-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
               <img 
                 src={getFavicon(link.url)} 
                 alt={link.title}
                 className="w-full h-full object-cover"
                 onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                 }}
               />
               <GlobeIcon className="w-4 h-4 text-white/50 hidden" />
            </div>
            <span className="text-[10px] text-white/60 font-medium tracking-wide truncate w-full text-center group-hover:text-white transition-colors">
              {link.title}
            </span>
            <button
              onClick={(e) => handleDelete(e, link.id)}
              className="absolute top-1 right-1 p-1 rounded-full bg-red-500/20 text-red-300 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all scale-75 hover:scale-100"
            >
              <TrashIcon className="w-3 h-3" />
            </button>
          </a>
        ))}
        <button
          onClick={() => setIsAdding(true)}
          className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-white/10 hover:border-white/30 hover:bg-white/5 transition-all duration-300 aspect-square group"
        >
          <div className="w-8 h-8 mb-2 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <PlusIcon className="w-4 h-4 text-white/30 group-hover:text-white/80" />
          </div>
          <span className="text-[10px] text-white/30 font-medium tracking-wide group-hover:text-white/60">Add</span>
        </button>
      </div>

      {isAdding && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-[2rem] z-20 flex flex-col items-center justify-center p-6 animate-fadeIn">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/80 mb-4">New Link</h3>
          <form onSubmit={handleAddLink} className="w-full space-y-3">
            <input
              type="text"
              placeholder="https://example.com"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full bg-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] placeholder-white/20"
              autoFocus
            />
            <input
              type="text"
              placeholder="Title (Optional)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--accent-color)] placeholder-white/20"
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white/60 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-[var(--accent-color)] hover:brightness-110 text-xs text-white font-medium transition-colors shadow-lg"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LinksWidget;
