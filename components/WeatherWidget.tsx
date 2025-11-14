
import React, { useState, useEffect } from 'react';
import { fetchWeatherData } from '../services/weatherService';
import { WeatherData } from '../types';
import Widget from './Widget';
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

  return (
    <Widget title="Weather">
      {loading && <p className="text-sm text-white/70">Loading weather...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {weather && (
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{weatherIcons[weather.icon] || <CloudIcon />}</div>
          <div>
            <p className="text-2xl font-bold">{weather.temperature}°C</p>
            <p className="text-sm text-white/80">{weather.description}</p>
            <p className="text-xs text-white/60">{weather.location}</p>
          </div>
        </div>
      )}
    </Widget>
  );
};

export default WeatherWidget;
