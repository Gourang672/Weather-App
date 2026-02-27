"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Loader2, Bot, X, MessageCircle } from "lucide-react"
import locations from "@/data/locations.json"

type Message = { id: string; text: string; from: 'user' | 'bot'; ts?: number }

function ToggleButton({ isOpen, onToggle, ariaLabel = "Toggle chat" }: { isOpen: boolean, onToggle: () => void, ariaLabel?: string }) {
  return (
    <div className="shadow-lg rounded-full overflow-hidden">
      <Button aria-label={ariaLabel} variant="secondary" onClick={onToggle} className="h-12 w-12 p-0 flex items-center justify-center">
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>
    </div>
  )
}

function Window({ isOpen, messages, onSend, selectedCity, setSelectedCity, cityOptions }: { isOpen: boolean; messages: Message[]; onSend: (m: string, city?: string) => Promise<void> | void; selectedCity: string; setSelectedCity: (city: string) => void; cityOptions: string[] }) {
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) setInput("")
  }, [isOpen])

  useEffect(() => {
    const el = containerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    try {
      setSending(true)
      await onSend(input.trim(), selectedCity)
      setInput("")
    } finally {
      setSending(false)
    }
  }

  return (
    <div ref={containerRef} className={`w-80 md:w-96 ${isOpen ? 'block' : 'hidden'} rounded-xl shadow-2xl`}> 
      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-3">
            <Bot className="h-8 w-8 text-muted-foreground" />
            <div>
              <div className="font-semibold">Weather Assistant</div>
              <div className="text-xs text-muted-foreground">AI-powered summaries & suggestions</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">Online</div>
        </div>
        <div className="p-3 max-h-64 overflow-y-auto space-y-3 bg-muted">
          {messages.length === 0 ? (
            <div className="text-sm text-muted-foreground">Select a city from the dropdown below and ask about the weather!</div>
          ) : (
            messages.map(m => (
              <div key={m.id} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-md p-2 ${m.from === 'user' ? 'bg-primary text-primary-foreground' : 'bg-white dark:bg-slate-800'}`}>
                  {m.text}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-3 border-t bg-background space-y-2">
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Select city (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">No city</SelectItem>
              {cityOptions.map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Input value={input} onChange={(e:any)=>setInput(e.target.value)} placeholder="Ask about the weather..." />
            <Button onClick={handleSend} disabled={sending}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// Extract city name from user message
const extractCityFromMessage = (message: string, availableCities: string[]): string | null => {
  const lower = message.toLowerCase()
  for (const city of availableCities) {
    if (lower.includes(city.toLowerCase())) return city
  }
  return null
}

// Get all available cities from locations
const getAllCities = (): string[] => {
  const locationData = locations as Record<string, Record<string, string[]>>
  const cities: Set<string> = new Set()
  Object.values(locationData).forEach(country => {
    Object.values(country).forEach(stateOrProvinceCities => {
      stateOrProvinceCities.forEach(city => cities.add(city))
    })
  })
  return Array.from(cities).sort()
}

export default function Chat({ initialOpen = false, position = 'bottom-right', persistKey = 'chat_minimized' }: { initialOpen?: boolean, position?: 'bottom-right' | 'bottom-left' | 'bottom-center', persistKey?: string }) {
  const [open, setOpen] = useState<boolean>(initialOpen)
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('__none')
  const cityOptions = getAllCities()

  useEffect(() => {
    try {
      const v = localStorage.getItem(persistKey)
      if (v === '1') setOpen(false)
    } catch (e) {}
  }, [persistKey])

  useEffect(() => {
    try { localStorage.setItem(persistKey, open ? '0' : '1') } catch (e) {}
  }, [open, persistKey])

  // Auto-detect city from favorites on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) return
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          const favorites = data?.data || []
          // Get most recent favorite
          if (favorites.length > 0) {
            const sorted = favorites.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            const recentCity = sorted[0]?.city?.name
            if (recentCity && cityOptions.includes(recentCity)) {
              setSelectedCity(recentCity)
            }
          }
        }
      } catch (e) {
        // silently fail
      }
    }
    fetchFavorites()
  }, [])

  const handleSend = useCallback(async (text: string, city?: string) => {
    const userMsg: Message = { id: String(Date.now()) + '-u', text, from: 'user', ts: Date.now() }
    setMessages(prev => [...prev, userMsg])
    try {
      // Try to extract city from message if not already selected
      let cityToSend = city
      if (!cityToSend) {
        const extractedCity = extractCityFromMessage(text, cityOptions)
        if (extractedCity) cityToSend = extractedCity
      }
      if (cityToSend === '__none') cityToSend = undefined
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/chatbot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, city: cityToSend }),
      })
      if (!res.ok) {
        const t = await res.text()
        setMessages(prev => [...prev, { id: String(Date.now()) + '-b', text: `Error: ${t}`, from: 'bot', ts: Date.now() }])
        return
      }
      const data = await res.json()
      const botReply = data?.reply ?? 'Sorry, I could not process that.'
      setMessages(prev => [...prev, { id: String(Date.now()) + '-b', text: botReply, from: 'bot', ts: Date.now() }])
    } catch (e) {
      setMessages(prev => [...prev, { id: String(Date.now()) + '-b', text: 'Network error', from: 'bot', ts: Date.now() }])
    }
  }, [cityOptions])

  const posClass = position === 'bottom-right' ? 'right-4 bottom-4' : position === 'bottom-left' ? 'left-4 bottom-4' : 'left-1/2 translate-x-[-50%] bottom-4'

  return (
    <div className={`fixed ${posClass} z-50 flex flex-col items-end gap-3`}>
      <Window isOpen={open} messages={messages} onSend={handleSend} selectedCity={selectedCity} setSelectedCity={setSelectedCity} cityOptions={cityOptions} />
      <ToggleButton isOpen={open} onToggle={() => setOpen(s => !s)} />
    </div>
  )
}
