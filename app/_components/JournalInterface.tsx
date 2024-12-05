'use client'

import { useState, useEffect, useRef } from 'react'
import { JournalEntry, Insight } from '../_types/journal'
import { Caveat, Lora } from 'next/font/google'
import { Card, CardContent } from "@/components/ui/card"
import { UserCircle, Bot } from 'lucide-react'
import UserInputForm from './NewEntryForm'

const caveat = Caveat({ subsets: ['latin'] })
const lora = Lora({ subsets: ['latin'] })

export default function JournalInterface() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [newEntry, setNewEntry] = useState('')
  const entriesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // In a real application, you'd fetch entries and insights from an API
    const mockEntries: JournalEntry[] = [
      { id: '1', date: new Date('2023-05-03'), content: "Had a great workout session. Feeling stronger every day!" },
      { id: '2', date: new Date('2023-05-02'), content: "I'm feeling a bit under the weather. My allergies are acting up." },
      { id: '3', date: new Date('2023-05-01'), content: "Today was a good day. I felt energetic and positive." },
    ]
    const mockInsights: Insight[] = [
      { id: '1', date: new Date('2023-05-03'), title: 'Mood Trend', content: 'Positive mood detected. Keep it up!' },
      { id: '2', date: new Date('2023-05-02'), title: 'Health Alert', content: 'Allergy symptoms noted. Consider medication.' },
      { id: '3', date: new Date('2023-05-01'), title: 'Energy Levels', content: 'High energy observed. Great job!' },
    ]
    setEntries(mockEntries)
    setInsights(mockInsights)
  }, [])

  useEffect(() => {
    entriesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries, insights])

  const handleNewEntry = (e: React.FormEvent) => {
    e.preventDefault()
    if (newEntry.trim()) {
      const newJournalEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date(),
        content: newEntry.trim()
      }
      setEntries([...entries, newJournalEntry])
      setNewEntry('')
    }
  }

  return (
    <div className={`flex flex-col h-screen bg-[url('/paper-texture.png')] bg-repeat ${lora.className}`}>
      <div className="flex-grow overflow-y-auto p-4 md:p-8">
        {entries.map((entry, index) => (
          <div key={entry.id} className="mb-8 flex justify-between items-start animate-fade-in">
            <div className="w-[48%] flex items-start space-x-2">
              <UserCircle className="w-8 h-8 text-blue-500 mt-1 flex-shrink-0" />
              <div className="flex-grow">
                <div className={`text-sm text-gray-600 mb-1 ${caveat.className}`}>
                  {entry.date.toLocaleDateString()} {entry.date.toLocaleTimeString()}
                </div>
                <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md border border-blue-200">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{entry.content}</p>
                </div>
              </div>
            </div>
            <div className="w-[48%] flex items-start space-x-2 justify-end">
              {insights[index] && (
                <>
                  <Card className="flex-grow bg-amber-50 bg-opacity-80 shadow-sm border-amber-200">
                    <CardContent className="p-3">
                      <h3 className="text-sm font-semibold text-amber-700 mb-1">{insights[index].title}</h3>
                      <p className="text-xs text-gray-700">{insights[index].content}</p>
                    </CardContent>
                  </Card>
                  <Bot className="w-8 h-8 text-amber-500 mt-1 flex-shrink-0" />
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={entriesEndRef} />
      </div>
      <form onSubmit={handleNewEntry} className="sticky bottom-0 bg-white bg-opacity-90 border-t border-gray-200 p-4 md:p-6 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center">
          <UserInputForm />
        </div>
      </form>
    </div>
  )
}

