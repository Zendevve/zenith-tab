
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Greeting: React.FC = () => {
  const [name] = useLocalStorage('user_name', '');
  const [greeting, setGreeting] = useState('');

  // Set greeting based on time of day, but only once on mount.
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
      className="text-4xl md:text-5xl text-white/90 font-medium [animation:fadeIn_1s_ease-in-out]" 
      style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
    >
      {greeting}{name ? `, ${name}` : '.'}
    </h1>
  );
};

export default Greeting;
