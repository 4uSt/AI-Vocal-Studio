import { Wand2, MessagesSquare } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MixingModeSelectorProps {
  mode: "auto" | "guided";
  onModeChange: (mode: "auto" | "guided") => void;
}

export function MixingModeSelector({ mode, onModeChange }: MixingModeSelectorProps) {
  return (
    <Tabs value={mode} onValueChange={(v) => onModeChange(v as "auto" | "guided")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="auto" data-testid="tab-auto-mix">
          <Wand2 className="h-4 w-4 mr-2" />
          Auto-Mix
        </TabsTrigger>
        <TabsTrigger value="guided" data-testid="tab-guided-mix">
          <MessagesSquare className="h-4 w-4 mr-2" />
          Guided Mix
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
