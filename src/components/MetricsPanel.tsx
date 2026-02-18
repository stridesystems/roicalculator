import type { CalculationResult } from '../models/types';
import type { ThemeMode } from '../models/types';
import { formatCurrency, formatPercent } from '../engine/calculator';

interface Props {
  optimistic: CalculationResult;
  conservative: CalculationResult;
  showComparison: boolean;
  programCost: number;
  theme: ThemeMode;
}

function MetricCard({
  label,
  value,
  subtitle,
  accent,
  theme,
}: {
  label: string;
  value: string;
  subtitle?: string;
  accent?: boolean;
  theme: ThemeMode;
}) {
  const isMagos = theme === 'magos';

  return (
    <div className={`rounded-xl p-4 ${
      isMagos
        ? 'bg-red-950/30 border border-red-900/30'
        : 'bg-white border border-gray-100 shadow-sm dark:bg-gray-800 dark:border-gray-700'
    }`}>
      <div className={`text-xs font-medium uppercase tracking-wider mb-1 ${
        isMagos ? 'text-red-500/70' : 'text-gray-500 dark:text-gray-400'
      }`}>
        {label}
      </div>
      <div className={`text-2xl font-bold tabular-nums ${
        accent
          ? isMagos ? 'text-red-400' : 'text-green-600 dark:text-green-400'
          : isMagos ? 'text-red-100' : 'text-gray-900 dark:text-gray-100'
      }`}>
        {value}
      </div>
      {subtitle && (
        <div className={`text-xs mt-1 ${isMagos ? 'text-red-500/50' : 'text-gray-400 dark:text-gray-500'}`}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

export function MetricsPanel({ optimistic, conservative, showComparison, programCost, theme }: Props) {
  const isMagos = theme === 'magos';
  const net = optimistic.totalRevenue - programCost;

  return (
    <div className="space-y-3">
      <h3 className={`font-semibold text-sm uppercase tracking-wider ${isMagos ? 'text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
        {isMagos ? '⚡ Projections' : 'Key Metrics'}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label={isMagos ? 'Projected Yield' : 'Total Revenue'}
          value={formatCurrency(optimistic.totalRevenue)}
          subtitle={`${optimistic.config.name}`}
          theme={theme}
        />
        <MetricCard
          label={isMagos ? 'Net Acquisition' : 'Net Profit'}
          value={formatCurrency(net)}
          accent={net > 0}
          subtitle={net > 0 ? 'Profitable' : 'Not yet profitable'}
          theme={theme}
        />
        <MetricCard
          label={isMagos ? 'ROI Coefficient' : 'ROI'}
          value={formatPercent(optimistic.finalRoi)}
          accent={optimistic.finalRoi > 0}
          theme={theme}
        />
        <MetricCard
          label={isMagos ? 'Break-Even Epoch' : 'Break-Even'}
          value={optimistic.roiMonth ? `Month ${optimistic.roiMonth}` : 'N/A'}
          subtitle={optimistic.roiMonth ? `of ${optimistic.snapshots.length} months` : 'Not within timeframe'}
          theme={theme}
        />
        <MetricCard
          label={isMagos ? 'Active Supplicants' : 'Final Clients'}
          value={`${Math.round(optimistic.finalClients)}`}
          theme={theme}
        />
        {showComparison && (
          <MetricCard
            label={isMagos ? 'Alternative Yield' : 'Comparison Revenue'}
            value={formatCurrency(conservative.totalRevenue)}
            subtitle={`${conservative.config.name}`}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}
