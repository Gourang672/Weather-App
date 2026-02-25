import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Plus, Search, Star, Trash2 } from "lucide-react"

export default function CitiesPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold">Cities</h1>
          </div>
          <div className="ml-auto px-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Add City Section */}
          <div className="dashboard-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Add New City</h3>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for a city..."
                  className="pl-10"
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add City
              </Button>
            </div>
          </div>

          {/* My Cities Section */}
          <div className="dashboard-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">My Cities</h3>
              <span className="text-sm text-muted-foreground">8 cities</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "San Francisco", country: "USA", temp: "72°F", condition: "Sunny", favorite: true },
                { name: "New York", country: "USA", temp: "68°F", condition: "Partly Cloudy", favorite: true },
                { name: "London", country: "UK", temp: "55°F", condition: "Rainy", favorite: true },
                { name: "Tokyo", country: "Japan", temp: "75°F", condition: "Sunny", favorite: false },
                { name: "Paris", country: "France", temp: "62°F", condition: "Cloudy", favorite: false },
                { name: "Sydney", country: "Australia", temp: "78°F", condition: "Partly Cloudy", favorite: false },
                { name: "Berlin", country: "Germany", temp: "48°F", condition: "Rainy", favorite: false },
                { name: "Miami", country: "USA", temp: "82°F", condition: "Sunny", favorite: false },
              ].map((city, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{city.name}</h4>
                      <p className="text-sm text-muted-foreground">{city.country}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={city.favorite ? "text-yellow-500" : "text-muted-foreground"}
                      >
                        <Star className="h-4 w-4" fill={city.favorite ? "currentColor" : "none"} />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{city.temp}</p>
                      <p className="text-sm text-muted-foreground">{city.condition}</p>
                    </div>
                    <div className="text-3xl">
                      {city.condition === "Sunny" && "☀️"}
                      {city.condition === "Partly Cloudy" && "⛅"}
                      {city.condition === "Cloudy" && "☁️"}
                      {city.condition === "Rainy" && "🌧️"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}