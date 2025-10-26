import { MixingModeSelector } from '../MixingModeSelector';
import { useState } from 'react';

export default function MixingModeSelectorExample() {
  const [mode, setMode] = useState<"auto" | "guided">("auto");

  return (
    <div className="max-w-md">
      <MixingModeSelector mode={mode} onModeChange={setMode} />
    </div>
  );
}
