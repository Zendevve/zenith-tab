
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Greeting: React.FC = () => {
  const [name] = useLocalStorage('user_name', '');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  return (
    <h1 
      className="text-lg md:text-xl text-white/60 font-light tracking-[0.2em] uppercase animate-fadeIn mix-blend-overlay" 
    >
      {greeting}{name ? <span className="text-white/90 font-normal ml-2">{name}</span> : ''}
    </h1>
  );
};

export default Greeting;
