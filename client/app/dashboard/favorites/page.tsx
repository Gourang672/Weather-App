"use client"

import { Button } from "@/components/ui/button"
import { Star, MapPin, Trash2, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useGetUserFavoritesQuery, useDeleteFavoriteMutation } from "@/redux/apis/favoriteApi/favoriteApi"
import { useGetWeatherQuery } from "@/redux/apis/weatherApi/weatherApi"
import { useGetUserQuery } from "@/redux/apis/userApi/userApi"
import { getUserIdFromToken } from "@/lib/jwt-utils"
import { toast } from "sonner"

// Weather icon based on weather code
const getWeatherIcon = (code: number | null | undefined) => {
  if (code === null || code === undefined) return "🌤️"
  if (code === 0) return "☀️"
  if (code <= 3) return "⛅"
  if (code <= 48) return "🌫️"
  if (code <= 67) return "🌧️"
  if (code <= 77) return "🌨️"
  if (code <= 82) return "🌧️"
  if (code <= 86) return "🌨️"
  if (code >= 95) return "⛈️"
  return "🌤️"
}

// Favorite card component with weather data
function FavoriteWeatherCard({ 
  favorite, 
  onDelete, 
  deleteLoading,
  tempUnit,
  windUnit
}: { 
  favorite: { _id: string; city: { _id: string; name: string }; createdAt?: string }
  onDelete: (id: string) => void
  deleteLoading: boolean
  tempUnit: 'F' | 'C'
  windUnit: 'mph' | 'kmh'
}) {
  const cityName = favorite.city?.name?.trim() || ""
  const { data: weather, isLoading, error } = useGetWeatherQuery(cityName, { skip: !cityName })

  const convertTemperature = (temp: number, unit: 'F' | 'C') => {
    if (unit === 'F') return Math.round((temp * 9/5) + 32)
    return Math.round(temp)
  }

  const convertWindSpeed = (speed: number, unit: 'mph' | 'kmh') => {
    if (unit === 'mph') return Math.round(speed * 0.621371)
    return Math.round(speed)
  }

  // Get today's high/low from daily data
  const todayHigh = weather?.daily?.temperature_2m_max?.[0]
  const todayLow = weather?.daily?.temperature_2m_min?.[0]

  return (
    <div className="dashboard-card rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          <div>
            <h4 className="font-semibold text-lg">{favorite.city?.name}</h4>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {isLoading ? "Loading..." : weather?.location || "City"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(favorite._id)}
          disabled={deleteLoading}
        >
          {deleteLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-2">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : error ? (
              <span className="text-red-500">Weather unavailable</span>
            ) : (
              <>
                <span className="text-3xl font-bold">
                  {weather?.current?.temperature !== undefined 
                    ? `${convertTemperature(weather.current.temperature, tempUnit)}°${tempUnit}`
                    : `--°${tempUnit}`
                  }
                </span>
                <span className="text-muted-foreground text-sm mb-1">
                  {weather?.current?.weathercode !== undefined ? "Current" : "No data"}
                </span>
              </>
            )}
          </div>
          <div className="text-4xl">
            {isLoading ? "⏳" : getWeatherIcon(weather?.current?.weathercode)}
          </div>
        </div>

        {!isLoading && !error && weather && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">High / Low</p>
              <p className="font-medium">
                {todayHigh !== undefined && todayLow !== undefined
                  ? `${convertTemperature(todayHigh, tempUnit)}°${tempUnit} / ${convertTemperature(todayLow, tempUnit)}°${tempUnit}`
                  : `--°${tempUnit} / --°${tempUnit}`
                }
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Humidity</p>
              <p className="font-medium">
                {weather?.current?.humidity !== undefined 
                  ? `${weather.current.humidity}%`
                  : '--%'
                }
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Wind</p>
              <p className="font-medium">
                {weather?.current?.windspeed !== undefined 
                  ? `${convertWindSpeed(weather.current.windspeed, windUnit)} ${windUnit}`
                  : `-- ${windUnit}`
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function FavoritesPage() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const id = getUserIdFromToken()
    setUserId(id)
  }, [])

  const { data: user } = useGetUserQuery(userId!, { skip: !userId })
  const { data: userFavorites, isLoading: favoritesLoading, refetch } = useGetUserFavoritesQuery()
  const [deleteFavorite, { isLoading: deleteLoading }] = useDeleteFavoriteMutation()

  const tempUnit = user?.tempUnit || 'F'
  const windUnit = user?.windUnit || 'mph'

  const handleDeleteFavorite = async (favoriteId: string) => {
    try {
      await deleteFavorite(favoriteId).unwrap()
      toast.success("Favorite removed successfully!")
      refetch()
    } catch (error) {
      toast.error("Failed to remove favorite")
      console.error("Error removing favorite:", error)
    }
  }

  const sortedFavorites = (userFavorites || []).slice().sort((a, b) => {
    if (a.createdAt && b.createdAt) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    return b._id.localeCompare(a._id)
  })

  return (
    <>
      {/* My Favorites Header */}
      <div className="dashboard-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
          <h3 className="text-lg font-semibold">My Favorites</h3>
        </div>
        <p className="text-muted-foreground">Your favorite cities added from the Cities tab</p>
      </div>

      {/* Favorites Grid */}
      {favoritesLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : userFavorites && userFavorites.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedFavorites.map((favorite: any) => (
            <FavoriteWeatherCard
              key={favorite._id}
              favorite={favorite}
              onDelete={handleDeleteFavorite}
              deleteLoading={deleteLoading}
              tempUnit={tempUnit}
              windUnit={windUnit}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>No favorites yet. Add favorites from the Cities tab!</p>
        </div>
      )}
    </>
  )
}