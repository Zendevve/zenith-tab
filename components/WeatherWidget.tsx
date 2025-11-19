
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
        setError(err.message || 'Weather unavailable');
      } finally {
        setLoading(false);
      }
    };
    loadWeather();
  }, []);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-full opacity-20">
             <div className="w-5 h-5 border border-white/30 border-t-white rounded-full animate-spin" />
        </div>
    );
  }
  
  if (error) {
    return <div className="h-full flex items-center justify-center text-xs text-white/20 font-light tracking-wide">{error}</div>;
  }

  if (weather) {
    return (
      <div className="flex flex-col h-full relative overflow-hidden group p-2">
        {/* Ambient Icon Background */}
        <div className="absolute -right-8 -top-8 text-white/[0.02] transform scale-[5] blur-sm transition-transform duration-[2000ms] group-hover:scale-[5.5] group-hover:text-white/[0.04]">
             {weatherIcons[weather.icon]}
        </div>

        <div className="flex-grow flex flex-col justify-center z-10">
            <div className="flex items-start justify-between w-full">
                 <div className="flex flex-col">
                    <span className="text-7xl md:text-8xl font-thin tracking-tighter text-white leading-none">{Math.round(weather.temperature)}°</span>
                    <span className="text-sm text-white/30 mt-1 font-light tracking-widest uppercase ml-1">{weather.description}</span>
                 </div>
                 <div className="text-white/70 opacity-80 transform scale-125 mt-2">
                    {weatherIcons[weather.icon]}
                 </div>
            </div>
        </div>
        
        <div className="mt-auto z-10">
            <div className="flex items-center space-x-2 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-1 h-1 rounded-full bg-white/50 animate-pulse"></div>
                <span className="text-[9px] uppercase tracking-[0.25em] text-white/80 font-medium truncate">{weather.location}</span>
            </div>
        </div>
      </div>
    );
  }

  return null;
};

export default WeatherWidget;
