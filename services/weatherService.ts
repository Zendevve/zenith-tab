
import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData } from '../types';

export const fetchWeatherData = async (): Promise<WeatherData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the location (latitude: ${latitude}, longitude: ${longitude}), generate a realistic current weather report. Include temperature in Celsius, a short weather description, the city name, and an appropriate weather icon name from this list: 'sun', 'cloud', 'rain', 'snow', 'wind', 'storm', 'partly-cloudy', 'fog'.`,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  temperature: { type: Type.INTEGER },
                  description: { type: Type.STRING },
                  icon: { type: Type.STRING },
                  location: { type: Type.STRING }
                },
                required: ['temperature', 'description', 'icon', 'location']
              }
            }
          });
          const weather = JSON.parse(response.text.trim()) as Omit<WeatherData, 'icon'> & { icon: string };

          // Type assertion to fit our enum
          const typedWeather: WeatherData = {
              ...weather,
              icon: weather.icon as WeatherData['icon']
          };
          resolve(typedWeather);

        } catch (error) {
          console.error("Failed to fetch weather from Gemini:", error);
          reject(error);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        reject(new Error("Unable to retrieve your location. Please enable location services."));
      }
    );
  });
};
