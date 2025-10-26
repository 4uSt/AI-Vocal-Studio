import { useState } from "react";
import { WaveformVisualizer } from "@/components/WaveformVisualizer";
import { ChainBuilder } from "@/components/ChainBuilder";
import { AIChat } from "@/components/AIChat";
import { MeterDisplay } from "@/components/MeterDisplay";
import { MixingModeSelector } from "@/components/MixingModeSelector";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { SnapshotComparison } from "@/components/SnapshotComparison";
import { ExportDialog } from "@/components/ExportDialog";
import { FileUpload } from "@/components/FileUpload";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Settings, HelpCircle, Undo2, Redo2 } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export default function Studio() {
  const [mixingMode, setMixingMode] = useState<"auto" | "guided">("auto");
  const [hasFile, setHasFile] = useState(true);

  const initialMessages = [
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Hello! I\'m your AI mixing assistant. I\'ve analyzed your vocal recording and detected some sibilance around 6-8kHz. Would you like me to generate a complete processing chain, or guide you through the mixing process step by step?',
      timestamp: new Date()
    }
  ];

  const effects = [
    {
      id: '1',
      name: 'High-Pass Filter',
      type: 'EQ',
      parameters: [
        { id: 'freq', label: 'Frequency', value: 80, min: 20, max: 500, unit: 'Hz' },
        { id: 'slope', label: 'Slope', value: 12, min: 6, max: 48, unit: 'dB/oct' }
      ]
    },
    {
      id: '2',
      name: 'De-esser',
      type: 'Dynamics',
      parameters: [
        { id: 'freq', label: 'Frequency', value: 6500, min: 2000, max: 12000, unit: 'Hz' },
        { id: 'threshold', label: 'Threshold', value: -24, min: -60, max: 0, unit: 'dB' },
        { id: 'reduction', label: 'Reduction', value: 6, min: 0, max: 20, unit: 'dB' }
      ]
    },
    {
      id: '3',
      name: 'VCA Compressor',
      type: 'Dynamics',
      parameters: [
        { id: 'threshold', label: 'Threshold', value: -18, min: -60, max: 0, unit: 'dB' },
        { id: 'ratio', label: 'Ratio', value: 4, min: 1, max: 20, unit: ':1' },
        { id: 'attack', label: 'Attack', value: 10, min: 0.1, max: 100, unit: 'ms' },
        { id: 'release', label: 'Release', value: 100, min: 10, max: 1000, unit: 'ms' }
      ]
    },
    {
      id: '4',
      name: 'Parametric EQ',
      type: 'EQ',
      parameters: [
        { id: 'freq1', label: 'Freq 1', value: 250, min: 20, max: 20000, unit: 'Hz' },
        { id: 'gain1', label: 'Gain 1', value: -2, min: -12, max: 12, unit: 'dB' },
        { id: 'freq2', label: 'Freq 2', value: 2500, min: 20, max: 20000, unit: 'Hz' },
        { id: 'gain2', label: 'Gain 2', value: 3, min: -12, max: 12, unit: 'dB' }
      ]
    },
    {
      id: '5',
      name: 'Plate Reverb',
      type: 'Time',
      bypassed: false,
      parameters: [
        { id: 'decay', label: 'Decay', value: 2.1, min: 0.1, max: 10, unit: 's' },
        { id: 'predelay', label: 'Pre-delay', value: 30, min: 0, max: 200, unit: 'ms' },
        { id: 'mix', label: 'Mix', value: 25, min: 0, max: 100, unit: '%' }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="h-14 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">AI Vocal Studio</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              data-testid="button-undo"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              data-testid="button-redo"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ExportDialog />
          <Button
            variant="ghost"
            size="icon"
            data-testid="button-help"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            data-testid="button-settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <MixingModeSelector mode={mixingMode} onModeChange={setMixingMode} />
          </div>
          <ChainBuilder effects={effects} />
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col p-4 gap-4 overflow-auto">
            {!hasFile && (
              <div className="mb-4">
                <FileUpload onFileSelect={(file) => {
                  setHasFile(true);
                  console.log('File uploaded:', file.name);
                }} />
              </div>
            )}

            <Tabs value={mixingMode} className="flex-1 flex flex-col">
              <TabsContent value="auto" className="flex-1 space-y-4 mt-0">
                <WaveformVisualizer />
                
                <div className="grid grid-cols-2 gap-4">
                  <AnalysisPanel />
                  <SnapshotComparison />
                </div>
              </TabsContent>

              <TabsContent value="guided" className="flex-1 space-y-4 mt-0">
                <WaveformVisualizer />
                
                <div className="grid grid-cols-2 gap-4">
                  <AnalysisPanel />
                  <SnapshotComparison />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <MeterDisplay />
        </main>

        <aside className="w-96 border-l border-border">
          <AIChat initialMessages={initialMessages} />
        </aside>
      </div>
    </div>
  );
}
