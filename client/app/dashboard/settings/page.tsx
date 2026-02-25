import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell, Globe, Shield, User } from "lucide-react"

export default function SettingsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold">Settings</h1>
          </div>
          <div className="ml-auto px-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
          {/* Profile Settings */}
          <div className="dashboard-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Profile Settings</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Default Location</Label>
                <Input id="location" defaultValue="San Francisco, CA" />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button>Save Changes</Button>
            </div>
          </div>

          {/* Weather Preferences */}
          <div className="dashboard-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Weather Preferences</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Temperature Unit</Label>
                  <p className="text-sm text-muted-foreground">Choose your preferred temperature scale</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">°F</Button>
                  <Button variant="outline" size="sm">°C</Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Wind Speed Unit</Label>
                  <p className="text-sm text-muted-foreground">Choose your preferred wind speed unit</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">mph</Button>
                  <Button variant="outline" size="sm">km/h</Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>24-Hour Time Format</Label>
                  <p className="text-sm text-muted-foreground">Use 24-hour time format for forecasts</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="dashboard-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Weather Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about severe weather conditions</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Daily Forecast</Label>
                  <p className="text-sm text-muted-foreground">Receive daily weather summaries</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Favorite Cities Updates</Label>
                  <p className="text-sm text-muted-foreground">Get updates for your favorite locations</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="dashboard-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Security</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Change Password</Label>
                  <p className="text-sm text-muted-foreground">Update your account password</p>
                </div>
                <Button variant="outline">Change Password</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
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
                <Button variant="destructive">Delete Account</Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}