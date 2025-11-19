
import React, { useState, useEffect } from 'react';
import { fetchWeatherData } from '../services/weatherService';
import { WeatherData } from '../types';
import { SunIcon, CloudIcon, RainIcon, SnowIcon, WindIcon, StormIcon, PartlyCloudyIcon, FogIcon } from './icons';

const weatherIcons: Record<WeatherData['icon'], React.ReactNode> = {
  sun: <SunIcon />,
  cloud: <CloudIcon />,
  rain: <RainIcon />,
  snow: <SnowIcon />,
  wind: <WindIcon />,
  storm: <StormIcon />,
  'partly-cloudy': <PartlyCloudyIcon />,
  fog: <FogIcon />,
};

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWeatherData();
        setWeather(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch weather.');
      } finally {
        setLoading(false);
      }
    };
    loadWeather();
  }, []);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-full">
             <div className="flex space-x-1">
                <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
             </div>
        </div>
    );
  }
  
  if (error) {
    return <p className="text-xs text-red-400/60 mt-2 text-center font-light">{error}</p>;
  }

  if (weather) {
    return (
      <div className="flex flex-col justify-between h-full p-1">
        <div className="flex justify-between items-start">
            <div className="flex flex-col">
                 <span className="text-5xl font-thin tracking-tighter text-white leading-none -ml-1">{Math.round(weather.temperature)}°</span>
                 <span className="text-xs text-white/40 mt-2 font-light tracking-wide capitalize">{weather.description}</span>
            </div>
            <div className="text-white/80 opacity-60 scale-125 origin-top-right">
                {weatherIcons[weather.icon]}
            </div>
        </div>
        <div className="mt-auto pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-medium truncate max-w-[150px]">{weather.location}</span>
            </div>
        </div>
      </div>
    );
  }

  return null;
};

export default WeatherWidget;
