import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface WQIResultProps {
  wqi: number;
  quality: string;
}

const getQualityConfig = (quality: string) => {
  switch (quality.toLowerCase()) {
    case 'excellent':
      return {
        color: 'bg-green-500',
        textColor: 'text-green-600',
        bgColor: 'bg-green-50',
        icon: TrendingUp,
        description: 'Water quality is excellent and safe for all uses.',
        gradient: 'from-green-400 to-green-600'
      };
    case 'good':
      return {
        color: 'bg-yellow-500',
        textColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        icon: TrendingUp,
        description: 'Water quality is good and suitable for most uses.',
        gradient: 'from-yellow-400 to-yellow-600'
      };
    case 'medium':
      return {
        color: 'bg-orange-500',
        textColor: 'text-orange-600',
        bgColor: 'bg-orange-50',
        icon: Minus,
        description: 'Water quality is moderate. Treatment may be required.',
        gradient: 'from-orange-400 to-orange-600'
      };
    case 'bad':
      return {
        color: 'bg-red-500',
        textColor: 'text-red-600',
        bgColor: 'bg-red-50',
        icon: TrendingDown,
        description: 'Water quality is poor. Treatment is recommended.',
        gradient: 'from-red-400 to-red-600'
      };
    case 'very bad':
      return {
        color: 'bg-red-800',
        textColor: 'text-red-800',
        bgColor: 'bg-red-100',
        icon: TrendingDown,
        description: 'Water quality is very poor. Immediate treatment required.',
        gradient: 'from-red-600 to-red-800'
      };
    default:
      return {
        color: 'bg-gray-500',
        textColor: 'text-gray-600',
        bgColor: 'bg-gray-50',
        icon: Minus,
        description: 'Water quality assessment unavailable.',
        gradient: 'from-gray-400 to-gray-600'
      };
  }
};

export const WQIResult = ({ wqi, quality }: WQIResultProps) => {
  const config = getQualityConfig(quality);
  const IconComponent = config.icon;

  return (
    <Card className="w-full bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          {/* WQI Score Display */}
          <div className="relative">
            <div className={`mx-auto w-32 h-32 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-2xl`}>
              <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">
                  {Math.round(wqi)}
                </span>
              </div>
            </div>
            <div className="absolute -top-2 -right-2">
              <div className={`${config.color} rounded-full p-2 shadow-lg`}>
                <Droplets className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          {/* Quality Badge */}
          <div className="flex justify-center">
            <Badge 
              variant="secondary" 
              className={`px-4 py-2 text-lg font-semibold ${config.textColor} ${config.bgColor} border-0`}
            >
              <IconComponent className="h-5 w-5 mr-2" />
              {quality}
            </Badge>
          </div>

          {/* WQI Label */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-1">
              Water Quality Index
            </h3>
            <p className="text-2xl font-bold text-primary">
              {wqi.toFixed(1)} / 100
            </p>
          </div>

          {/* Description */}
          <div className={`p-4 rounded-xl ${config.bgColor} border border-current/10`}>
            <p className={`text-sm ${config.textColor} font-medium`}>
              {config.description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${config.gradient} transition-all duration-1000 ease-out`}
              style={{ width: `${Math.min(wqi, 100)}%` }}
            />
          </div>

          {/* Range Indicators */}
          <div className="grid grid-cols-5 gap-1 text-xs text-muted-foreground">
            <div className="text-center">
              <div className="w-full h-2 bg-red-800 rounded mb-1"></div>
              <span>0-25</span>
            </div>
            <div className="text-center">
              <div className="w-full h-2 bg-red-500 rounded mb-1"></div>
              <span>26-50</span>
            </div>
            <div className="text-center">
              <div className="w-full h-2 bg-orange-500 rounded mb-1"></div>
              <span>51-70</span>
            </div>
            <div className="text-center">
              <div className="w-full h-2 bg-yellow-500 rounded mb-1"></div>
              <span>71-90</span>
            </div>
            <div className="text-center">
              <div className="w-full h-2 bg-green-500 rounded mb-1"></div>
              <span>91-100</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};