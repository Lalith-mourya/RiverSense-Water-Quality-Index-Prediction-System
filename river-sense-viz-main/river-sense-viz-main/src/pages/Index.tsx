import { useState } from "react";
import { WaterQualityForm, WaterQualityData } from "@/components/WaterQualityForm";
import { WaterVisualization } from "@/components/WaterVisualization";
import { ParameterAnalysis } from "@/components/ParameterAnalysis";
import { WQIResult } from "@/components/WQIResult";
import { predictWaterQuality } from "@/utils/wqiCalculation";
import { useToast } from "@/hooks/use-toast";
import { Droplets, Activity, BarChart3 } from "lucide-react";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ wqi: number; quality: string; data: WaterQualityData } | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = async (data: WaterQualityData) => {
    console.log('handleFormSubmit called with:', data);
    setLoading(true);
    try {
      const prediction = await predictWaterQuality(data);
      console.log('Prediction result:', prediction);
      setResult({
        wqi: prediction.wqi,
        quality: prediction.quality,
        data
      });
      
      toast({
        title: "Analysis Complete",
        description: `Water Quality Index: ${prediction.wqi.toFixed(1)} (${prediction.quality})`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze water quality. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Droplets className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Water Quality Index
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
            Advanced water quality analysis and prediction system
          </p>
          <div className="mt-8 flex justify-center space-x-8 text-blue-100">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Parameter Visualization</span>
            </div>
          </div>
        </div>
        
        {/* Animated water waves */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            className="relative w-full h-16"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shapeRendering="auto"
          >
            <defs>
              <path
                id="gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className="parallax">
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="0"
                fill="rgba(255,255,255,0.7)"
                className="wave-animation"
              />
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="3"
                fill="rgba(255,255,255,0.5)"
                className="wave-animation"
                style={{ animationDelay: '-1s' }}
              />
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="5"
                fill="rgba(255,255,255,0.3)"
                className="wave-animation"
                style={{ animationDelay: '-2s' }}
              />
            </g>
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <WaterQualityForm onSubmit={handleFormSubmit} loading={loading} />
            
            {result && (
              <WQIResult wqi={result.wqi} quality={result.quality} />
            )}
          </div>

          {/* Right Column - Visualization */}
          <div className="space-y-6">
            {result ? (
              <>
                <WaterVisualization wqi={result.wqi} quality={result.quality} />
                <ParameterAnalysis data={result.data} wqi={result.wqi} />
              </>
            ) : (
              <div className="h-96 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center border border-blue-200">
                <div className="text-center text-blue-600">
                  <Droplets className="h-16 w-16 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-semibold mb-2">
                    Ready for Analysis
                  </h3>
                  <p className="text-blue-500">
                    Fill out the water quality parameters to begin analysis
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center text-muted-foreground">
          <p className="text-sm">
            Water Quality Index (WQI) is calculated based on multiple parameters including
            temperature, dissolved oxygen, pH, conductivity, BOD, nitrate, and coliform levels.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
