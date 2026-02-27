"use client"

import { useGetUserQuery } from "@/redux/apis/userApi/userApi"
import { useGetWeatherQuery } from "@/redux/apis/weatherApi/weatherApi"
import { useGetUserFavoritesQuery } from "@/redux/apis/favoriteApi/favoriteApi"
import { Loader2 } from "lucide-react"
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useEffect, useState } from 'react'
import { getUserIdFromToken } from "@/lib/jwt-utils"

const getErrorMessage = (error: any): string => {
  if (error && typeof error === 'object' && 'data' in error) {
    const fetchError = error as FetchBaseQueryError
    if (fetchError.data && typeof fetchError.data === 'object' && 'message' in fetchError.data) {
      return (fetchError.data as { message: string }).message
    }
  }
  return 'Failed to load weather'
}

export default function Page() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const id = getUserIdFromToken()
    setUserId(id)
  }, [])

  const { data: user, isLoading: userLoading, error: userError } = useGetUserQuery(userId!, { skip: !userId })
  const { data: weather, isLoading: weatherLoading, error: weatherError } = useGetWeatherQuery(
    user?.location || "",
    { skip: !user?.location }
  )
  const { data: favorites, isLoading: favoritesLoading } = useGetUserFavoritesQuery()

  // Helper functions for unit conversion
  const convertTemperature = (temp: number, unit: 'F' | 'C') => {
    if (unit === 'F') {
      return Math.round((temp * 9/5) + 32)
    }
    return Math.round(temp)
  }

  const convertWindSpeed = (speed: number, unit: 'mph' | 'kmh') => {
    if (unit === 'mph') {
      return Math.round(speed * 0.621371) // Convert km/h to mph
    }
    return Math.round(speed)
  }

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    const index = Math.round(degrees / 22.5) % 16
    return directions[index]
  }

  const getUVIndexDescription = (uvIndex: number) => {
    if (uvIndex <= 2) return "Low"
    if (uvIndex <= 5) return "Moderate"
    if (uvIndex <= 7) return "High"
    if (uvIndex <= 10) return "Very High"
    return "Extreme"
  }

  const getHumidityDescription = (humidity: number) => {
    if (humidity < 30) return "Dry"
    if (humidity < 60) return "Comfortable"
    if (humidity < 80) return "Humid"
    return "Very Humid"
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (userError || !user) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load user profile</p>
      </div>
    )
  }

  return (
    <>
      {/* Current Weather Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="dashboard-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Temperature</p>
              {weatherLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : weatherError ? (
                <p className="text-red-500 text-sm">
                  {getErrorMessage(weatherError)}
                </p>
              ) : (
                <>
                  <p className="text-2xl font-bold">
                    {weather?.current?.temperature ? 
                      `${convertTemperature(weather.current.temperature, user.tempUnit)}°${user.tempUnit}` : 
                      'N/A'
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">{user.location || 'No location set'}</p>
                </>
              )}
            </div>
            <div className="text-6xl">☀️</div>
          </div>
        </div>
        <div className="dashboard-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Humidity</p>
              {weatherLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : weatherError ? (
                <p className="text-red-500 text-sm">
                  {getErrorMessage(weatherError)}
                </p>
              ) : (
                <>
                  <p className="text-2xl font-bold">
                    {weather?.current?.humidity ? `${weather.current.humidity}%` : 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {weather?.current?.humidity ? getHumidityDescription(weather.current.humidity) : ''}
                  </p>
                </>
              )}
            </div>
            <div className="text-4xl">💧</div>
          </div>
        </div>
        <div className="dashboard-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Wind Speed</p>
              {weatherLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : weatherError ? (
                <p className="text-red-500 text-sm">
                  {getErrorMessage(weatherError)}
                </p>
              ) : (
                <>
                  <p className="text-2xl font-bold">
                    {weather?.current?.windspeed ? 
                      `${convertWindSpeed(weather.current.windspeed, user.windUnit)} ${user.windUnit}` : 
                      'N/A'
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {weather?.current?.winddirection ? getWindDirection(weather.current.winddirection) : ''}
                  </p>
                </>
              )}
            </div>
            <div className="text-4xl">🌬️</div>
          </div>
        </div>
        <div className="dashboard-card rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">UV Index</p>
              {weatherLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : weatherError ? (
                <p className="text-red-500 text-sm">
                  {getErrorMessage(weatherError)}
                </p>
              ) : (
                <>
                  <p className="text-2xl font-bold">
                    {weather?.current?.uv_index !== null && weather?.current?.uv_index !== undefined ? 
                      weather.current.uv_index.toFixed(1) : 
                      'N/A'
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {weather?.current?.uv_index !== null && weather?.current?.uv_index !== undefined ? 
                      getUVIndexDescription(weather.current.uv_index) : 
                      ''
                    }
                  </p>
                </>
              )}
            </div>
            <div className="text-4xl">☀️</div>
          </div>
        </div>
      </div>

      {/* Favorites Section */}
      <div className="dashboard-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Favorite Cities</h3>
          <span className="text-sm text-muted-foreground">
            {favoritesLoading ? 'Loading...' : `${favorites?.length || 0} cities`}
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {favoritesLoading ? (
            <div className="col-span-3 flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : favorites && favorites.length > 0 ? (
            favorites.map((favorite) => (
              <FavoriteCityCard 
                key={favorite._id} 
                favorite={favorite} 
                tempUnit={user.tempUnit} 
              />
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-muted-foreground">No favorite cities yet</p>
              <p className="text-sm text-muted-foreground">Add some cities to your favorites to see them here</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// Component for favorite city cards
function FavoriteCityCard({ favorite, tempUnit }: { favorite: any, tempUnit: 'F' | 'C' }) {
  const cityName = favorite?.city?.name || favorite?.location || "";
  
  const { data: weather, isLoading, error } = useGetWeatherQuery(cityName, { skip: !cityName });

  const convertTemperature = (temp: number, unit: 'F' | 'C') => {
    if (unit === 'F') {
      return Math.round((temp * 9/5) + 32)
    }
    return Math.round(temp)
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🌤️</span>
        <div>
          <p className="font-medium">{cityName}</p>
          <p className="text-sm text-muted-foreground">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin inline" />
            ) : error ? (
              <span className="text-red-500">Error</span>
            ) : weather?.current?.temperature ? (
              `${convertTemperature(weather.current.temperature, tempUnit)}°${tempUnit}`
            ) : (
              'N/A'
            )}
          </p>
        </div>
      </div>
      <span className="text-yellow-500">⭐</span>
    </div>
  )
}