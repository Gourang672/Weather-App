import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Cloud, Sun, CloudRain, Bot } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 dark:from-blue-900 dark:via-blue-800 dark:to-blue-700">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-24 mt-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              <Cloud className="h-16 w-16 text-white animate-bounce" style={{ animationDelay: '0s' }} />
              <Sun className="h-16 w-16 text-yellow-300 animate-bounce" style={{ animationDelay: '0.5s' }} />
              <CloudRain className="h-16 w-16 text-white animate-bounce" style={{ animationDelay: '1s' }} />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl" style={{ textShadow: '0 0 20px rgba(255,255,255,0.5)' }}>
            Weather App
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Get accurate weather forecasts, real-time updates, and detailed insights for any location worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/login">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 transition-all duration-300 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl">
                Get Started
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-black text-black dark:border-white dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-blue-600 hover:scale-105 transition-all duration-300 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl">
                Sign Up Free
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <Cloud className="h-12 w-12 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-blue-100">Get instant weather updates with live data from trusted sources.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <Sun className="h-12 w-12 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">7-Day Forecast</h3>
              <p className="text-blue-100">Plan ahead with detailed weather predictions for the next week.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <CloudRain className="h-12 w-12 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Weather Alerts</h3>
              <p className="text-blue-100">Stay safe with timely notifications about severe weather conditions.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <Bot className="h-12 w-12 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
              <p className="text-blue-100">Ask our AI for weather insights, forecasts, and personalized tips.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-sm py-16 mt-24 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-2xl" style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
            Weather App
          </h2>
          <p className="text-blue-100 text-lg">
            Your trusted companion for weather information
          </p>
        </div>
      </footer>
    </div>
  )
}
