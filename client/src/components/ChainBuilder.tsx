import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EffectModule } from "./EffectModule";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Effect {
  id: string;
  name: string;
  type: string;
  bypassed?: boolean;
  parameters?: Array<{
    id: string;
    label: string;
    value: number;
    min: number;
    max: number;
    unit: string;
  }>;
}

interface ChainBuilderProps {
  effects?: Effect[];
}

export function ChainBuilder({ effects = [] }: ChainBuilderProps) {
  const handleAddEffect = () => {
    console.log('Add effect clicked');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <span className="text-sm font-medium">Processing Chain</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddEffect}
          data-testid="button-add-effect"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add
        </Button>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {effects.length === 0 ? (
            <div className="text-center py-12 text-sm text-muted-foreground">
              No effects added yet. Click "Add" to build your chain.
            </div>
          ) : (
            effects.map((effect) => (
              <EffectModule
                key={effect.id}
                name={effect.name}
                type={effect.type}
                bypassed={effect.bypassed}
                parameters={effect.parameters}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
