
import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="text-white text-8xl md:text-9xl font-bold tracking-tight text-center" style={{ textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
      {formatTime(time)}
    </div>
  );
};

export default Clock;
