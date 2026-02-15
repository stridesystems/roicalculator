export interface GrowthModel {
  type: 'linear' | 'exponential' | 'stepped';
  baseNewClients: number;
  monthlyGrowthRate: number;
}

export interface ScenarioConfig {
  name: string;
  color: string;
  programCost: number;
  revenuePerClient: number;
  growthModel: GrowthModel;
  attritionRate: number;
  timeframeMonths: number;
  clientAcquisitionFactor: number;
  revenueFactor: number;
  revenueBoost?: { months: number; multiplier: number };
  monthlyRevenueCap?: number;
  dashed?: boolean;
}

export interface MonthlySnapshot {
  month: number;
  newClients: number;
  totalClients: number;
  monthlyRevenue: number;
  cumulativeRevenue: number;
  roi: number;
  isRoiPositive: boolean;
}

export interface CalculationResult {
  config: ScenarioConfig;
  snapshots: MonthlySnapshot[];
  roiMonth: number | null;
  totalRevenue: number;
  finalClients: number;
  finalRoi: number;
}

export interface BusinessModelPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaults: {
    programCost: { value: number; min: number; max: number; step: number };
    revenuePerClient: { value: number; min: number; max: number; step: number };
    attritionRate: number;
    growthModel: GrowthModel;
    timeframeMonths: number;
  };
  scenarios: {
    optimistic: Partial<ScenarioConfig>;
    conservative: Partial<ScenarioConfig>;
  };
}

export type ThemeMode = 'light' | 'dark' | 'magos';
