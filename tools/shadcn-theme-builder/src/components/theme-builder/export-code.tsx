"use client";

import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTheme } from "@/lib/theme/theme-context";

export function ExportCode() {
  const { colors, radius } = useTheme();
  const [copied, setCopied] = useState(false);

  const generateCss = () => {
    return `
    --background: ${colors.background};
    --foreground: ${colors.foreground};

    --card: ${colors.card};
    --card-foreground: ${colors.cardForeground};

    --popover: ${colors.popover};
    --popover-foreground: ${colors.popoverForeground};

    --primary: ${colors.primary};
    --primary-foreground: ${colors.primaryForeground};

    --secondary: ${colors.secondary};
    --secondary-foreground: ${colors.secondaryForeground};

    --muted: ${colors.muted};
    --muted-foreground: ${colors.mutedForeground};

    --accent: ${colors.accent};
    --accent-foreground: ${colors.accentForeground};

    --destructive: ${colors.destructive};
    --destructive-foreground: ${colors.destructiveForeground};

    --border: ${colors.border};
    --input: ${colors.input};
    --ring: ${colors.ring};

    --radius: ${radius}rem;

    --chart-1: ${colors.chart1};
    --chart-2: ${colors.chart2};
    --chart-3: ${colors.chart3};
    --chart-4: ${colors.chart4};
    --chart-5: ${colors.chart5};
    `;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`:root {${generateCss()}}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Export Theme</DialogTitle>
          <DialogDescription>
            Copy and paste the following into your global CSS file.
          </DialogDescription>
        </DialogHeader>
        <div className="relative rounded-md bg-muted p-4">
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <pre className="text-xs overflow-auto max-h-[300px] whitespace-pre-wrap font-mono p-4">
            {`:root {
${generateCss()}
}`}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
