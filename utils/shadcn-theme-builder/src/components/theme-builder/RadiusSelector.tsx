"use client"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface RadiusSelectorProps {
    radius: number
    onChange: (radius: number) => void
}

export function RadiusSelector({ radius, onChange }: RadiusSelectorProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-muted-foreground">Global Radius</Label>
                <span className="text-xs font-mono">{radius}rem</span>
            </div>
            <Slider
                min={0}
                max={1.5}
                step={0.1}
                value={[radius]}
                onValueChange={([val]) => onChange(val)}
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
            />
        </div>
    )
}
