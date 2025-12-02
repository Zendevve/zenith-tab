
import React, { useState, useEffect } from 'react';

interface ClockProps {
  clockFormat: '12h' | '24h';
}

const Clock: React.FC<ClockProps> = ({ clockFormat }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: clockFormat === '12h'
    });
  };

  const formatDate = (date: Date) => {
    // ISO-like format for brutalism
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="flex flex-col items-start md:items-center w-full border-b-2 border-[var(--border-color)] pb-6 mb-6">
        <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-end px-4">
            <div 
                className="text-6xl md:text-9xl font-bold tracking-tighter text-[var(--accent-color)] leading-none"
            >
            {formatTime(time)}
            </div>
            <div className="text-xl md:text-2xl font-bold tracking-widest text-[var(--fg-color)] mt-2 md:mb-4">
                DAT::{formatDate(time)}
            </div>
        </div>
    </div>
  );
};

export default Clock;
