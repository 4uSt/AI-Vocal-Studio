import { Download, FileText, Code } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

export function ExportDialog() {
  const [selectedDAW, setSelectedDAW] = useState("logic");
  const [exportOptions, setExportOptions] = useState({
    textPDF: true,
    dawRecipe: true,
    jsonChain: false
  });

  const handleExport = () => {
    console.log('Exporting with options:', { selectedDAW, exportOptions });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" data-testid="button-open-export">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Vocal Chain</DialogTitle>
          <DialogDescription>
            Choose export formats and DAW-specific settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="text-pdf"
                checked={exportOptions.textPDF}
                onCheckedChange={(checked) =>
                  setExportOptions(prev => ({ ...prev, textPDF: checked as boolean }))
                }
                data-testid="checkbox-text-pdf"
              />
              <Label htmlFor="text-pdf" className="flex items-center gap-2 cursor-pointer">
                <FileText className="h-4 w-4" />
                <div>
                  <div className="font-medium">Text/PDF Chain Document</div>
                  <div className="text-xs text-muted-foreground">
                    Complete parameter list with explanations
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="daw-recipe"
                checked={exportOptions.dawRecipe}
                onCheckedChange={(checked) =>
                  setExportOptions(prev => ({ ...prev, dawRecipe: checked as boolean }))
                }
                data-testid="checkbox-daw-recipe"
              />
              <Label htmlFor="daw-recipe" className="flex items-center gap-2 cursor-pointer">
                <Code className="h-4 w-4" />
                <div>
                  <div className="font-medium">DAW-Specific Recipe</div>
                  <div className="text-xs text-muted-foreground">
                    Step-by-step guide using stock plugins
                  </div>
                </div>
              </Label>
            </div>

            {exportOptions.dawRecipe && (
              <div className="ml-6 space-y-2">
                <Label className="text-xs">Select DAW</Label>
                <Select value={selectedDAW} onValueChange={setSelectedDAW}>
                  <SelectTrigger data-testid="select-daw">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="logic">Logic Pro</SelectItem>
                    <SelectItem value="ableton">Ableton Live</SelectItem>
                    <SelectItem value="protools">Pro Tools</SelectItem>
                    <SelectItem value="fl">FL Studio</SelectItem>
                    <SelectItem value="reaper">Reaper</SelectItem>
                    <SelectItem value="studio-one">Studio One</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="json-chain"
                checked={exportOptions.jsonChain}
                onCheckedChange={(checked) =>
                  setExportOptions(prev => ({ ...prev, jsonChain: checked as boolean }))
                }
                data-testid="checkbox-json-chain"
              />
              <Label htmlFor="json-chain" className="flex items-center gap-2 cursor-pointer">
                <FileText className="h-4 w-4" />
                <div>
                  <div className="font-medium">JSON Chain Specification</div>
                  <div className="text-xs text-muted-foreground">
                    Portable chain format for automation
                  </div>
                </div>
              </Label>
            </div>
          </div>

          <div className="border border-border rounded-md p-3 bg-muted/30">
            <div className="text-xs font-medium mb-2">Preview: Logic Pro Recipe</div>
            <ScrollArea className="h-32">
              <pre className="text-xs font-mono text-muted-foreground">
{`1. Channel EQ
   - High-pass at 80Hz, 12dB/oct
   
2. Compressor
   - Threshold: -18dB
   - Ratio: 4:1
   - Attack: 10ms
   - Release: 100ms
   
3. Channel EQ
   - Band 1: 2.5kHz, +3dB, Q=1.4
   - Band 2: 6.5kHz, -4dB (de-ess)`}
              </pre>
            </ScrollArea>
          </div>

          <div className="flex justify-end gap-2">
            <DialogTrigger asChild>
              <Button variant="outline" data-testid="button-cancel">Cancel</Button>
            </DialogTrigger>
            <Button onClick={handleExport} data-testid="button-export-confirm">
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
