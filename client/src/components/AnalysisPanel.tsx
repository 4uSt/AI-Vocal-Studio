import { Activity, Volume2, Waves, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function AnalysisPanel() {
  const analysisResults = [
    {
      category: "Pitch Range",
      icon: Activity,
      value: "A2 - C5",
      status: "good",
      description: "Standard vocal range detected"
    },
    {
      category: "Dynamics",
      icon: Volume2,
      value: "18.4 dB",
      status: "good",
      description: "Good dynamic range"
    },
    {
      category: "Sibilance",
      icon: Waves,
      value: "6-8 kHz",
      status: "warning",
      description: "Elevated sibilance detected"
    },
    {
      category: "Noise Floor",
      icon: AlertCircle,
      value: "-52 dBFS",
      status: "good",
      description: "Low background noise"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good': return 'secondary';
      case 'warning': return 'outline';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium">Vocal Analysis</h3>
        <Badge variant="secondary" className="text-xs">
          <Activity className="h-3 w-3 mr-1" />
          Complete
        </Badge>
      </div>

      <div className="space-y-3">
        {analysisResults.map((result) => {
          const Icon = result.icon;
          return (
            <div key={result.category} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${getStatusColor(result.status)}`} />
                  <span className="text-xs text-muted-foreground">{result.category}</span>
                </div>
                <Badge 
                  variant={getStatusBadge(result.status) as any}
                  className="text-xs font-mono"
                  data-testid={`badge-${result.category.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {result.value}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground pl-6">{result.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Overall Quality</span>
          <span className="text-xs font-mono">82/100</span>
        </div>
        <Progress value={82} className="h-2" data-testid="progress-quality" />
      </div>
    </Card>
  );
}
