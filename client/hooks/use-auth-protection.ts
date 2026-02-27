import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useAuthProtection() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token')
      
      if (!token) {
        setIsAuthenticated(false)
        router.push('/login')
        return
      }

      try {
        const response = await fetch('/api/auth-check', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          signal: AbortSignal.timeout(5000)
        })

        switch (response.status) {
          case 200:
            setIsAuthenticated(true)
            break
          
          case 401:
            localStorage.removeItem('access_token')
            document.cookie = 'access_token=; path=/; max-age=0'
            toast.error('Session expired. Please login again.')
            setIsAuthenticated(false)
            router.push('/login')
            break

          case 403:
            toast.error('Access denied')
            setIsAuthenticated(false)
            router.push('/login')
            break

          case 500:
            toast.error('Server error. Please try again later.')
            setIsAuthenticated(false)
            router.push('/login')
            break

          default:
            toast.error('Authentication failed')
            setIsAuthenticated(false)
            router.push('/login')
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          toast.error('Connection timeout. Please try again.')
        } else {
          toast.error('Failed to verify authentication')
        }
        setIsAuthenticated(false)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  return isAuthenticated
}
