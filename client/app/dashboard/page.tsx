import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function Page() {
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
            <Button variant="ghost" size="sm" className="mr-2">
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Current Weather Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="dashboard-card rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Temperature</p>
                  <p className="text-2xl font-bold">72°F</p>
                  <p className="text-xs text-muted-foreground">San Francisco, CA</p>
                </div>
                <div className="text-6xl">☀️</div>
              </div>
            </div>
            <div className="dashboard-card rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Humidity</p>
                  <p className="text-2xl font-bold">65%</p>
                  <p className="text-xs text-muted-foreground">Comfortable</p>
                </div>
                <div className="text-4xl">💧</div>
              </div>
            </div>
            <div className="dashboard-card rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Wind Speed</p>
                  <p className="text-2xl font-bold">8 mph</p>
                  <p className="text-xs text-muted-foreground">NW</p>
                </div>
                <div className="text-4xl">🌬️</div>
              </div>
            </div>
            <div className="dashboard-card rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">UV Index</p>
                  <p className="text-2xl font-bold">6</p>
                  <p className="text-xs text-muted-foreground">High</p>
                </div>
                <div className="text-4xl">☀️</div>
              </div>
            </div>
          </div>

          {/* Favorites Section */}
          <div className="dashboard-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Favorite Cities</h3>
              <span className="text-sm text-muted-foreground">3 cities</span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌤️</span>
                  <div>
                    <p className="font-medium">New York</p>
                    <p className="text-sm text-muted-foreground">68°F</p>
                  </div>
                </div>
                <span className="text-yellow-500">⭐</span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌧️</span>
                  <div>
                    <p className="font-medium">London</p>
                    <p className="text-sm text-muted-foreground">55°F</p>
                  </div>
                </div>
                <span className="text-yellow-500">⭐</span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">☀️</span>
                  <div>
                    <p className="font-medium">Tokyo</p>
                    <p className="text-sm text-muted-foreground">75°F</p>
                  </div>
                </div>
                <span className="text-yellow-500">⭐</span>
              </div>
            </div>
          </div>

          {/* Recent Cities Section */}
          <div className="dashboard-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Cities</h3>
              <span className="text-sm text-muted-foreground">5 cities</span>
            </div>
            <div className="grid gap-4 md:grid-cols-5">
              <div className="text-center p-4 border rounded-lg">
                <span className="text-3xl">🌤️</span>
                <p className="font-medium mt-2">Paris</p>
                <p className="text-sm text-muted-foreground">62°F</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <span className="text-3xl">⛅</span>
                <p className="font-medium mt-2">Sydney</p>
                <p className="text-sm text-muted-foreground">78°F</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <span className="text-3xl">🌧️</span>
                <p className="font-medium mt-2">Berlin</p>
                <p className="text-sm text-muted-foreground">48°F</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <span className="text-3xl">☀️</span>
                <p className="font-medium mt-2">Miami</p>
                <p className="text-sm text-muted-foreground">82°F</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <span className="text-3xl">❄️</span>
                <p className="font-medium mt-2">Moscow</p>
                <p className="text-sm text-muted-foreground">25°F</p>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}