
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
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: clockFormat === '12h'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="relative group cursor-default select-none mix-blend-overlay flex flex-col items-center">
        <div 
            className="text-[6rem] md:text-[10rem] leading-none font-thin tracking-tighter text-white/90 text-center transition-all duration-1000 ease-[cubic-bezier(0.2,0,0,1)] transform group-hover:scale-[1.01] group-hover:text-white" 
            style={{ 
                textShadow: '0 0 60px rgba(255,255,255,0.1)',
                fontWeight: 100
            }}
        >
        {formatTime(time)}
        </div>
        <div className="text-sm md:text-base font-medium tracking-[0.4em] uppercase text-white/60 mt-2 opacity-0 -translate-y-4 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            {formatDate(time)}
        </div>
    </div>
  );
};

export default Clock;
