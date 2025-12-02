
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Note } from '../types';
import { PlusIcon, ChevronLeftIcon, TrashIcon } from './icons';

const NotesWidget: React.FC = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>('zenith_notes', [
    { id: '1', title: 'Welcome', content: 'This is your new space for thoughts.', updatedAt: Date.now() }
  ]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingContent, setEditingContent] = useState('');

  // Auto-save effect when editing
  useEffect(() => {
    if (activeNoteId) {
      const timer = setTimeout(() => {
        setNotes(prev => prev.map(n => 
          n.id === activeNoteId 
            ? { ...n, title: editingTitle, content: editingContent, updatedAt: Date.now() } 
            : n
        ));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [editingTitle, editingContent, activeNoteId, setNotes]);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      updatedAt: Date.now()
    };
    setNotes([newNote, ...notes]);
    openNote(newNote);
  };

  const openNote = (note: Note) => {
    setActiveNoteId(note.id);
    setEditingTitle(note.title);
    setEditingContent(note.content);
  };

  const closeNote = () => {
    setActiveNoteId(null);
  };

  const deleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotes(notes.filter(n => n.id !== id));
    if (activeNoteId === id) closeNote();
  };

  if (activeNoteId) {
    return (
      <div className="flex flex-col h-full animate-fade-in">
        <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2">
          <button onClick={closeNote} className="text-white/40 hover:text-white transition-colors p-1 -ml-1">
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <input 
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            placeholder="Untitled Note"
            className="bg-transparent w-full text-sm font-medium focus:outline-none placeholder-white/20"
          />
        </div>
        <textarea
          value={editingContent}
          onChange={(e) => setEditingContent(e.target.value)}
          placeholder="Start typing..."
          className="w-full flex-grow bg-transparent text-sm font-light resize-none focus:outline-none placeholder-white/20 leading-relaxed scrollbar-hide"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto scrollbar-hide space-y-2">
        {notes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/20 text-xs italic">
            No notes yet
          </div>
        ) : (
          notes.map(note => (
            <div 
              key={note.id}
              onClick={() => openNote(note)}
              className="group p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer relative"
            >
              <h4 className="text-sm font-medium text-white/80 truncate pr-6">
                {note.title || <span className="text-white/30 italic">Untitled</span>}
              </h4>
              <p className="text-xs text-white/40 truncate mt-1">
                {note.content || <span className="opacity-0">Empty</span>}
              </p>
              <button 
                onClick={(e) => deleteNote(e, note.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
              >
                <TrashIcon className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
      <button 
        onClick={handleCreateNote}
        className="mt-4 flex items-center justify-center gap-2 w-full py-2 border border-white/10 rounded-lg text-xs text-white/60 hover:text-white hover:border-white/30 transition-all"
      >
        <PlusIcon className="w-3 h-3" /> New Note
      </button>
    </div>
  );
};

export default NotesWidget;