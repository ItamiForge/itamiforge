"use client";

import { useState } from "react";
import type { z } from "zod";
// Imports from dashboard-01 block
import { AppSidebar } from "@/components/app-sidebar";
// Content Components
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable, type schema } from "@/components/data-table";
import { ThemeDrawer } from "@/components/theme-builder/theme-drawer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Dummy Data for DataTable
const tasks: z.infer<typeof schema>[] = [
  {
    id: 1,
    header: "Proposal",
    type: "Focus Documents",
    status: "In Progress",
    target: "2024-02-20",
    limit: "100%",
    reviewer: "Eddie Lake",
  },
  {
    id: 2,
    header: "Technical Spec",
    type: "Technical Approach",
    status: "Done",
    target: "2024-01-15",
    limit: "100%",
    reviewer: "Jamik Tashpulatov",
  },
  {
    id: 3,
    header: "Executive Summary",
    type: "Executive Summary",
    status: "Not Started",
    target: "2024-03-01",
    limit: "50%",
    reviewer: "Assign reviewer",
  },
  {
    id: 4,
    header: "UI Design",
    type: "Design",
    status: "In Progress",
    target: "2024-02-10",
    limit: "80%",
    reviewer: "Emily Whalen",
  },
];

export default function Home() {
  const [isThemeBuilderOpen, setIsThemeBuilderOpen] = useState(true);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,margin-right] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 w-full">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main Content Area */}
        <div
          className={cn(
            "flex flex-1 flex-col gap-4 p-4 pt-0 transition-[margin-right] duration-300 ease-in-out",
            isThemeBuilderOpen ? "mr-[400px]" : "mr-0",
          )}
        >
          {/* Dashboard Layout */}
          <div className="flex flex-col gap-4 p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ChartAreaInteractive />
              <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
                Placeholder Chart
              </div>
              <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
                Placeholder Stats
              </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-6">
                <h3 className="text-lg font-semibold leading-none tracking-tight mb-4">
                  Current Tasks
                </h3>
                <DataTable data={tasks} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      <ThemeDrawer
        isOpen={isThemeBuilderOpen}
        setIsOpen={setIsThemeBuilderOpen}
      />
    </SidebarProvider>
  );
}
