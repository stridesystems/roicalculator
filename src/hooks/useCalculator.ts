import { useState, useMemo, useCallback } from 'react';
import type { ScenarioConfig } from '../models/types';
import { presets } from '../models/presets';
import { calculateScenario } from '../engine/calculator';

export interface CalculatorState {
  presetId: string;
  programCost: number;
  revenuePerClient: number;
  attritionRate: number;
  timeframeMonths: number;
  growthType: 'linear' | 'exponential' | 'stepped';
  baseNewClients: number;
  monthlyGrowthRate: number;
  showComparison: boolean;
}

export function useCalculator() {
  const defaultPreset = presets.coaching;
  const [state, setState] = useState<CalculatorState>({
    presetId: 'coaching',
    programCost: defaultPreset.defaults.programCost.value,
    revenuePerClient: defaultPreset.defaults.revenuePerClient.value,
    attritionRate: defaultPreset.defaults.attritionRate,
    timeframeMonths: defaultPreset.defaults.timeframeMonths,
    growthType: defaultPreset.defaults.growthModel.type,
    baseNewClients: defaultPreset.defaults.growthModel.baseNewClients,
    monthlyGrowthRate: defaultPreset.defaults.growthModel.monthlyGrowthRate,
    showComparison: true,
  });

  const currentPreset = presets[state.presetId] ?? defaultPreset;

  const setPreset = useCallback((presetId: string) => {
    const preset = presets[presetId];
    if (!preset) return;
    setState({
      presetId,
      programCost: preset.defaults.programCost.value,
      revenuePerClient: preset.defaults.revenuePerClient.value,
      attritionRate: preset.defaults.attritionRate,
      timeframeMonths: preset.defaults.timeframeMonths,
      growthType: preset.defaults.growthModel.type,
      baseNewClients: preset.defaults.growthModel.baseNewClients,
      monthlyGrowthRate: preset.defaults.growthModel.monthlyGrowthRate,
      showComparison: true,
    });
  }, []);

  const update = useCallback((partial: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...partial }));
  }, []);

  const results = useMemo(() => {
    const baseConfig: Omit<ScenarioConfig, 'name' | 'color' | 'clientAcquisitionFactor' | 'revenueFactor'> = {
      programCost: state.programCost,
      revenuePerClient: state.revenuePerClient,
      growthModel: {
        type: state.growthType,
        baseNewClients: state.baseNewClients,
        monthlyGrowthRate: state.monthlyGrowthRate,
      },
      attritionRate: state.attritionRate,
      timeframeMonths: state.timeframeMonths,
    };

    const optimisticConfig: ScenarioConfig = {
      ...baseConfig,
      name: currentPreset.scenarios.optimistic.name ?? 'Optimistic',
      color: currentPreset.scenarios.optimistic.color ?? '#3B82F6',
      clientAcquisitionFactor: currentPreset.scenarios.optimistic.clientAcquisitionFactor ?? 1.0,
      revenueFactor: currentPreset.scenarios.optimistic.revenueFactor ?? 1.0,
      revenueBoost: currentPreset.scenarios.optimistic.revenueBoost,
      monthlyRevenueCap: currentPreset.scenarios.optimistic.monthlyRevenueCap,
      dashed: currentPreset.scenarios.optimistic.dashed,
    };

    const conservativeConfig: ScenarioConfig = {
      ...baseConfig,
      name: currentPreset.scenarios.conservative.name ?? 'Conservative',
      color: currentPreset.scenarios.conservative.color ?? '#6B7280',
      clientAcquisitionFactor: currentPreset.scenarios.conservative.clientAcquisitionFactor ?? 0.7,
      revenueFactor: currentPreset.scenarios.conservative.revenueFactor ?? 0.8,
      revenueBoost: currentPreset.scenarios.conservative.revenueBoost,
      monthlyRevenueCap: currentPreset.scenarios.conservative.monthlyRevenueCap,
      dashed: currentPreset.scenarios.conservative.dashed,
    };

    const optimistic = calculateScenario(optimisticConfig);
    const conservative = calculateScenario(conservativeConfig);
    return { optimistic, conservative };
  }, [state, currentPreset]);

  return {
    state,
    currentPreset,
    results,
    setPreset,
    update,
  };
}

export type UseCalculatorReturn = ReturnType<typeof useCalculator>;
