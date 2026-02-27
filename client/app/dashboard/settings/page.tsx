"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Bell, Globe, Shield, User, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation, useGetUserQuery } from "@/redux/apis/userApi/userApi"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { getUserIdFromToken } from "@/lib/jwt-utils"

export default function SettingsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
    const id = getUserIdFromToken()
    setUserId(id)
  }, [])

  const [username, setUsername] = useState('John')
  const [location, setLocation] = useState('San Francisco, CA')
  const [tempUnit, setTempUnit] = useState<'F' | 'C'>('F')
  const [windUnit, setWindUnit] = useState<'mph' | 'kmh'>('mph')
  const [hasLoadedData, setHasLoadedData] = useState(false)

  // Fetch user data (only after userId is set on client)
  const { data: userData, isLoading: isLoadingUser, error: userError } = useGetUserQuery(userId!, {
    skip: !userId || !isClient,
  })

  // Debug logging
  useEffect(() => {
  }, [userId, userData, isLoadingUser, userError])

  useEffect(() => {
    if (userData && !hasLoadedData) {
      setUsername(userData.name || 'John')
      setLocation(userData.location || 'San Francisco, CA')
      setTempUnit((userData.tempUnit as 'F' | 'C') || 'F')
      setWindUnit((userData.windUnit as 'mph' | 'kmh') || 'mph')
      setHasLoadedData(true)
    }
  }, [userData, hasLoadedData])

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

  const handleSaveChanges = async () => {
    if (!userId) {
      toast.error('Unable to identify user. Please log in again.')
      return
    }

    try {
      await updateUser({
        id: userId,
        name: username,
        location,
        tempUnit,
        windUnit,
      }).unwrap()

      toast.success('Settings updated successfully!')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update settings')
    }
  }

  const handleDeleteAccount = async () => {
    if (!userId) {
      toast.error('Unable to identify user. Please log in again.')
      return
    }

    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }
    // Show a persistent loading toast while deletion is in progress
    const toastId = toast.loading('Deleting account...')
    try {
      await deleteUser(userId).unwrap()

      // Clear auth token and redirect
      localStorage.removeItem('access_token')
      toast.success('Account deleted successfully', { id: toastId })
      router.push('/login')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete account', { id: toastId })
    }
  }

  if (!isClient || !userId || isLoadingUser) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold">Loading settings...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Profile & Preferences */}
      <div className="dashboard-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Profile & Preferences</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Default Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your location"
                />
              </div>
            </div>
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Temperature Unit</Label>
                  <p className="text-sm text-muted-foreground">Click to select °F or °C</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={tempUnit === 'F' ? 'default' : 'outline'}
                    onClick={() => setTempUnit('F')}
                  >
                    °F
                  </Button>
                  <Button
                    size="sm"
                    variant={tempUnit === 'C' ? 'default' : 'outline'}
                    onClick={() => setTempUnit('C')}
                  >
                    °C
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Wind Speed Unit</Label>
                  <p className="text-sm text-muted-foreground">Click to select mph or km/h</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={windUnit === 'mph' ? 'default' : 'outline'}
                    onClick={() => setWindUnit('mph')}
                  >
                    mph
                  </Button>
                  <Button
                    size="sm"
                    variant={windUnit === 'kmh' ? 'default' : 'outline'}
                    onClick={() => setWindUnit('kmh')}
                  >
                    km/h
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={handleSaveChanges} disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>



          {/* Danger Zone */}
          <div className="border border-destructive/20 rounded-xl p-6 bg-destructive/5">
            <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-destructive">Delete Account</Label>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Account'}
                </Button>
              </div>
            </div>
          </div>
      </>
  )
}