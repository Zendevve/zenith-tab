
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

  return (
    <div className="relative group cursor-default select-none mix-blend-overlay">
        <div 
            className="text-[6rem] md:text-[10rem] leading-none font-thin tracking-tighter text-white/90 text-center transition-all duration-1000 ease-[cubic-bezier(0.2,0,0,1)] transform group-hover:scale-[1.01] group-hover:text-white" 
            style={{ 
                textShadow: '0 0 60px rgba(255,255,255,0.1)',
                fontWeight: 100
            }}
        >
        {formatTime(time)}
        </div>
    </div>
  );
};

export default Clock;
