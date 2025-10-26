import { GripVertical, Power, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Parameter {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
}

interface EffectModuleProps {
  name: string;
  type: string;
  parameters?: Parameter[];
  bypassed?: boolean;
  onBypassToggle?: () => void;
}

export function EffectModule({
  name,
  type,
  parameters = [],
  bypassed = false,
  onBypassToggle
}: EffectModuleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBypassed, setIsBypassed] = useState(bypassed);
  const [paramValues, setParamValues] = useState<Record<string, number>>(
    parameters.reduce((acc, p) => ({ ...acc, [p.id]: p.value }), {})
  );

  const handleBypass = () => {
    setIsBypassed(!isBypassed);
    onBypassToggle?.();
    console.log(`${name} bypassed:`, !isBypassed);
  };

  return (
    <div 
      className={`border border-card-border rounded-md bg-card transition-opacity ${isBypassed ? 'opacity-50' : ''}`}
      data-testid={`module-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center gap-2 p-3">
        <button 
          className="cursor-grab hover-elevate p-1 rounded"
          data-testid="button-drag-handle"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsExpanded(!isExpanded)}
          data-testid="button-expand-collapse"
        >
          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </Button>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-sm font-medium">{name}</span>
          <Badge variant="outline" className="text-xs">{type}</Badge>
        </div>

        <Button
          variant={isBypassed ? "ghost" : "default"}
          size="icon"
          className="h-8 w-8"
          onClick={handleBypass}
          data-testid="button-bypass"
        >
          <Power className="h-3 w-3" />
        </Button>
      </div>

      {isExpanded && parameters.length > 0 && (
        <div className="px-3 pb-3 pt-0 space-y-3 border-t border-card-border mt-2">
          {parameters.map((param) => (
            <div key={param.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs">{param.label}</Label>
                <span className="text-xs font-mono text-muted-foreground">
                  {paramValues[param.id] ?? param.value}{param.unit}
                </span>
              </div>
              <Slider
                value={[paramValues[param.id] ?? param.value]}
                min={param.min}
                max={param.max}
                step={(param.max - param.min) / 100}
                onValueChange={([value]) => {
                  setParamValues(prev => ({ ...prev, [param.id]: value }));
                  console.log(`${param.label} changed to:`, value);
                }}
                data-testid={`slider-${param.id}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
