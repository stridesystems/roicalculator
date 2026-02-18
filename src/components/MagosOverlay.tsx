import { useState, useEffect } from 'react';

interface Props {
  activated: boolean;
  onComplete: () => void;
}

export function MagosOverlay({ activated, onComplete }: Props) {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!activated) return;
    setVisible(true);
    setPhase(1);

    const t1 = setTimeout(() => setPhase(2), 800);
    const t2 = setTimeout(() => setPhase(3), 2000);
    const t3 = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 3200);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [activated, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 transition-opacity duration-500">
      <div className="text-center space-y-6">
        {phase >= 1 && (
          <div className="animate-pulse">
            <div className="text-8xl mb-4">⚙</div>
            <div className="text-red-500 font-bold text-2xl tracking-[0.3em] uppercase"
                 style={{ fontFamily: 'UnifrakturMaguntia, serif' }}>
              MAGOS PROTOCOL
            </div>
          </div>
        )}
        {phase >= 2 && (
          <div className="space-y-2 animate-[fadeIn_0.5s_ease-in]">
            <div className="text-red-400/80 text-sm tracking-widest font-mono">
              INITIATING MACHINE SPIRIT...
            </div>
            <div className="text-red-600/60 text-xs tracking-widest font-mono">
              01001111 01001101 01001110 01001001 01010011 01010011 01001001 01000001 01001000
            </div>
          </div>
        )}
        {phase >= 3 && (
          <div className="text-red-300 text-lg italic animate-[fadeIn_0.5s_ease-in]"
               style={{ fontFamily: 'UnifrakturMaguntia, serif' }}>
            "The Omnissiah blesses your calculations."
          </div>
        )}
      </div>
    </div>
  );
}
