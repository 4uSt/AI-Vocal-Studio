import { Save, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Snapshot {
  id: string;
  label: string;
  timestamp: Date;
  isActive: boolean;
}

export function SnapshotComparison() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([
    { id: 'a', label: 'A', timestamp: new Date(), isActive: true },
    { id: 'b', label: 'B', timestamp: new Date(), isActive: false },
    { id: 'c', label: 'C', timestamp: new Date(), isActive: false }
  ]);
  const [loudnessMatched, setLoudnessMatched] = useState(true);

  const handleSnapshotClick = (id: string) => {
    setSnapshots(prev => prev.map(s => ({ ...s, isActive: s.id === id })));
    console.log('Snapshot loaded:', id);
  };

  const handleSave = () => {
    console.log('Save current state as snapshot');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Snapshots</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          data-testid="button-save-snapshot"
        >
          <Save className="h-3 w-3 mr-1" />
          Save
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {snapshots.map((snapshot) => (
          <button
            key={snapshot.id}
            onClick={() => handleSnapshotClick(snapshot.id)}
            className={`p-3 rounded-md border transition-all hover-elevate ${
              snapshot.isActive
                ? 'border-primary bg-primary/10'
                : 'border-card-border bg-card'
            }`}
            data-testid={`button-snapshot-${snapshot.label.toLowerCase()}`}
          >
            <div className="text-center">
              <div className="text-lg font-bold mb-1">{snapshot.label}</div>
              <div className="text-xs text-muted-foreground">
                {snapshot.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between p-3 bg-card border border-card-border rounded-md">
        <div className="flex items-center gap-2">
          {loudnessMatched ? (
            <Volume2 className="h-4 w-4 text-primary" />
          ) : (
            <VolumeX className="h-4 w-4 text-muted-foreground" />
          )}
          <Label htmlFor="loudness-match" className="text-sm cursor-pointer">
            Loudness Matched
          </Label>
        </div>
        <div className="flex items-center gap-2">
          {loudnessMatched && (
            <Badge variant="secondary" className="text-xs font-mono">
              +2.3 dB
            </Badge>
          )}
          <Switch
            id="loudness-match"
            checked={loudnessMatched}
            onCheckedChange={setLoudnessMatched}
            data-testid="switch-loudness-match"
          />
        </div>
      </div>
    </div>
  );
}
