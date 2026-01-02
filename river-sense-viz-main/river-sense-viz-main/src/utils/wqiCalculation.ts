import { WaterQualityData } from "@/components/WaterQualityForm";

// Simplified WQI calculation based on common water quality parameters
// This is a mock implementation - in real world, you'd use your trained ML model

interface QualityResult {
  wqi: number;
  quality: string;
}

const getParameterWeight = (parameter: string): number => {
  const weights: Record<string, number> = {
    dissolvedOxygen: 0.25,
    ph: 0.15,
    bod: 0.20,
    conductivity: 0.10,
    nitrate: 0.15,
    totalColiform: 0.10,
    temperature: 0.05
  };
  return weights[parameter] || 0;
};

const normalizeParameter = (value: number, parameter: string): number => {
  // Normalize parameters to 0-100 scale where 100 is best quality
  switch (parameter) {
    case 'dissolvedOxygen':
      // Optimal DO is 8-10 mg/L
      if (value >= 8 && value <= 10) return 100;
      if (value >= 6 && value < 8) return 80;
      if (value >= 4 && value < 6) return 60;
      if (value >= 2 && value < 4) return 40;
      return 20;
    
    case 'ph':
      // Optimal pH is 6.5-8.5
      if (value >= 6.5 && value <= 8.5) return 100;
      if (value >= 6.0 && value < 6.5) return 80;
      if (value > 8.5 && value <= 9.0) return 80;
      if (value >= 5.5 && value < 6.0) return 60;
      if (value > 9.0 && value <= 9.5) return 60;
      return 40;
    
    case 'bod':
      // Lower BOD is better
      if (value <= 2) return 100;
      if (value <= 4) return 80;
      if (value <= 6) return 60;
      if (value <= 8) return 40;
      return 20;
    
    case 'conductivity':
      // Lower conductivity is generally better for drinking water
      if (value <= 500) return 100;
      if (value <= 1000) return 80;
      if (value <= 1500) return 60;
      if (value <= 2000) return 40;
      return 20;
    
    case 'nitrate':
      // Lower nitrate is better
      if (value <= 1) return 100;
      if (value <= 5) return 80;
      if (value <= 10) return 60;
      if (value <= 20) return 40;
      return 20;
    
    case 'totalColiform':
      // Lower coliform count is better
      if (value <= 10) return 100;
      if (value <= 50) return 80;
      if (value <= 100) return 60;
      if (value <= 500) return 40;
      return 20;
    
    case 'temperature':
      // Temperature between 15-25°C is ideal
      if (value >= 15 && value <= 25) return 100;
      if (value >= 10 && value < 15) return 80;
      if (value > 25 && value <= 30) return 80;
      if (value >= 5 && value < 10) return 60;
      if (value > 30 && value <= 35) return 60;
      return 40;
    
    default:
      return 50;
  }
};

const getQualityClass = (wqi: number): string => {
  if (wqi >= 91) return 'Excellent';
  if (wqi >= 71) return 'Good';
  if (wqi >= 51) return 'Medium';
  if (wqi >= 26) return 'Bad';
  return 'Very Bad';
};

export const calculateWQI = (data: WaterQualityData): QualityResult => {
  // Calculate weighted scores for each parameter
  const parameters = [
    { name: 'dissolvedOxygen', value: data.dissolvedOxygen },
    { name: 'ph', value: data.ph },
    { name: 'bod', value: data.bod },
    { name: 'conductivity', value: data.conductivity },
    { name: 'nitrate', value: data.nitrate },
    { name: 'totalColiform', value: data.totalColiform },
    { name: 'temperature', value: data.temperature }
  ];

  let totalWeightedScore = 0;
  let totalWeight = 0;

  parameters.forEach(param => {
    const normalizedScore = normalizeParameter(param.value, param.name);
    const weight = getParameterWeight(param.name);
    totalWeightedScore += normalizedScore * weight;
    totalWeight += weight;
  });

  // Calculate final WQI
  const wqi = totalWeightedScore / totalWeight;
  
  // Add some randomness to simulate ML model variability
  const variance = (Math.random() - 0.5) * 10; // ±5 points variance
  const finalWQI = Math.max(0, Math.min(100, wqi + variance));
  
  const quality = getQualityClass(finalWQI);

  return {
    wqi: finalWQI,
    quality
  };
};

// Simulate async ML model prediction
export const predictWaterQuality = async (data: WaterQualityData): Promise<QualityResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return calculateWQI(data);
};