import { presets } from '../models/presets';
import type { ThemeMode } from '../models/types';

interface Props {
  currentPresetId: string;
  onSelect: (id: string) => void;
  theme: ThemeMode;
}

export function ModelSelector({ currentPresetId, onSelect, theme }: Props) {
  const isMagos = theme === 'magos';

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Object.values(presets).map(preset => {
        const isActive = preset.id === currentPresetId;
        return (
          <button
            key={preset.id}
            onClick={() => onSelect(preset.id)}
            className={`
              relative rounded-xl p-4 text-left transition-all duration-200
              cursor-pointer border-2
              ${isActive
                ? isMagos
                  ? 'border-red-500 bg-red-950/50 shadow-lg shadow-red-900/30'
                  : 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100 dark:bg-blue-950/30 dark:border-blue-400'
                : isMagos
                  ? 'border-red-900/30 bg-red-950/20 hover:border-red-700/50 hover:bg-red-950/30'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
              }
            `}
          >
            <div className="text-2xl mb-2">{preset.icon}</div>
            <div className={`font-semibold text-sm ${isMagos ? 'text-red-100' : 'text-gray-900 dark:text-gray-100'}`}>
              {isMagos ? preset.name.toUpperCase() : preset.name}
            </div>
            <div className={`text-xs mt-1 ${isMagos ? 'text-red-400/70' : 'text-gray-500 dark:text-gray-400'}`}>
              {preset.description}
            </div>
            {isActive && (
              <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${isMagos ? 'bg-red-400 animate-pulse' : 'bg-blue-500'}`} />
            )}
          </button>
        );
      })}
    </div>
  );
}
