import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WeatherService {
  async getWeather(location: string) {
    try {
      // First, geocode the location to get lat/lon
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
      const geoResponse = await fetch(geoUrl);
      
      if (!geoResponse.ok) {
        throw new Error('Geocoding service unavailable');
      }
      
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('Location not found');
      }

      const { latitude, longitude } = geoData.results[0];

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
      const weatherResponse = await fetch(weatherUrl);
      
      if (!weatherResponse.ok) {
        throw new Error('Weather service unavailable');
      }
      
      const weatherData = await weatherResponse.json();

      const now = new Date();
      const currentHour = now.getHours();
      const currentDate = now.toISOString().split('T')[0];
      const currentTimeString = `${currentDate}T${currentHour.toString().padStart(2, '0')}:00`;
      const currentIndex = weatherData.hourly?.time?.findIndex((time: string) => time.startsWith(currentTimeString)) ?? -1;

      return {
        location: geoData.results[0].name,
        latitude,
        longitude,
        current: {
          temperature: weatherData.current_weather?.temperature ?? null,
          windspeed: weatherData.current_weather?.windspeed ?? null,
          winddirection: weatherData.current_weather?.winddirection ?? null,
          weathercode: weatherData.current_weather?.weathercode ?? null,
          humidity: currentIndex >= 0 && weatherData.hourly?.relative_humidity_2m ? weatherData.hourly.relative_humidity_2m[currentIndex] : null,
          uv_index: currentIndex >= 0 && weatherData.hourly?.uv_index ? weatherData.hourly.uv_index[currentIndex] : null,
        },
        hourly: weatherData.hourly,
        daily: weatherData.daily,
      };
    } catch (error: any) {
      if (error.message === 'Location not found' || error.message === 'Geocoding service unavailable' || error.message === 'Weather service unavailable') {
        throw error;
      }
      Logger.error(
        'Weather service error',
        error instanceof Error ? error.stack ?? String(error) : String(error),
        WeatherService.name,
      );
      throw new Error('Failed to fetch weather data');
    }
  }
}