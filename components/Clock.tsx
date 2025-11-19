
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
    <div className="relative group cursor-default">
        <div 
            className="text-8xl md:text-[10rem] leading-none font-thin tracking-tighter text-white text-center select-none transition-all duration-700 ease-out transform group-hover:scale-105" 
            style={{ textShadow: '0 0 40px rgba(255,255,255,0.1)' }}
        >
        {formatTime(time)}
        </div>
    </div>
  );
};

export default Clock;
