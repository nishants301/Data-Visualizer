
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { DataEntry } from "@/pages/Index";

interface RegionChartProps {
  data: DataEntry[];
}

export const RegionChart = ({ data }: RegionChartProps) => {
  const regionData = data.reduce((acc, item) => {
    if (item.region) {
      acc[item.region] = (acc[item.region] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(regionData)
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count);

  const avgIntensityByRegion = data.reduce((acc, item) => {
    if (item.region && item.intensity) {
      if (!acc[item.region]) {
        acc[item.region] = { total: 0, count: 0 };
      }
      acc[item.region].total += item.intensity;
      acc[item.region].count += 1;
    }
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const intensityData = Object.entries(avgIntensityByRegion)
    .map(([region, data]) => ({
      region,
      avgIntensity: Number((data.total / data.count).toFixed(1)),
    }))
    .sort((a, b) => b.avgIntensity - a.avgIntensity);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Data Entries by Region</CardTitle>
          <CardDescription>
            Number of entries for each region
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="region" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ffc658" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle>Average Intensity by Region</CardTitle>
          <CardDescription>
            Average intensity score for each region
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={intensityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="region" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgIntensity" fill="#ff7c7c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
