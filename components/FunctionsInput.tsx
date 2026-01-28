"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { FunctionsInputProps } from "@/lib/features/users/types/users.types";

export function FunctionsInput({
  value,
  functions,
  onFunctionsChange,
  disabled = false,
}: FunctionsInputProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleAddFunction = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !functions.includes(trimmedValue)) {
      const newFunctions = [...functions, trimmedValue];
      onFunctionsChange(newFunctions);
      setInputValue("");
    }
  };

  const handleRemoveFunction = (funcToRemove: string) => {
    const newFunctions = functions.filter((func) => func !== funcToRemove);
    onFunctionsChange(newFunctions);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleAddFunction();
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="functions-input">Functions & Roles</Label>
      <div className="flex gap-2">
        <Input
          id="functions-input"
          placeholder="e.g., Manager, Developer, Designer..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label="Add function or role"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAddFunction}
          disabled={!inputValue.trim() || disabled}
          aria-label="Add function"
        >
          Add
        </Button>
      </div>

      {functions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2" role="list" aria-label="Selected functions">
          {functions.map((func) => (
            <Badge
              key={func}
              variant="secondary"
              className="px-3 py-1 flex items-center gap-1"
              role="listitem"
            >
              {func}
              <button
                type="button"
                onClick={() => handleRemoveFunction(func)}
                className="ml-1 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                disabled={disabled}
                aria-label={`Remove ${func}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
