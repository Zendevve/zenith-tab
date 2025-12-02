import React, { useState, useEffect } from 'react';
import { fetchWeatherData } from '../services/weatherService';
import { WeatherData } from '../types';
import { SunIcon, CloudIcon, RainIcon, SnowIcon, WindIcon, StormIcon, PartlyCloudyIcon, FogIcon } from './icons';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  'sun': SunIcon,
  'cloud': CloudIcon,
  'rain': RainIcon,
  'snow': SnowIcon,
  'wind': WindIcon,
  'storm': StormIcon,
  'partly-cloudy': PartlyCloudyIcon,
  'fog': FogIcon
};

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData().then(setWeather).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-full flex items-center justify-center text-xs text-white/30 animate-pulse">Loading...</div>;
  if (error) return <div className="h-full flex items-center justify-center text-xs text-red-400/50">Weather Unavailable</div>;

  if (weather) {
    const Icon = iconMap[weather.icon] || SunIcon;
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <Icon className="w-12 h-12 text-white/80 mb-4 stroke-1" />
        <div className="text-4xl font-light text-white tracking-tight">{Math.round(weather.temperature)}°</div>
        <div className="text-xs font-light text-white/40 mt-2 uppercase tracking-wider">{weather.location}</div>
        <div className="text-xs text-white/20 mt-1 capitalize">{weather.description}</div>
      </div>
    );
  }

  return null;
};

export default WeatherWidget;