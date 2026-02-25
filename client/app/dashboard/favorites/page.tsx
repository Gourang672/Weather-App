import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Star, MapPin } from "lucide-react"

export default function FavoritesPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold">Favorites</h1>
          </div>
          <div className="ml-auto px-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Favorites Header */}
          <div className="dashboard-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
              <h3 className="text-lg font-semibold">Favorite Cities</h3>
            </div>
            <p className="text-muted-foreground">Your most important weather locations at a glance</p>
          </div>

          {/* Favorites Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "San Francisco",
                country: "USA",
                temp: "72°F",
                condition: "Sunny",
                high: "78°F",
                low: "65°F",
                humidity: "65%",
                wind: "8 mph NW",
                icon: "☀️"
              },
              {
                name: "New York",
                country: "USA",
                temp: "68°F",
                condition: "Partly Cloudy",
                high: "72°F",
                low: "62°F",
                humidity: "70%",
                wind: "12 mph NE",
                icon: "⛅"
              },
              {
                name: "London",
                country: "UK",
                temp: "55°F",
                condition: "Rainy",
                high: "58°F",
                low: "52°F",
                humidity: "85%",
                wind: "15 mph SW",
                icon: "🌧️"
              }
            ].map((city, index) => (
              <div key={index} className="dashboard-card rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <div>
                      <h4 className="font-semibold text-lg">{city.name}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {city.country}
                      </p>
                    </div>
                  </div>
                  <div className="text-4xl">{city.icon}</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">{city.temp}</span>
                    <span className="text-muted-foreground">{city.condition}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">High / Low</p>
                      <p className="font-medium">{city.high} / {city.low}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Humidity</p>
                      <p className="font-medium">{city.humidity}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Wind</p>
                      <p className="font-medium">{city.wind}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="flex gap-3">
              <Button variant="outline">
                <MapPin className="h-4 w-4 mr-2" />
                Add New City
              </Button>
              <Button variant="outline">
                Manage Cities
              </Button>
              <Button variant="outline">
                Weather Alerts
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}