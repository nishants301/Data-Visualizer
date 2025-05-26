
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Globe, Building, Zap } from "lucide-react";
import type { DataEntry } from "@/pages/Index";

interface MetricsOverviewProps {
  data: DataEntry[];
}

export const MetricsOverview = ({ data }: MetricsOverviewProps) => {
  const totalEntries = data.length;
  const uniqueSectors = new Set(data.map(d => d.sector).filter(Boolean)).size;
  const uniqueRegions = new Set(data.map(d => d.region).filter(Boolean)).size;
  const avgIntensity = data.length > 0 
    ? (data.reduce((sum, d) => sum + (d.intensity || 0), 0) / data.length).toFixed(1)
    : 0;

  const metrics = [
    {
      title: "Total Entries",
      value: totalEntries.toLocaleString(),
      icon: TrendingUp,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Unique Sectors",
      value: uniqueSectors.toString(),
      icon: Building,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Regions Covered",
      value: uniqueRegions.toString(),
      icon: Globe,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Avg Intensity",
      value: avgIntensity.toString(),
      icon: Zap,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={metric.title} className="hover:shadow-lg transition-shadow duration-200 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {metric.title}
            </CardTitle>
            <div className={`flex items-center justify-center w-8 h-8 bg-gradient-to-r ${metric.color} rounded-lg`}>
              <metric.icon className="w-4 h-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
