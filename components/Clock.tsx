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
      hour: 'numeric', 
      minute: '2-digit',
      hour12: clockFormat === '12h'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
    });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-12 select-none">
        <div 
            className="text-8xl md:text-9xl font-light tracking-tight text-[var(--fg-color)] leading-none opacity-90"
        >
        {formatTime(time)}
        </div>
        <div className="text-sm md:text-base font-light tracking-[0.2em] uppercase text-white/40 mt-4">
            {formatDate(time)}
        </div>
    </div>
  );
};

export default Clock;