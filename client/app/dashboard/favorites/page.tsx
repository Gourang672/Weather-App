"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, MapPin, Plus, Trash2, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useCreateFavoriteMutation, useGetUserFavoritesQuery, useDeleteFavoriteMutation } from "@/redux/apis/favoriteApi/favoriteApi"
import { useGetWeatherQuery } from "@/redux/apis/weatherApi/weatherApi"
import { useGetUserQuery } from "@/redux/apis/userApi/userApi"
import { getUserIdFromToken } from "@/lib/jwt-utils"
import { toast } from "sonner"
import locations from "@/data/locations.json"

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
  favorite: { _id: string; location: string; label?: string }
  onDelete: (id: string) => void
  deleteLoading: boolean
  tempUnit: 'F' | 'C'
  windUnit: 'mph' | 'kmh'
}) {
  const location = favorite.location?.trim() || ""
  const { data: weather, isLoading, error } = useGetWeatherQuery(location, { skip: !location })

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
            <h4 className="font-semibold text-lg">{favorite.location}</h4>
            {favorite.label && (
              <p className="text-sm text-muted-foreground">{favorite.label}</p>
            )}
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
  const [selectedCountry, setSelectedCountry] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [label, setLabel] = useState("")
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const id = getUserIdFromToken()
    setUserId(id)
  }, [])

  // Reset state and city when country changes
  useEffect(() => {
    setSelectedState("")
    setSelectedCity("")
  }, [selectedCountry])

  // Reset city when state changes
  useEffect(() => {
    setSelectedCity("")
  }, [selectedState])

  const { data: user } = useGetUserQuery(userId!, { skip: !userId })
  const { data: userFavorites, isLoading: favoritesLoading, refetch } = useGetUserFavoritesQuery()
  const [createFavorite, { isLoading: createLoading }] = useCreateFavoriteMutation()
  const [deleteFavorite, { isLoading: deleteLoading }] = useDeleteFavoriteMutation()

  const tempUnit = user?.tempUnit || 'F'
  const windUnit = user?.windUnit || 'mph'

  // Use local locations data (client/data/locations.json)
  const locationData: Record<string, Record<string, string[]>> = locations as unknown as Record<string, Record<string, string[]>>
  const countries = Object.keys(locationData)
  const states: string[] = selectedCountry ? Object.keys(locationData[selectedCountry]) : []
  const cities: string[] = selectedState && selectedCountry ? locationData[selectedCountry][selectedState] : []

  const handleAddFavorite = async () => {
    if (!selectedCity.trim()) {
      toast.error("Please select a city")
      return
    }

    try {
      await createFavorite({
        location: selectedCity,
        label: label.trim() || ""
      }).unwrap()
      toast.success("Favorite added successfully!")
      setSelectedCountry("")
      setSelectedState("")
      setSelectedCity("")
      setLabel("")
      refetch()
    } catch (error) {
      toast.error("Failed to add favorite")
      console.error("Error adding favorite:", error)
    }
  }

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
      {/* Add Favorite Section */}
      <div className="dashboard-card rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Favorite</h3>
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="country-select">Country</Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select country..." />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="state-select">State</Label>
            <Select value={selectedState} onValueChange={setSelectedState} disabled={!selectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select state..." />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city-select">City</Label>
            <Select value={selectedCity} onValueChange={setSelectedCity} disabled={!selectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Select city..." />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="label-input">Label (Optional)</Label>
            <Input
              id="label-input"
              placeholder="e.g., Home, Work..."
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleAddFavorite}
            disabled={createLoading || !selectedCity.trim()}
          >
            {createLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {createLoading ? "Adding..." : "Add Favorite"}
          </Button>
        </div>
      </div>

      {/* Favorites Header */}
      <div className="dashboard-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
          <h3 className="text-lg font-semibold">Your Favorite Cities</h3>
        </div>
        <p className="text-muted-foreground">Your most important weather locations at a glance</p>
      </div>

      {/* Favorites Grid */}
      {favoritesLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : userFavorites && userFavorites.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedFavorites.map((favorite) => (
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
          <p>No favorites added yet. Add your first favorite above!</p>
        </div>
      )}
    </>
  )
}