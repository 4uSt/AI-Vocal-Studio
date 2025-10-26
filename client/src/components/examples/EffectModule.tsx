import { EffectModule } from '../EffectModule';

export default function EffectModuleExample() {
  return (
    <div className="space-y-2 max-w-md">
      <EffectModule
        name="Parametric EQ"
        type="EQ"
        parameters={[
          { id: 'freq', label: 'Frequency', value: 2500, min: 20, max: 20000, unit: 'Hz' },
          { id: 'gain', label: 'Gain', value: 3, min: -12, max: 12, unit: 'dB' },
          { id: 'q', label: 'Q Factor', value: 1.4, min: 0.1, max: 10, unit: '' }
        ]}
      />
      <EffectModule
        name="Compressor"
        type="Dynamics"
        bypassed={false}
        parameters={[
          { id: 'threshold', label: 'Threshold', value: -18, min: -60, max: 0, unit: 'dB' },
          { id: 'ratio', label: 'Ratio', value: 4, min: 1, max: 20, unit: ':1' },
          { id: 'attack', label: 'Attack', value: 10, min: 0.1, max: 100, unit: 'ms' }
        ]}
      />
    </div>
  );
}
