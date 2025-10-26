import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface WaveformVisualizerProps {
  audioFileName?: string;
  duration?: string;
}

export function WaveformVisualizer({ 
  audioFileName = "vocal_recording.wav",
  duration = "3:24"
}: WaveformVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium" data-testid="text-filename">{audioFileName}</span>
          <Badge variant="secondary" className="text-xs font-mono" data-testid="badge-duration">
            {duration}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs" data-testid="badge-samplerate">
            48kHz
          </Badge>
          <Badge variant="outline" className="text-xs" data-testid="badge-bitdepth">
            24-bit
          </Badge>
        </div>
      </div>

      <div className="relative h-48 bg-card border border-card-border rounded-md overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d="M0,100 L10,95 L20,90 L30,85 L40,75 L50,65 L60,55 L70,50 L80,45 L90,40 L100,35 L110,30 L120,28 L130,30 L140,35 L150,40 L160,50 L170,60 L180,70 L190,80 L200,85 L210,88 L220,90 L230,95 L240,98 L250,100 L260,105 L270,110 L280,115 L290,120 L300,125 L310,130 L320,132 L330,130 L340,125 L350,120 L360,110 L370,100 L380,90 L390,80 L400,75 L410,70 L420,68 L430,70 L440,75 L450,80 L460,85 L470,90 L480,95 L490,100 L500,102 L510,100 L520,95 L530,90 L540,85 L550,80 L560,75 L570,72 L580,75 L590,80 L600,85 L610,88 L620,90 L630,95 L640,100 L650,105 L660,110 L670,112 L680,110 L690,105 L700,100 L710,95 L720,92 L730,95 L740,100 L750,105 L760,108 L770,105 L780,100 L790,95 L800,92 L810,95 L820,100 L830,105 L840,110 L850,115 L860,118 L870,115 L880,110 L890,105 L900,102 L910,105 L920,110 L930,115 L940,118 L950,115 L960,110 L970,105 L980,102 L990,105 L1000,100"
            fill="url(#waveGradient)"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
          />
        </svg>
        
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-primary" 
          style={{ left: '25%' }}
          data-testid="playhead-indicator"
        />
        
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          <Badge variant="destructive" className="text-xs" data-testid="badge-issue-sibilance">
            Sibilance
          </Badge>
          <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-500" data-testid="badge-issue-plosive">
            Plosive
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentTime("0:00")}
            data-testid="button-skip-back"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            data-testid="button-play-pause"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentTime(duration)}
            data-testid="button-skip-forward"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            data-testid="button-loop"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-xs font-mono text-muted-foreground" data-testid="text-timecode">
          {currentTime} / {duration}
        </div>
      </div>
    </div>
  );
}
