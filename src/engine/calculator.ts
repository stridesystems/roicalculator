import type { ScenarioConfig, MonthlySnapshot, CalculationResult } from '../models/types';

function getNewClients(config: ScenarioConfig, month: number): number {
  const { growthModel } = config;
  switch (growthModel.type) {
    case 'linear':
      return growthModel.baseNewClients + (month - 1) * growthModel.monthlyGrowthRate;
    case 'exponential':
      return growthModel.baseNewClients * Math.pow(1 + growthModel.monthlyGrowthRate, month - 1);
    case 'stepped':
      return growthModel.baseNewClients + Math.floor((month - 1) / 3) * growthModel.monthlyGrowthRate;
    default:
      return growthModel.baseNewClients;
  }
}

export function calculateScenario(config: ScenarioConfig): CalculationResult {
  const snapshots: MonthlySnapshot[] = [];
  let totalClients = 0;
  let cumulativeRevenue = 0;
  let roiMonth: number | null = null;

  for (let month = 1; month <= config.timeframeMonths; month++) {
    const rawNewClients = getNewClients(config, month);
    const newClients = rawNewClients * config.clientAcquisitionFactor;

    totalClients += newClients;
    totalClients -= totalClients * config.attritionRate;
    totalClients = Math.max(0, totalClients);

    let monthlyRevenue = totalClients * config.revenuePerClient * config.revenueFactor;

    if (config.revenueBoost && month <= config.revenueBoost.months) {
      monthlyRevenue *= config.revenueBoost.multiplier;
    }

    if (config.monthlyRevenueCap) {
      monthlyRevenue = Math.min(monthlyRevenue, config.monthlyRevenueCap);
    }

    cumulativeRevenue += monthlyRevenue;

    const roi = config.programCost > 0
      ? ((cumulativeRevenue - config.programCost) / config.programCost) * 100
      : 0;

    if (roiMonth === null && cumulativeRevenue >= config.programCost) {
      roiMonth = month;
    }

    snapshots.push({
      month,
      newClients: Math.round(newClients * 10) / 10,
      totalClients: Math.round(totalClients * 10) / 10,
      monthlyRevenue: Math.round(monthlyRevenue),
      cumulativeRevenue: Math.round(cumulativeRevenue),
      roi: Math.round(roi * 10) / 10,
      isRoiPositive: cumulativeRevenue >= config.programCost,
    });
  }

  const lastSnapshot = snapshots[snapshots.length - 1];

  return {
    config,
    snapshots,
    roiMonth,
    totalRevenue: lastSnapshot?.cumulativeRevenue ?? 0,
    finalClients: lastSnapshot?.totalClients ?? 0,
    finalRoi: lastSnapshot?.roi ?? 0,
  };
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}
