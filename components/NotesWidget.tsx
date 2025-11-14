
import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const NotesWidget: React.FC = () => {
  const [note, setNote] = useLocalStorage<string>('notes', '');

  return (
    <textarea
      value={note}
      onChange={(e) => setNote(e.target.value)}
      placeholder="Jot something down..."
      className="w-full h-full bg-transparent text-sm resize-none focus:outline-none placeholder-white/50"
    />
  );
};

export default NotesWidget;
