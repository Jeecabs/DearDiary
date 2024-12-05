import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Insight {
  id: string;
  title: string;
  content: string;
}

interface InsightsPanelProps {
  insights: Insight[];
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  return (
    <div className="w-full h-full overflow-y-auto p-4 space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-amber-700">Coach Insights</h2>
      {insights.map((insight) => (
        <Card key={insight.id} className="bg-white bg-opacity-80 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-amber-600">{insight.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{insight.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

