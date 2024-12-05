export default function HealthInsights() {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Health Insights</h2>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
            Mood: Positive
          </li>
          <li className="flex items-center">
            <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
            Energy: Moderate
          </li>
          <li className="flex items-center">
            <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
            Sleep: Good
          </li>
        </ul>
        <p className="mt-4 text-sm text-gray-600">
          These insights are based on your recent journal entries. Remember, this is just a general overview. Always consult with your healthcare provider for professional advice.
        </p>
      </div>
    )
  }
  
  