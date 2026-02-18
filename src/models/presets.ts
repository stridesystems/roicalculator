import type { BusinessModelPreset } from './types';

export const presets: Record<string, BusinessModelPreset> = {
  coaching: {
    id: 'coaching',
    name: 'Coaching',
    description: 'Client-based coaching or training programs',
    icon: '🎯',
    defaults: {
      programCost: { value: 10000, min: 2000, max: 50000, step: 500 },
      revenuePerClient: { value: 200, min: 50, max: 1000, step: 10 },
      attritionRate: 0.05,
      growthModel: { type: 'linear', baseNewClients: 4, monthlyGrowthRate: 2 },
      timeframeMonths: 12,
    },
    scenarios: {
      optimistic: {
        name: 'Elite Program',
        color: '#B8860B',
        clientAcquisitionFactor: 1.0,
        revenueFactor: 1.0,
        revenueBoost: { months: 3, multiplier: 1.3 },
      },
      conservative: {
        name: 'Industry Average',
        color: '#6B7280',
        clientAcquisitionFactor: 0.75,
        revenueFactor: 0.8,
        monthlyRevenueCap: 4000,
        dashed: true,
      },
    },
  },
  saas: {
    id: 'saas',
    name: 'SaaS',
    description: 'Software-as-a-service subscription products',
    icon: '💻',
    defaults: {
      programCost: { value: 25000, min: 5000, max: 200000, step: 1000 },
      revenuePerClient: { value: 49, min: 9, max: 299, step: 5 },
      attritionRate: 0.03,
      growthModel: { type: 'exponential', baseNewClients: 10, monthlyGrowthRate: 0.15 },
      timeframeMonths: 18,
    },
    scenarios: {
      optimistic: {
        name: 'Product-Market Fit',
        color: '#3B82F6',
        clientAcquisitionFactor: 1.0,
        revenueFactor: 1.0,
        revenueBoost: { months: 2, multiplier: 1.2 },
      },
      conservative: {
        name: 'Market Average',
        color: '#6B7280',
        clientAcquisitionFactor: 0.6,
        revenueFactor: 0.9,
        dashed: true,
      },
    },
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    description: 'Service-based agency with retainer clients',
    icon: '🏢',
    defaults: {
      programCost: { value: 15000, min: 5000, max: 100000, step: 1000 },
      revenuePerClient: { value: 2000, min: 500, max: 10000, step: 250 },
      attritionRate: 0.08,
      growthModel: { type: 'stepped', baseNewClients: 1, monthlyGrowthRate: 1 },
      timeframeMonths: 12,
    },
    scenarios: {
      optimistic: {
        name: 'Growth Agency',
        color: '#10B981',
        clientAcquisitionFactor: 1.0,
        revenueFactor: 1.0,
      },
      conservative: {
        name: 'Solo Operator',
        color: '#6B7280',
        clientAcquisitionFactor: 0.5,
        revenueFactor: 0.7,
        dashed: true,
      },
    },
  },
  ecommerce: {
    id: 'ecommerce',
    name: 'E-Commerce',
    description: 'Online store with recurring customers',
    icon: '🛒',
    defaults: {
      programCost: { value: 8000, min: 1000, max: 50000, step: 500 },
      revenuePerClient: { value: 75, min: 10, max: 500, step: 5 },
      attritionRate: 0.12,
      growthModel: { type: 'exponential', baseNewClients: 20, monthlyGrowthRate: 0.1 },
      timeframeMonths: 12,
    },
    scenarios: {
      optimistic: {
        name: 'Optimized Store',
        color: '#F59E0B',
        clientAcquisitionFactor: 1.0,
        revenueFactor: 1.0,
        revenueBoost: { months: 1, multiplier: 1.5 },
      },
      conservative: {
        name: 'Average Store',
        color: '#6B7280',
        clientAcquisitionFactor: 0.65,
        revenueFactor: 0.75,
        dashed: true,
      },
    },
  },
};
