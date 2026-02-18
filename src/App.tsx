import { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { ModelSelector } from './components/ModelSelector';
import { ScenarioControls } from './components/ScenarioControls';
import { ResultsChart } from './components/ResultsChart';
import { MetricsPanel } from './components/MetricsPanel';
import { MagosOverlay } from './components/MagosOverlay';
import { useCalculator } from './hooks/useCalculator';
import { useKonamiCode } from './hooks/useKonamiCode';
import type { ThemeMode } from './models/types';

function App() {
  const { state, currentPreset, results, setPreset, update } = useCalculator();
  const konami = useKonamiCode();
  const [showOverlay, setShowOverlay] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      if (localStorage.getItem('magos-activated') === 'true') return 'magos';
      return (localStorage.getItem('roi-theme') as ThemeMode) ?? 'light';
    } catch { return 'light'; }
  });

  const [overlayTriggered, setOverlayTriggered] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleFooterTap = useCallback(() => {
    if (theme === 'magos') return;
    tapCount.current += 1;
    clearTimeout(tapTimer.current);
    if (tapCount.current >= 7) {
      tapCount.current = 0;
      konami.activate();
    } else {
      tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 2000);
    }
  }, [theme, konami]);

  if (konami.activated && theme !== 'magos' && !overlayTriggered) {
    setShowOverlay(true);
    setOverlayTriggered(true);
  }

  const handleOverlayComplete = useCallback(() => {
    setShowOverlay(false);
    setTheme('magos');
  }, []);

  const handleThemeToggle = useCallback(() => {
    if (theme === 'magos') return;
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    try { localStorage.setItem('roi-theme', next); } catch {}
  }, [theme]);

  const handleMagosReset = useCallback(() => {
    konami.reset();
    setTheme('light');
    setOverlayTriggered(false);
    try { localStorage.setItem('roi-theme', 'light'); } catch {}
  }, [konami]);

  const bgClass = theme === 'magos'
    ? 'bg-[#0a0000] min-h-screen'
    : theme === 'dark'
      ? 'bg-gray-900 min-h-screen'
      : 'bg-gray-50 min-h-screen';

  return (
    <div className={bgClass}>
      <MagosOverlay activated={showOverlay} onComplete={handleOverlayComplete} />
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Header
          theme={theme}
          onThemeToggle={handleThemeToggle}
          onMagosReset={theme === 'magos' ? handleMagosReset : undefined}
        />

        <div className="space-y-6">
          <ModelSelector
            currentPresetId={state.presetId}
            onSelect={setPreset}
            theme={theme}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ResultsChart
                optimistic={results.optimistic}
                conservative={results.conservative}
                showComparison={state.showComparison}
                programCost={state.programCost}
                theme={theme}
              />
              <MetricsPanel
                optimistic={results.optimistic}
                conservative={results.conservative}
                showComparison={state.showComparison}
                programCost={state.programCost}
                theme={theme}
              />
            </div>
            <div>
              <ScenarioControls
                state={state}
                preset={currentPreset}
                onUpdate={update}
                theme={theme}
              />
            </div>
          </div>

          <footer className={`text-center text-xs py-4 ${
            theme === 'magos'
              ? 'text-red-900/50'
              : 'text-gray-400 dark:text-gray-600'
          }`}>
            {theme === 'magos'
              ? '⚙ From the forges of Mars · The Machine Spirit endures · v2.0 ⚙'
              : <><span>ROI Calculator </span><span onClick={handleFooterTap} className="cursor-default select-none">v2.0</span><span> · All projections are estimates</span></>
            }
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
