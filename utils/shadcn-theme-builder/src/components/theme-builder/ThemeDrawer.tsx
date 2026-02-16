"use client"

import { useTheme } from "@/lib/theme/ThemeContext"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings2, Moon, Sun, PanelRightClose, PanelRightOpen, Check } from "lucide-react"
import { ColorPicker } from "./ColorPicker"
import { RadiusSelector } from "./RadiusSelector"
import { FontSelector } from "./FontSelector"
import { Separator } from "@/components/ui/separator"
import { ExportCode } from "./ExportCode"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ThemeDrawerProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export function ThemeDrawer({ isOpen, setIsOpen }: ThemeDrawerProps) {
    const { colors, setColors, radius, setRadius, mode, setMode, font, setFont } = useTheme()

    const colorGroups = {
        "Base": ["background", "foreground", "card", "cardForeground", "popover", "popoverForeground"],
        "Brand": ["primary", "primaryForeground", "secondary", "secondaryForeground", "accent", "accentForeground"],
        "UI": ["border", "input", "ring", "muted", "mutedForeground", "destructive", "destructiveForeground"],
        "Charts": ["chart1", "chart2", "chart3", "chart4", "chart5"],
    }

    return (
        <>
            <Button
                variant="outline"
                size="icon"
                className={cn(
                    "fixed bottom-8 right-8 z-50 shadow-2xl rounded-full h-14 w-14 p-0 transition-transform duration-300",
                    isOpen ? "translate-x-[400px]" : "translate-x-0"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <Settings2 className="h-6 w-6" /> : <Settings2 className="h-6 w-6" />}
            </Button>

            <div
                className={cn(
                    "fixed top-0 right-0 h-screen bg-background border-l transition-all duration-300 ease-in-out z-40 flex flex-col",
                    isOpen ? "w-[400px] translate-x-0" : "w-[400px] translate-x-full"
                )}
            >
                <div className="p-6 pb-2 border-b">
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="text-lg font-semibold">Theme Builder</h2>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
                                {mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </Button>
                            <ExportCode />
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                <PanelRightClose className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1 px-6 pb-6">
                    <div className="space-y-8 pb-10 pt-6">

                        {/* Global Settings */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-medium text-foreground/80">Global Settings</h3>
                            <div className="grid gap-6">
                                <RadiusSelector radius={radius} onChange={setRadius} />
                                <FontSelector font={font} onChange={setFont} />
                            </div>
                        </div>

                        <Separator />

                        {/* Colors */}
                        {Object.entries(colorGroups).map(([group, keys]) => (
                            <div key={group} className="space-y-4">
                                <h3 className="text-sm font-medium text-foreground/80 sticky top-0 bg-background/95 backdrop-blur py-2 z-10 border-b">
                                    {group} Colors
                                </h3>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                    {keys.map(key => (
                                        <ColorPicker
                                            key={key}
                                            label={key}
                                            color={colors[key as keyof typeof colors]}
                                            onChange={(c) => setColors({ [key]: c })}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </>
    )
}
