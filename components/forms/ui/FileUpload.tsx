"use client";

import * as React from "react";
import { Upload, X, FileText, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MAX_FILE_SIZE } from "@/lib/schemas/register.step3.schema";

interface FileUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  onBlur?: () => void;
  label: string;
  description?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  accept?: string;
  maxSize?: number;
  className?: string;
}

/**
 * File upload component with drag & drop
 * Pure UI component - receives value and onChange from RHF
 */
export function FileUpload({
  value,
  onChange,
  onBlur,
  label,
  description,
  required = false,
  error,
  disabled = false,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSize = MAX_FILE_SIZE,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        onChange(file);
      }
      onBlur?.();
    },
    [disabled, onChange, onBlur]
  );

  const handleFileChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onChange(files[0]);
      }
      onBlur?.();
    },
    [onChange, onBlur]
  );

  const handleRemove = React.useCallback(() => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [onChange]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Label */}
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {required && <span className="text-destructive">*</span>}
        {!required && <span className="text-muted-foreground text-xs">(optional)</span>}
      </div>

      {/* Description */}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}

      {/* Upload Zone */}
      {!value ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-input hover:border-primary/50 hover:bg-muted/50",
            error && "border-destructive",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <Upload className="size-8 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">Drag and drop a file here</p>
            <p className="text-xs text-muted-foreground">or click to select</p>
          </div>
          <p className="text-xs text-muted-foreground">
            PDF, JPG, PNG • Max {formatFileSize(maxSize)}
          </p>
          <input
            title="Upload File"
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled}
            className="hidden"
          />
        </div>
      ) : (
        /* File Preview */
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
          <div className="flex size-10 items-center justify-center rounded-md bg-primary/10">
            <FileText className="size-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{value.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(value.size)}</p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="size-4 text-green-600" />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleRemove}
              disabled={disabled}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
