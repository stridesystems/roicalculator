import { useMemo } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import type { CalculationResult, ThemeMode } from '../models/types';
import { formatCurrency } from '../engine/calculator';

Chart.register(...registerables, annotationPlugin);

interface Props {
  optimistic: CalculationResult;
  conservative: CalculationResult;
  showComparison: boolean;
  programCost: number;
  theme: ThemeMode;
}

export function ResultsChart({ optimistic, conservative, showComparison, programCost, theme }: Props) {
  const isMagos = theme === 'magos';
  const isDark = theme === 'dark' || theme === 'magos';

  const chartData = useMemo(() => ({
    labels: optimistic.snapshots.map(s => `Mo ${s.month}`),
    datasets: [
      {
        label: optimistic.config.name,
        data: optimistic.snapshots.map(s => s.cumulativeRevenue),
        borderColor: isMagos ? '#ef4444' : optimistic.config.color,
        backgroundColor: isMagos ? 'rgba(239, 68, 68, 0.1)' : `${optimistic.config.color}15`,
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: isMagos ? '#ef4444' : optimistic.config.color,
      },
      showComparison && {
        label: conservative.config.name,
        data: conservative.snapshots.map(s => s.cumulativeRevenue),
        borderColor: isMagos ? '#991b1b' : conservative.config.color,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [6, 4],
        tension: 0.4,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
      {
        label: 'Investment',
        data: optimistic.snapshots.map(() => programCost),
        borderColor: isMagos ? '#fca5a5' : '#EF4444',
        borderWidth: 1,
        borderDash: [3, 3],
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
      },
    ].filter(Boolean),
  }), [optimistic, conservative, showComparison, programCost, isMagos]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: isMagos ? '#fca5a5' : isDark ? '#d1d5db' : '#374151',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: { size: 12, family: isMagos ? 'UnifrakturMaguntia' : 'Inter' },
        },
      },
      tooltip: {
        backgroundColor: isMagos ? 'rgba(127, 29, 29, 0.95)' : isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isMagos ? '#fca5a5' : isDark ? '#f9fafb' : '#111827',
        bodyColor: isMagos ? '#fecaca' : isDark ? '#d1d5db' : '#374151',
        borderColor: isMagos ? '#991b1b' : isDark ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        titleFont: { size: 13, weight: 'bold' as const, family: isMagos ? 'UnifrakturMaguntia' : 'Inter' },
        bodyFont: { size: 12, family: 'Inter' },
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) => {
            const label = ctx.dataset.label ?? '';
            const value = ctx.parsed.y;
            return `${label}: ${formatCurrency(value ?? 0)}`;
          },
        },
      },
      annotation: {
        annotations: optimistic.roiMonth ? {
          roiLine: {
            type: 'line' as const,
            xMin: optimistic.roiMonth - 1,
            xMax: optimistic.roiMonth - 1,
            borderColor: isMagos ? '#4ade80' : '#22c55e',
            borderWidth: 2,
            borderDash: [6, 4],
            label: {
              content: isMagos ? 'BREAK-EVEN' : 'Break-Even',
              display: true,
              position: 'start' as const,
              color: isMagos ? '#4ade80' : '#22c55e',
              font: {
                size: 11,
                weight: 'bold' as const,
                family: isMagos ? 'UnifrakturMaguntia' : 'Inter',
              },
              backgroundColor: isMagos ? 'rgba(127, 29, 29, 0.9)' : isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              padding: 4,
            },
          },
        } : {},
      },
    },
    scales: {
      x: {
        grid: {
          color: isMagos ? 'rgba(239, 68, 68, 0.08)' : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        },
        ticks: {
          color: isMagos ? '#991b1b' : isDark ? '#9ca3af' : '#6b7280',
          font: { size: 11, family: 'Inter' },
        },
      },
      y: {
        grid: {
          color: isMagos ? 'rgba(239, 68, 68, 0.08)' : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        },
        ticks: {
          color: isMagos ? '#991b1b' : isDark ? '#9ca3af' : '#6b7280',
          font: { size: 11, family: 'Inter' },
          callback: (value: string | number) => formatCurrency(Number(value)),
        },
      },
    },
  }), [optimistic.roiMonth, isMagos, isDark]);

  return (
    <div className={`rounded-xl p-4 ${
      isMagos
        ? 'bg-red-950/20 border border-red-900/30'
        : 'bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700'
    }`}>
      <div className="h-[400px] w-full">
        <Line data={chartData as never} options={options as never} />
      </div>
    </div>
  );
}
