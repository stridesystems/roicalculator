import type { ThemeMode } from '../models/types';

interface Props {
  theme: ThemeMode;
  onThemeToggle: () => void;
  onMagosReset?: () => void;
}

export function Header({ theme, onThemeToggle, onMagosReset }: Props) {
  const isMagos = theme === 'magos';

  return (
    <header className={`flex items-center justify-between mb-8 ${isMagos ? 'border-b border-red-900/30 pb-4' : 'border-b border-gray-100 dark:border-gray-800 pb-4'}`}>
      <div>
        <h1
          className={`text-2xl font-bold tracking-tight ${isMagos ? 'text-red-400' : 'text-gray-900 dark:text-gray-100'}`}
          style={isMagos ? { fontFamily: 'UnifrakturMaguntia, serif' } : undefined}
        >
          {isMagos ? '⚙ Omnissiah ROI Engine' : 'ROI Calculator'}
        </h1>
        <p className={`text-sm mt-1 ${isMagos ? 'text-red-500/60' : 'text-gray-500 dark:text-gray-400'}`}>
          {isMagos
            ? 'Blessed projections from the Machine Spirit'
            : 'Project your return on investment across business models'
          }
        </p>
      </div>
      <div className="flex items-center gap-2">
        {isMagos && onMagosReset && (
          <button
            onClick={onMagosReset}
            className="px-3 py-1.5 text-xs rounded-lg bg-red-950 text-red-400 border border-red-900/50 hover:bg-red-900/50 transition-colors cursor-pointer"
            title="Deactivate MAGOS"
          >
            ⚙ EXIT
          </button>
        )}
        <button
          onClick={onThemeToggle}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            isMagos
              ? 'bg-red-950 text-red-400 hover:bg-red-900/50'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
          title="Toggle theme"
        >
          {isMagos ? '⚙' : theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
