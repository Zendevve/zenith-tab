
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Link } from '../types';
import { PlusIcon, TrashIcon } from './icons';

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
        <div className="grid grid-cols-2 gap-2 flex-grow content-start">
            {links.map(link => (
                <div key={link.id} className="relative group border border-[var(--border-color)] hover:bg-[var(--accent-color)] hover:border-[var(--accent-color)] transition-none">
                    <a href={link.url} className="block p-2 truncate text-xs font-bold hover:text-black">
                        {link.title.toUpperCase()}
                    </a>
                    <button 
                        onClick={(e) => {e.preventDefault(); handleDelete(link.id)}}
                        className="absolute right-0 top-0 bottom-0 px-2 bg-red-600 text-white opacity-0 group-hover:opacity-100"
                    >
                        X
                    </button>
                </div>
            ))}
             <button onClick={() => setIsAdding(true)} className="border border-dashed border-[var(--border-color)] p-2 text-xs hover:bg-[var(--fg-color)] hover:text-[var(--bg-color)]">
                + ADD_LINK
            </button>
        </div>
        
        {isAdding && (
            <form onSubmit={handleAddLink} className="mt-2 border-t border-[var(--border-color)] pt-2 flex flex-col gap-2">
                <input className="bg-transparent border border-[var(--border-color)] p-1 text-xs" placeholder="URL..." value={newUrl} onChange={e => setNewUrl(e.target.value)} autoFocus />
                <input className="bg-transparent border border-[var(--border-color)] p-1 text-xs" placeholder="TITLE..." value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                <div className="flex gap-1">
                    <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-red-600 text-xs py-1">CANCEL</button>
                    <button type="submit" className="flex-1 bg-[var(--accent-color)] text-black text-xs py-1 font-bold">SAVE</button>
                </div>
            </form>
        )}
    </div>
  );
};

export default LinksWidget;
