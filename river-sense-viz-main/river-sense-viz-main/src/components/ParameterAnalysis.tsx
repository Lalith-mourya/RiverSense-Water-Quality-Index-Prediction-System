import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WaterQualityData } from './WaterQualityForm';

interface ParameterAnalysisProps {
  data: WaterQualityData;
  wqi: number;
}

const normalizeParameter = (value: number, parameter: string): number => {
  // Normalize parameters to 0-100 scale for radar chart
  switch (parameter) {
    case 'Temperature':
      return Math.min(Math.max((value / 40) * 100, 0), 100);
    case 'Dissolved Oxygen':
      return Math.min(Math.max((value / 15) * 100, 0), 100);
    case 'pH Level':
      return Math.min(Math.max(((value - 6.5) / 2) * 100, 0), 100);
    case 'Conductivity':
      return Math.min(Math.max((value / 2000) * 100, 0), 100);
    case 'BOD':
      return Math.min(Math.max((10 - value) / 10 * 100, 0), 100);
    case 'Nitrate+Nitrite':
      return Math.min(Math.max((10 - value) / 10 * 100, 0), 100);
    case 'Total Coliform':
      return Math.min(Math.max((1000 - value) / 1000 * 100, 0), 100);
    case 'Fecal Coliform':
      return Math.min(Math.max((500 - value) / 500 * 100, 0), 100);
    default:
      return 50;
  }
};

export const ParameterAnalysis = ({ data, wqi }: ParameterAnalysisProps) => {
  const radarData = [
    {
      parameter: 'Temperature',
      value: normalizeParameter(data.temperature, 'Temperature'),
      fullMark: 100,
    },
    {
      parameter: 'Dissolved Oxygen',
      value: normalizeParameter(data.dissolvedOxygen, 'Dissolved Oxygen'),
      fullMark: 100,
    },
    {
      parameter: 'pH Level',
      value: normalizeParameter(data.ph, 'pH Level'),
      fullMark: 100,
    },
    {
      parameter: 'Conductivity',
      value: normalizeParameter(data.conductivity, 'Conductivity'),
      fullMark: 100,
    },
    {
      parameter: 'BOD',
      value: normalizeParameter(data.bod, 'BOD'),
      fullMark: 100,
    },
    {
      parameter: 'Nitrate+Nitrite',
      value: normalizeParameter(data.nitrate, 'Nitrate+Nitrite'),
      fullMark: 100,
    },
    {
      parameter: 'Total Coliform',
      value: normalizeParameter(data.totalColiform, 'Total Coliform'),
      fullMark: 100,
    },
    {
      parameter: 'Fecal Coliform',
      value: normalizeParameter(data.totalColiform * 0.7, 'Fecal Coliform'), // Estimate
      fullMark: 100,
    },
  ];

  const getQualityColor = (wqi: number): string => {
    if (wqi >= 91) return '#16a34a';
    if (wqi >= 71) return '#eab308';
    if (wqi >= 51) return '#f97316';
    if (wqi >= 26) return '#dc2626';
    return '#991b1b';
  };

  return (
    <Card className="w-full bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-primary">
          Parameter Analysis
        </CardTitle>
        <p className="text-muted-foreground">
          Water quality parameters visualization
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid 
                stroke="hsl(var(--border))" 
                strokeWidth={1}
                opacity={0.6}
              />
              <PolarAngleAxis 
                dataKey="parameter" 
                tick={{ 
                  fontSize: 12, 
                  fill: "hsl(var(--foreground))",
                  fontWeight: "500"
                }}
                className="text-xs"
              />
              <PolarRadiusAxis 
                domain={[0, 100]} 
                angle={90} 
                tick={{ 
                  fontSize: 10, 
                  fill: "hsl(var(--muted-foreground))" 
                }}
                tickCount={6}
              />
              <Radar
                name="Parameters"
                dataKey="value"
                stroke={getQualityColor(wqi)}
                fill={getQualityColor(wqi)}
                fillOpacity={0.3}
                strokeWidth={2}
                dot={{ 
                  fill: getQualityColor(wqi), 
                  strokeWidth: 2, 
                  r: 4,
                  fillOpacity: 1
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Parameter Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-3 bg-background/60 rounded-lg">
            <div className="text-sm text-muted-foreground">Temperature</div>
            <div className="font-semibold text-primary">{data.temperature}°C</div>
          </div>
          <div className="text-center p-3 bg-background/60 rounded-lg">
            <div className="text-sm text-muted-foreground">DO</div>
            <div className="font-semibold text-primary">{data.dissolvedOxygen} mg/L</div>
          </div>
          <div className="text-center p-3 bg-background/60 rounded-lg">
            <div className="text-sm text-muted-foreground">pH</div>
            <div className="font-semibold text-primary">{data.ph}</div>
          </div>
          <div className="text-center p-3 bg-background/60 rounded-lg">
            <div className="text-sm text-muted-foreground">Conductivity</div>
            <div className="font-semibold text-primary">{data.conductivity} μS/cm</div>
          </div>
          <div className="text-center p-3 bg-background/60 rounded-lg">
            <div className="text-sm text-muted-foreground">BOD</div>
            <div className="font-semibold text-primary">{data.bod} mg/L</div>
          </div>
          <div className="text-center p-3 bg-background/60 rounded-lg">
            <div className="text-sm text-muted-foreground">Nitrate</div>
            <div className="font-semibold text-primary">{data.nitrate} mg/L</div>
          </div>
          <div className="text-center p-3 bg-background/60 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Coliform</div>
            <div className="font-semibold text-primary">{data.totalColiform} MPN</div>
          </div>
          <div className="text-center p-3 bg-background/60 rounded-lg">
            <div className="text-sm text-muted-foreground">State</div>
            <div className="font-semibold text-primary text-xs">{data.state}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};