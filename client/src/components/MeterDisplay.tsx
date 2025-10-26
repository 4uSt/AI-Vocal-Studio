import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function MeterDisplay() {
  const leftLevel = 75;
  const rightLevel = 68;
  const lufs = -14.2;
  const peak = -3.1;
  const phaseCorrelation = 0.95;

  const getPeakColor = (value: number) => {
    if (value > -1) return 'bg-destructive';
    if (value > -6) return 'bg-yellow-500';
    return 'bg-primary';
  };

  return (
    <div className="flex items-center gap-6 p-3 bg-card border-t border-card-border">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground w-4">L</span>
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full ${getPeakColor(peak)} transition-all duration-150`}
              style={{ width: `${leftLevel}%` }}
              data-testid="meter-left"
            />
          </div>
          <span className="text-xs font-mono w-12 text-right">{peak.toFixed(1)} dB</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground w-4">R</span>
          <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full ${getPeakColor(peak)} transition-all duration-150`}
              style={{ width: `${rightLevel}%` }}
              data-testid="meter-right"
            />
          </div>
          <span className="text-xs font-mono w-12 text-right">{peak.toFixed(1)} dB</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">LUFS</div>
          <div className="text-sm font-mono font-medium" data-testid="text-lufs">{lufs.toFixed(1)}</div>
        </div>

        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Phase</div>
          <div className="flex items-center gap-1">
            <div className="text-sm font-mono font-medium" data-testid="text-phase">
              {phaseCorrelation.toFixed(2)}
            </div>
            {phaseCorrelation > 0.8 ? (
              <CheckCircle2 className="h-3 w-3 text-green-500" />
            ) : (
              <AlertTriangle className="h-3 w-3 text-yellow-500" />
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Badge variant="outline" className="text-xs" data-testid="badge-mono-compat">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Mono OK
          </Badge>
          <Badge variant="outline" className="text-xs" data-testid="badge-headroom">
            <Activity className="h-3 w-3 mr-1" />
            {Math.abs(peak).toFixed(1)}dB
          </Badge>
        </div>
      </div>
    </div>
  );
}
