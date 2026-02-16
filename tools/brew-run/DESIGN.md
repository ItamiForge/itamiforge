# BrewRun Design Document

## 1. Problem Statement
Small-to-mid size breweries struggle with **operational consistency** and **process tracking**.
- **Pain Points:** 
    - SOPs exist as static PDFs or binders that are rarely referenced during the chaotic brew day.
    - "Tribal knowledge" dictates the process ("Jim just knows to jiggle the handle"), leading to drift when staff changes.
    - Critical data points (strike temp, pH, gravity timings) are often written on wet paper logs or whiteboards, making them unsearchable and un-analyzable.
    - Training new brewers consumes senior brewer time and often leads to costly mistakes.

## 2. Solution: BrewRun (Interactive SOP Engine)
**BrewRun** is a "Live SOP" runner that converts static process documents into interactive, trackable execution flows. It lives where the brewer works (terminal/tablet), enforcing consistency and capturing data in real-time.

### Core Philosophy
- **Code as Config:** Brewing processes are defined in simple, version-controlled files (YAML/Markdown).
- **Active Execution:** The system *prompts* the brewer. It doesn't just display text; it asks for confirmation and data.
- **Audit Trail:** Every action, timestamp, and input is logged for analysis.

## 3. High-Level Architecture

### Tech Stack
- **Language:** Rust (for reliability, single-binary deployment on brewery PCs/Raspberry Pis).
- **Interface:** TUI (Terminal User Interface) via `ratatui` for high-contrast, keyboard-driven use in wet environments. (Future: Web/Tablet UI).
- **Data Storage:** SQLite (local-first, robust) with JSON export for analytics.
- **Config Format:** YAML (human-readable recipes/SOPs).

### Data Models
#### 1. The Blueprint (SOP/Recipe)
```yaml
name: "West Coast IPA v4"
steps:
  - id: "mash_in"
    title: "Mash In"
    instructions: "Mix grain and water at strike temp."
    inputs:
      - label: "Strike Water Temp"
        type: "float"
        target: 165.0
        tolerance: 2.0
      - label: "Mash pH"
        type: "float"
        target: 5.2
        range: [5.1, 5.4]
  - id: "vorlauf"
    title: "Vorlauf"
    timer: "15m"
```

#### 2. The Run (Execution Log)
```json
{
  "run_id": "batch-2024-05-10-IPA",
  "blueprint": "West Coast IPA v4",
  "brewer": "Alice",
  "start_time": "2024-05-10T06:00:00Z",
  "logs": [
    {
      "step_id": "mash_in",
      "timestamp": "2024-05-10T06:15:00Z",
      "data": { "Strike Water Temp": 164.5, "Mash pH": 5.3 }
    }
  ]
}
```

## 4. Key Features
1.  **Strict Mode:** Prevents moving to the next step until critical values (e.g., pH, Gravity) are within tolerance.
2.  **Timers & Alarms:** Integrated timers for boil additions, whirlpool, etc.
3.  **Digital Logbook:** Automatically generates a "Run Report" PDF at the end of the day.
4.  **Version Control:** Uses Git logic to track recipe changes ("Revert to v3 IPA").

## 5. Consultant Value Proposition
As a consultant, you deploy BrewRun to your clients to:
- **Standardize Operations:** "Run this script, and you'll brew it exactly like I designed."
- **Remote Diagnosis:** "Send me the run log for Batch #40." You can see *exactly* that they missed the boil temp duration.
- **Training Wheels:** New hires run the tool; the tool teaches the process.
