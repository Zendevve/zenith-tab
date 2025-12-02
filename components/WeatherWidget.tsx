
import React, { useState, useEffect } from 'react';
import { fetchWeatherData } from '../services/weatherService';
import { WeatherData } from '../types';

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherData().then(setWeather).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse">LOADING_WEATHER_DATA...</div>;
  if (error) return <div className="text-red-500">ERR: {error}</div>;

  if (weather) {
    return (
      <div className="flex flex-col justify-between h-full font-mono uppercase">
        <div className="border-b border-[var(--border-color)] pb-2 mb-2">
            <span className="text-[var(--accent-color)] text-sm">LOC::</span> {weather.location}
        </div>
        
        <div className="flex-grow flex flex-col justify-center items-center">
            <div className="text-6xl font-bold">{Math.round(weather.temperature)}°</div>
            <div className="text-xl mt-2 border px-2 border-[var(--fg-color)]">{weather.description}</div>
        </div>

        <div className="border-t border-[var(--border-color)] pt-2 mt-2 flex justify-between text-xs text-neutral-500">
            <span>ICON: {weather.icon.toUpperCase()}</span>
            <span>LAT/LON REQ OK</span>
        </div>
      </div>
    );
  }

  return null;
};

export default WeatherWidget;
