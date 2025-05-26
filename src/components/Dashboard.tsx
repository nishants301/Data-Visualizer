
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Download, Filter } from "lucide-react";
import { MetricsOverview } from "@/components/MetricsOverview";
import { SectorChart } from "@/components/charts/SectorChart";
import { IntensityChart } from "@/components/charts/IntensityChart";
import { RegionChart } from "@/components/charts/RegionChart";
import { TimelineChart } from "@/components/charts/TimelineChart";
import { FilterPanel } from "@/components/FilterPanel";
import type { DataEntry } from "@/pages/Index";

interface DashboardProps {
  data: DataEntry[];
  fileName: string;
  onReset: () => void;
}

export const Dashboard = ({ data, fileName, onReset }: DashboardProps) => {
  const [filteredData, setFilteredData] = useState<DataEntry[]>(data);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (filters: any) => {
    let filtered = [...data];

    if (filters.sector && filters.sector.length > 0) {
      filtered = filtered.filter(item => filters.sector.includes(item.sector));
    }

    if (filters.region && filters.region.length > 0) {
      filtered = filtered.filter(item => filters.region.includes(item.region));
    }

    if (filters.country && filters.country.length > 0) {
      filtered = filtered.filter(item => filters.country.includes(item.country));
    }

    if (filters.intensityRange) {
      filtered = filtered.filter(item => 
        item.intensity >= filters.intensityRange[0] && 
        item.intensity <= filters.intensityRange[1]
      );
    }

    setFilteredData(filtered);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(filteredData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `filtered_${fileName}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Insights</h1>
          <p className="text-gray-600">
            Analyzing {filteredData.length} of {data.length} entries from {fileName}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button
            variant="outline"
            onClick={exportData}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={onReset}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            New File
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Data Filters</CardTitle>
            <CardDescription>
              Filter your data to focus on specific insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FilterPanel data={data} onFilterChange={handleFilterChange} />
          </CardContent>
        </Card>
      )}

      {/* Metrics Overview */}
      <MetricsOverview data={filteredData} />

      {/* Charts */}
      <Tabs defaultValue="sectors" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sectors">Sectors</TabsTrigger>
          <TabsTrigger value="intensity">Intensity</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sectors" className="space-y-6">
          <SectorChart data={filteredData} />
        </TabsContent>
        
        <TabsContent value="intensity" className="space-y-6">
          <IntensityChart data={filteredData} />
        </TabsContent>
        
        <TabsContent value="regions" className="space-y-6">
          <RegionChart data={filteredData} />
        </TabsContent>
        
        <TabsContent value="timeline" className="space-y-6">
          <TimelineChart data={filteredData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
