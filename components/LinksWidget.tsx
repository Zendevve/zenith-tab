import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Link } from '../types';
import { PlusIcon, LinkIcon } from './icons';

const LinksWidget: React.FC = () => {
  const [links, setLinks] = useLocalStorage<Link[]>('quick_links', [
    { id: '1', title: 'Google', url: 'https://google.com' },
    { id: '2', title: 'YouTube', url: 'https://youtube.com' },
    { id: '3', title: 'GitHub', url: 'https://github.com' },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    const link: Link = { id: Date.now().toString(), title: newTitle || newUrl, url: newUrl };
    setLinks([...links, link]);
    setIsAdding(false); setNewUrl(''); setNewTitle('');
  };

  const handleDelete = (id: string) => {
      setLinks(links.filter(l => l.id !== id));
  }

  return (
    <div className="h-full flex flex-col">
        <div className="grid grid-cols-2 gap-4 flex-grow content-start">
            {links.map(link => (
                <div key={link.id} className="relative group flex items-center">
                    <a href={link.url} className="flex items-center gap-3 py-2 text-sm font-light text-white/60 hover:text-white transition-colors truncate">
                        <div className="w-1 h-1 rounded-full bg-white/30 group-hover:bg-[var(--accent-color)] transition-colors"></div>
                        {link.title}
                    </a>
                    <button 
                        onClick={(e) => {e.preventDefault(); handleDelete(link.id)}}
                        className="absolute right-0 opacity-0 group-hover:opacity-100 text-[10px] text-white/20 hover:text-white transition-all"
                    >
                        ✕
                    </button>
                </div>
            ))}
             <button onClick={() => setIsAdding(true)} className="flex items-center gap-3 py-2 text-sm font-light text-white/20 hover:text-white/60 transition-colors text-left">
                <PlusIcon className="w-3 h-3" /> Add Link
            </button>
        </div>
        
        {isAdding && (
            <form onSubmit={handleAddLink} className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2">
                <input className="bg-transparent border-b border-white/10 py-1 text-xs text-white focus:outline-none focus:border-white/40" placeholder="URL" value={newUrl} onChange={e => setNewUrl(e.target.value)} autoFocus />
                <input className="bg-transparent border-b border-white/10 py-1 text-xs text-white focus:outline-none focus:border-white/40" placeholder="Title (Optional)" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                <div className="flex justify-end gap-3 mt-2">
                    <button type="button" onClick={() => setIsAdding(false)} className="text-[10px] text-white/40 hover:text-white">Cancel</button>
                    <button type="submit" className="text-[10px] text-[var(--accent-color)] font-medium hover:text-white">Save</button>
                </div>
            </form>
        )}
    </div>
  );
};

export default LinksWidget;