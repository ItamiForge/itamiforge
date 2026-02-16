"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hexToHsl, hslToHex } from "@/lib/theme/utils";

interface ColorPickerProps {
  label: string;
  color: string; // HSL string
  onChange: (color: string) => void;
}

export function ColorPicker({ label, color, onChange }: ColorPickerProps) {
  // Safe conversion with fallback
  let hex = "#000000";
  try {
    hex = hslToHex(color);
  } catch (e) {
    console.error("Invalid color:", color);
  }

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    // Basic validation for hex length (3 or 6 chars)
    if (/^#[0-9A-F]{3}$/i.test(newHex) || /^#[0-9A-F]{6}$/i.test(newHex)) {
      try {
        onChange(hexToHsl(newHex));
      } catch (e) {
        // Ignore invalid hsl conversion
      }
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(hexToHsl(e.target.value));
  };

  return (
    <div className="space-y-1">
      <Label className="text-xs font-semibold text-muted-foreground">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 rounded-md overflow-hidden border border-input shadow-sm">
          <input
            type="color"
            value={hex}
            onChange={handleColorChange}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 cursor-pointer border-0"
          />
        </div>
        <Input
          value={hex}
          onChange={handleHexChange}
          className="h-8 text-xs font-mono"
        />
      </div>
    </div>
  );
}
