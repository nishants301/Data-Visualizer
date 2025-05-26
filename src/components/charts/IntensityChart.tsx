
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from "recharts";
import type { DataEntry } from "@/pages/Index";

interface IntensityChartProps {
  data: DataEntry[];
}

export const IntensityChart = ({ data }: IntensityChartProps) => {
  const intensityRanges = {
    'Low (0-2)': data.filter(d => d.intensity >= 0 && d.intensity <= 2).length,
    'Medium (3-5)': data.filter(d => d.intensity >= 3 && d.intensity <= 5).length,
    'High (6-8)': data.filter(d => d.intensity >= 6 && d.intensity <= 8).length,
    'Very High (9+)': data.filter(d => d.intensity >= 9).length,
  };

  const barData = Object.entries(intensityRanges).map(([range, count]) => ({
    range,
    count,
  }));

  const scatterData = data
    .filter(d => d.intensity > 0 && d.relevance > 0)
    .map((d, index) => ({
      intensity: d.intensity,
      relevance: d.relevance,
      likelihood: d.likelihood,
      sector: d.sector,
      id: index,
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Intensity Distribution</CardTitle>
          <CardDescription>
            Data entries grouped by intensity levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle>Intensity vs Relevance</CardTitle>
          <CardDescription>
            Scatter plot showing relationship between intensity and relevance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="intensity" name="Intensity" />
              <YAxis dataKey="relevance" name="Relevance" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded shadow">
                        <p className="font-medium">{data.sector}</p>
                        <p>Intensity: {data.intensity}</p>
                        <p>Relevance: {data.relevance}</p>
                        <p>Likelihood: {data.likelihood}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter dataKey="relevance" fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
