import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Greeting: React.FC = () => {
  const [name] = useLocalStorage('user_name', '');
  
  const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
  };

  return (
    <div className="w-full text-center mb-2 animate-fade-in">
        <span className="text-xl md:text-2xl font-light text-white/60">
            {getGreeting()}{name ? `, ${name}` : ''}
        </span>
    </div>
  );
};

export default Greeting;