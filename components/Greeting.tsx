
import React, { useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Greeting: React.FC = () => {
  const [name] = useLocalStorage('user_name', '');
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setBlink(b => !b), 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-6xl px-4 flex items-center font-mono text-sm md:text-base text-[var(--fg-color)] opacity-70 mb-2">
      <span className="text-[var(--accent-color)] mr-2">root@zenith:~#</span>
      <span>echo "Welcome back, {name || 'User'}"</span>
      <span className={`inline-block w-2.5 h-4 ml-1 bg-[var(--accent-color)] ${blink ? 'opacity-100' : 'opacity-0'}`}></span>
    </div>
  );
};

export default Greeting;
