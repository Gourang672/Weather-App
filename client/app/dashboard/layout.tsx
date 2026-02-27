'use client'

import { useAuthProtection } from '@/hooks/use-auth-protection'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import ChatWidget from '@/components/chat/chat'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLogoutMutation } from '@/redux/apis/authApi/authApi'
import { toast } from 'sonner'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthenticated = useAuthProtection()
  const router = useRouter()
  const [logout] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      const response = await logout({}).unwrap()
      localStorage.removeItem('access_token')
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error: any) {
      const status = error?.status
      const httpStatus = error?.originalStatus
      
      // Handle specific error codes
      if (httpStatus === 401) {
        toast.error('Session already expired')
      } else if (httpStatus === 500) {
        toast.error('Server error during logout')
      } else if (status === 'FETCH_ERROR') {
        toast.error('Network error')
      } else {
        toast.error('Logout failed')
      }
      
      // Always clear local storage and redirect, even if API call fails
      localStorage.removeItem('access_token')
      router.push('/login')
    }
  }

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold">Loading...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <div className="ml-auto px-4">
            <Button variant="ghost" size="sm" className="mr-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
        <ChatWidget initialOpen={false} position="bottom-right" />
      </SidebarInset>
    </SidebarProvider>
  )
}
