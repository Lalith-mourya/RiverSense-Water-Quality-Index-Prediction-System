import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Droplets, Thermometer, Beaker, TestTube, FlaskConical, Waves, Calendar, MapPin } from "lucide-react";

const STATES = [
  'DAMAN & DIU', 'GOA', 'MAHARASHTRA', 'KERALA', 'ANDHRA PRADESH', 'KARNATAKA',
  'ODISHA', 'PONDICHERRY', 'TAMILNADU', 'PUNJAB', 'HARYANA', 'RAJASTHAN',
  'HIMACHAL PRADESH', 'MEGHALAYA', 'MIZORAM', 'TRIPURA', 'NAN', 'TAMIL NADU', 'ORISSA'
];

export interface WaterQualityData {
  temperature: number;
  dissolvedOxygen: number;
  ph: number;
  conductivity: number;
  bod: number;
  nitrate: number;
  totalColiform: number;
  year: number;
  state: string;
}

interface WaterQualityFormProps {
  onSubmit: (data: WaterQualityData) => void;
  loading?: boolean;
}

export const WaterQualityForm = ({ onSubmit, loading }: WaterQualityFormProps) => {
  const [formData, setFormData] = useState<WaterQualityData>({
    temperature: 25,
    dissolvedOxygen: 8,
    ph: 7,
    conductivity: 500,
    bod: 3,
    nitrate: 1,
    totalColiform: 100,
    year: 2024,
    state: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof WaterQualityData) => (value: string | number) => {
    console.log(`Field ${field} changed to:`, value);
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: field === 'state' ? value : (typeof value === 'string' ? parseFloat(value) || 0 : value)
      };
      console.log('Updated form data:', newData);
      return newData;
    });
  };

  return (
    <Card className="w-full max-w-2xl bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
          <Droplets className="h-6 w-6" />
          Water Quality Parameters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Temperature */}
            <div className="space-y-2">
              <Label htmlFor="temperature" className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-primary" />
                Temperature (°C)
              </Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => handleInputChange('temperature')(e.target.value)}
                className="bg-background/80"
                required
              />
            </div>

            {/* Dissolved Oxygen */}
            <div className="space-y-2">
              <Label htmlFor="dissolvedOxygen" className="flex items-center gap-2">
                <Waves className="h-4 w-4 text-primary" />
                Dissolved Oxygen (mg/L)
              </Label>
              <Input
                id="dissolvedOxygen"
                type="number"
                step="0.1"
                value={formData.dissolvedOxygen}
                onChange={(e) => handleInputChange('dissolvedOxygen')(e.target.value)}
                className="bg-background/80"
                required
              />
            </div>

            {/* pH */}
            <div className="space-y-2">
              <Label htmlFor="ph" className="flex items-center gap-2">
                <TestTube className="h-4 w-4 text-primary" />
                pH Level
              </Label>
              <Input
                id="ph"
                type="number"
                step="0.1"
                min="0"
                max="14"
                value={formData.ph}
                onChange={(e) => handleInputChange('ph')(e.target.value)}
                className="bg-background/80"
                required
              />
            </div>

            {/* Conductivity */}
            <div className="space-y-2">
              <Label htmlFor="conductivity" className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-primary" />
                Conductivity (μmhos/cm)
              </Label>
              <Input
                id="conductivity"
                type="number"
                step="0.1"
                value={formData.conductivity}
                onChange={(e) => handleInputChange('conductivity')(e.target.value)}
                className="bg-background/80"
                required
              />
            </div>

            {/* BOD */}
            <div className="space-y-2">
              <Label htmlFor="bod" className="flex items-center gap-2">
                <Beaker className="h-4 w-4 text-primary" />
                BOD (mg/L)
              </Label>
              <Input
                id="bod"
                type="number"
                step="0.1"
                value={formData.bod}
                onChange={(e) => handleInputChange('bod')(e.target.value)}
                className="bg-background/80"
                required
              />
            </div>

            {/* Nitrate */}
            <div className="space-y-2">
              <Label htmlFor="nitrate" className="flex items-center gap-2">
                <TestTube className="h-4 w-4 text-primary" />
                Nitrate (mg/L)
              </Label>
              <Input
                id="nitrate"
                type="number"
                step="0.1"
                value={formData.nitrate}
                onChange={(e) => handleInputChange('nitrate')(e.target.value)}
                className="bg-background/80"
                required
              />
            </div>

            {/* Total Coliform */}
            <div className="space-y-2">
              <Label htmlFor="totalColiform" className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-primary" />
                Total Coliform (MPN/100ml)
              </Label>
              <Input
                id="totalColiform"
                type="number"
                step="1"
                value={formData.totalColiform}
                onChange={(e) => handleInputChange('totalColiform')(e.target.value)}
                className="bg-background/80"
                required
              />
            </div>

            {/* Year */}
            <div className="space-y-2">
              <Label htmlFor="year" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Year
              </Label>
              <Input
                id="year"
                type="number"
                min="2000"
                max="2030"
                value={formData.year}
                onChange={(e) => handleInputChange('year')(e.target.value)}
                className="bg-background/80"
                required
              />
            </div>
          </div>

          {/* State Selection */}
          <div className="space-y-2">
            <Label htmlFor="state" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              State
            </Label>
            <Select 
              value={formData.state} 
              onValueChange={(value) => handleInputChange('state')(value)}
            >
              <SelectTrigger className="bg-background/80">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-semibold transition-all duration-300 hover:scale-[1.02]"
            disabled={loading || !formData.state}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Analyzing Water Quality...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Analyze Water Quality
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};