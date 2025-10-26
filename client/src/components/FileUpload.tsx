import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect?.(file);
      console.log('File selected:', file.name);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      onFileSelect?.(file);
      console.log('File dropped:', file.name);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    console.log('File cleared');
  };

  return (
    <div>
      {!selectedFile ? (
        <label
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-md cursor-pointer transition-colors hover-elevate ${
            isDragging ? 'border-primary bg-primary/5' : 'border-border'
          }`}
          data-testid="dropzone-upload"
        >
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground mb-1">
            Drop audio file here or click to browse
          </span>
          <span className="text-xs text-muted-foreground">
            Supports WAV, MP3, FLAC, AAC
          </span>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="hidden"
            data-testid="input-file"
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-3 bg-card border border-card-border rounded-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded">
              <File className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium" data-testid="text-filename">
                {selectedFile.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            data-testid="button-clear-file"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
