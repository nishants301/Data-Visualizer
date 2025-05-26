
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DataEntry } from "@/pages/Index";

interface FilterPanelProps {
  data: DataEntry[];
  onFilterChange: (filters: any) => void;
}

export const FilterPanel = ({ data, onFilterChange }: FilterPanelProps) => {
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [intensityRange, setIntensityRange] = useState<[number, number]>([0, 10]);

  const sectors = Array.from(new Set(data.map(d => d.sector).filter(Boolean))).sort();
  const regions = Array.from(new Set(data.map(d => d.region).filter(Boolean))).sort();
  const countries = Array.from(new Set(data.map(d => d.country).filter(Boolean))).sort();
  
  const maxIntensity = Math.max(...data.map(d => d.intensity || 0));

  useEffect(() => {
    setIntensityRange([0, maxIntensity]);
  }, [maxIntensity]);

  useEffect(() => {
    onFilterChange({
      sector: selectedSectors,
      region: selectedRegions,
      country: selectedCountries,
      intensityRange: intensityRange,
    });
  }, [selectedSectors, selectedRegions, selectedCountries, intensityRange, onFilterChange]);

  const handleSectorChange = (sector: string, checked: boolean) => {
    if (checked) {
      setSelectedSectors([...selectedSectors, sector]);
    } else {
      setSelectedSectors(selectedSectors.filter(s => s !== sector));
    }
  };

  const handleRegionChange = (region: string, checked: boolean) => {
    if (checked) {
      setSelectedRegions([...selectedRegions, region]);
    } else {
      setSelectedRegions(selectedRegions.filter(r => r !== region));
    }
  };

  const handleCountryChange = (country: string, checked: boolean) => {
    if (checked) {
      setSelectedCountries([...selectedCountries, country]);
    } else {
      setSelectedCountries(selectedCountries.filter(c => c !== country));
    }
  };

  const clearFilters = () => {
    setSelectedSectors([]);
    setSelectedRegions([]);
    setSelectedCountries([]);
    setIntensityRange([0, maxIntensity]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Sectors */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Sectors</Label>
        <ScrollArea className="h-40 border rounded-md p-3">
          <div className="space-y-2">
            {sectors.map((sector) => (
              <div key={sector} className="flex items-center space-x-2">
                <Checkbox
                  id={`sector-${sector}`}
                  checked={selectedSectors.includes(sector)}
                  onCheckedChange={(checked) => handleSectorChange(sector, checked as boolean)}
                />
                <Label htmlFor={`sector-${sector}`} className="text-sm font-normal">
                  {sector}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Regions */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Regions</Label>
        <ScrollArea className="h-40 border rounded-md p-3">
          <div className="space-y-2">
            {regions.map((region) => (
              <div key={region} className="flex items-center space-x-2">
                <Checkbox
                  id={`region-${region}`}
                  checked={selectedRegions.includes(region)}
                  onCheckedChange={(checked) => handleRegionChange(region, checked as boolean)}
                />
                <Label htmlFor={`region-${region}`} className="text-sm font-normal">
                  {region}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Countries */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Countries</Label>
        <ScrollArea className="h-40 border rounded-md p-3">
          <div className="space-y-2">
            {countries.slice(0, 20).map((country) => (
              <div key={country} className="flex items-center space-x-2">
                <Checkbox
                  id={`country-${country}`}
                  checked={selectedCountries.includes(country)}
                  onCheckedChange={(checked) => handleCountryChange(country, checked as boolean)}
                />
                <Label htmlFor={`country-${country}`} className="text-sm font-normal">
                  {country}
                </Label>
              </div>
            ))}
            {countries.length > 20 && (
              <p className="text-xs text-gray-500">And {countries.length - 20} more...</p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Intensity Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Intensity Range: {intensityRange[0]} - {intensityRange[1]}
        </Label>
        <div className="pt-6">
          <Slider
            value={intensityRange}
            onValueChange={setIntensityRange}
            max={maxIntensity}
            min={0}
            step={1}
            className="w-full"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearFilters}
          className="w-full mt-4"
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};
