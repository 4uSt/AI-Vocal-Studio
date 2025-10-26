import { ChainBuilder } from '../ChainBuilder';

export default function ChainBuilderExample() {
  const effects = [
    {
      id: '1',
      name: 'High-Pass Filter',
      type: 'EQ',
      parameters: [
        { id: 'freq', label: 'Frequency', value: 80, min: 20, max: 500, unit: 'Hz' }
      ]
    },
    {
      id: '2',
      name: 'De-esser',
      type: 'Dynamics',
      parameters: [
        { id: 'freq', label: 'Frequency', value: 6500, min: 2000, max: 12000, unit: 'Hz' },
        { id: 'threshold', label: 'Threshold', value: -24, min: -60, max: 0, unit: 'dB' }
      ]
    },
    {
      id: '3',
      name: 'Compressor',
      type: 'Dynamics',
      parameters: [
        { id: 'threshold', label: 'Threshold', value: -18, min: -60, max: 0, unit: 'dB' },
        { id: 'ratio', label: 'Ratio', value: 4, min: 1, max: 20, unit: ':1' }
      ]
    },
    {
      id: '4',
      name: 'Parametric EQ',
      type: 'EQ',
      bypassed: false,
      parameters: [
        { id: 'freq', label: 'Frequency', value: 2500, min: 20, max: 20000, unit: 'Hz' },
        { id: 'gain', label: 'Gain', value: 3, min: -12, max: 12, unit: 'dB' }
      ]
    }
  ];

  return (
    <div className="h-[600px]">
      <ChainBuilder effects={effects} />
    </div>
  );
}
