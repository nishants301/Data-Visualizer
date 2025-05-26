
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import type { DataEntry } from "@/pages/Index";

interface TimelineChartProps {
  data: DataEntry[];
}

export const TimelineChart = ({ data }: TimelineChartProps) => {
  // Process data by publication date
  const timelineData = data
    .filter(d => d.published)
    .map(d => {
      const date = new Date(d.published);
      return {
        ...d,
        year: date.getFullYear(),
        month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      };
    })
    .reduce((acc, item) => {
      const key = item.month;
      if (!acc[key]) {
        acc[key] = {
          month: key,
          count: 0,
          totalIntensity: 0,
          avgIntensity: 0,
        };
      }
      acc[key].count += 1;
      acc[key].totalIntensity += item.intensity || 0;
      acc[key].avgIntensity = Number((acc[key].totalIntensity / acc[key].count).toFixed(1));
      return acc;
    }, {} as Record<string, any>);

  const chartData = Object.values(timelineData)
    .sort((a: any, b: any) => a.month.localeCompare(b.month))
    .slice(-12); // Last 12 months

  // Process data by year for yearly trends
  const yearlyData = data
    .filter(d => d.published)
    .map(d => {
      const date = new Date(d.published);
      return {
        ...d,
        year: date.getFullYear(),
      };
    })
    .reduce((acc, item) => {
      const year = item.year;
      if (!acc[year]) {
        acc[year] = {
          year,
          count: 0,
          totalIntensity: 0,
          avgIntensity: 0,
        };
      }
      acc[year].count += 1;
      acc[year].totalIntensity += item.intensity || 0;
      acc[year].avgIntensity = Number((acc[year].totalIntensity / acc[year].count).toFixed(1));
      return acc;
    }, {} as Record<number, any>);

  const yearlyChartData = Object.values(yearlyData)
    .sort((a: any, b: any) => a.year - b.year);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Monthly Publication Trend</CardTitle>
          <CardDescription>
            Number of publications over the last 12 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle>Yearly Intensity Trend</CardTitle>
          <CardDescription>
            Average intensity by publication year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yearlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="avgIntensity" 
                stroke="#82ca9d" 
                strokeWidth={3}
                dot={{ fill: '#82ca9d', strokeWidth: 2, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
