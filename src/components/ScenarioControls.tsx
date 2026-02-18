import type { CalculatorState } from '../hooks/useCalculator';
import type { BusinessModelPreset, ThemeMode } from '../models/types';

interface Props {
  state: CalculatorState;
  preset: BusinessModelPreset;
  onUpdate: (partial: Partial<CalculatorState>) => void;
  theme: ThemeMode;
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  theme,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  theme: ThemeMode;
}) {
  const isMagos = theme === 'magos';
  const accentColor = isMagos ? 'accent-red-500' : 'accent-blue-500 dark:accent-blue-400';

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <label className={`text-sm font-medium ${isMagos ? 'text-red-300' : 'text-gray-700 dark:text-gray-300'}`}>
          {label}
        </label>
        <span className={`text-sm font-bold tabular-nums ${isMagos ? 'text-red-100' : 'text-gray-900 dark:text-gray-100'}`}>
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-lg cursor-pointer ${accentColor} ${isMagos ? 'bg-red-900/50' : 'bg-gray-200 dark:bg-gray-700'}`}
      />
      <div className={`flex justify-between text-xs ${isMagos ? 'text-red-500/50' : 'text-gray-400 dark:text-gray-500'}`}>
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

export function ScenarioControls({ state, preset, onUpdate, theme }: Props) {
  const isMagos = theme === 'magos';
  const fmt = (v: number) => `$${v.toLocaleString()}`;
  const pct = (v: number) => `${(v * 100).toFixed(0)}%`;

  return (
    <div className={`rounded-xl p-5 space-y-5 ${isMagos ? 'bg-red-950/30 border border-red-900/30' : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700'}`}>
      <h3 className={`font-semibold text-sm uppercase tracking-wider ${isMagos ? 'text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
        {isMagos ? '⚙ Parameters' : 'Parameters'}
      </h3>

      <SliderControl
        label={isMagos ? 'Investment Tithe' : 'Investment Cost'}
        value={state.programCost}
        min={preset.defaults.programCost.min}
        max={preset.defaults.programCost.max}
        step={preset.defaults.programCost.step}
        format={fmt}
        onChange={v => onUpdate({ programCost: v })}
        theme={theme}
      />

      <SliderControl
        label={isMagos ? 'Revenue Per Supplicant' : 'Revenue Per Client'}
        value={state.revenuePerClient}
        min={preset.defaults.revenuePerClient.min}
        max={preset.defaults.revenuePerClient.max}
        step={preset.defaults.revenuePerClient.step}
        format={fmt}
        onChange={v => onUpdate({ revenuePerClient: v })}
        theme={theme}
      />

      <SliderControl
        label={isMagos ? 'Attrition Coefficient' : 'Monthly Churn Rate'}
        value={state.attritionRate}
        min={0.01}
        max={0.20}
        step={0.01}
        format={pct}
        onChange={v => onUpdate({ attritionRate: v })}
        theme={theme}
      />

      <SliderControl
        label={isMagos ? 'Temporal Projection' : 'Timeframe (Months)'}
        value={state.timeframeMonths}
        min={6}
        max={36}
        step={1}
        format={v => `${v}mo`}
        onChange={v => onUpdate({ timeframeMonths: v })}
        theme={theme}
      />

      <SliderControl
        label={isMagos ? 'Initial Acquisition Vector' : 'Starting New Clients/mo'}
        value={state.baseNewClients}
        min={1}
        max={50}
        step={1}
        format={v => `${v}`}
        onChange={v => onUpdate({ baseNewClients: v })}
        theme={theme}
      />

      <div className="space-y-1">
        <label className={`text-sm font-medium ${isMagos ? 'text-red-300' : 'text-gray-700 dark:text-gray-300'}`}>
          {isMagos ? 'Growth Protocol' : 'Growth Model'}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['linear', 'exponential', 'stepped'] as const).map(type => (
            <button
              key={type}
              onClick={() => onUpdate({ growthType: type })}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer capitalize
                ${state.growthType === type
                  ? isMagos
                    ? 'bg-red-700 text-red-100 shadow-md'
                    : 'bg-blue-500 text-white shadow-md dark:bg-blue-600'
                  : isMagos
                    ? 'bg-red-950/50 text-red-400 hover:bg-red-900/50'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                }
              `}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className={`text-sm font-medium ${isMagos ? 'text-red-300' : 'text-gray-700 dark:text-gray-300'}`}>
          {isMagos ? 'Comparative Analysis' : 'Show Comparison'}
        </label>
        <button
          onClick={() => onUpdate({ showComparison: !state.showComparison })}
          className={`
            relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer
            ${state.showComparison
              ? isMagos ? 'bg-red-600' : 'bg-blue-500 dark:bg-blue-600'
              : isMagos ? 'bg-red-950' : 'bg-gray-300 dark:bg-gray-600'
            }
          `}
        >
          <span
            className={`
              absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200
              ${state.showComparison ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>
    </div>
  );
}
