import { JournalEntry } from '../_types/journal'

const mockEntries: JournalEntry[] = [
  { id: '1', date: new Date('2023-05-01'), content: "Today was a good day. I felt energetic and positive." },
  { id: '2', date: new Date('2023-05-02'), content: "I'm feeling a bit under the weather. My allergies are acting up." },
  { id: '3', date: new Date('2023-05-03'), content: "Had a great workout session. Feeling stronger every day!" },
]

export default function JournalEntryList() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Your Journal Entries</h2>
      {mockEntries.map((entry) => (
        <div key={entry.id} className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-2">{entry.date.toLocaleDateString()}</p>
          <p className="text-gray-800">{entry.content}</p>
        </div>
      ))}
    </div>
  )
}

