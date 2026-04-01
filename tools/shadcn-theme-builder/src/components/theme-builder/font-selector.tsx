"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FontSelectorProps {
  font: string;
  onChange: (font: string) => void;
}

const fonts = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Playfair Display",
  "Montserrat",
  "Poppins",
  "Lato",
  "Geist", // NextJS default
];

export function FontSelector({ font, onChange }: FontSelectorProps) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-semibold text-muted-foreground">
        Font Family
      </Label>
      <Select value={font} onValueChange={onChange}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Select font" />
        </SelectTrigger>
        <SelectContent>
          {fonts.map((f) => (
            <SelectItem key={f} value={f} className="text-xs">
              <span style={{ fontFamily: f }}>{f}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-[10px] text-muted-foreground mt-1">
        * Note: Fonts must be installed locally or via Google Fonts
      </p>
    </div>
  );
}
