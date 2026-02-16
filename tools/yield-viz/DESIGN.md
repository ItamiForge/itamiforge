# YieldViz Design Document

## 1. Problem Statement
**Yield loss** is the silent killer of brewery profitability.
- **Pain Points:** 
    - "The black hole": Brewers define batch size (e.g., 20 BBL) but often end up packaging only 16 or 17 BBLs without knowing exactly where the loss occurred.
    - **Hidden Costs:** Liquid lost in trub, hop absorption, transfer lines, or over-filling kegs is directly lost revenue.
    - **Data Silos:** Fermentation logs, packaging reports, and inventory systems rarely talk to each other.
    - **Reactive vs Proactive:** Most brewers only realize the loss *after* packaging, when it's too late to fix the process.

## 2. Solution: YieldViz (The Flow Detective)
**YieldViz** is a specialized analytics tool that visualizes liquid flow through the brewery. It tracks volume at every critical checkpoint to generate a "Sankey Diagram of Profitability," highlighting exactly where waste occurs.

### Core Philosophy
- **Granular Tracking:** We don't just track "Start" and "End". We track every transfer.
- **Visual Impact:** A Sankey diagram immediately shows the "fat" in the process.
- **Financial Translation:** We convert "Gallons Lost" into "Dollars Lost" to motivate ownership/management.

## 3. High-Level Architecture

### Tech Stack
- **Backend:** Python (Pandas/NumPy) for heavy data crunching and statistical analysis.
- **Frontend:** React + D3.js (for Sankey diagrams and interactive charts).
- **Input:** CSV/Excel import (since most brewers live in Excel) + API integration with BrewRun.

### Workflow
1.  **Data Ingestion:**
    - Import batch logs (from BrewRun or Excel templates).
    - Checks: Kettle Vol -> Whirlpool Vol -> KO Vol -> Ferm Vol -> Transfer Vol -> Bright Vol -> Packaged Vol.
2.  **Analysis Engine:**
    - Calculates % loss at each stage.
    - Compares against "Standard Loss" benchmarks (e.g., "Dry Hop absorption should be 10%, you are at 18%").
3.  **Visualization:**
    - **Batch View:** Single batch flow.
    - **Trend View:** "Are we losing more in the whirlpool this month vs last month?"
4.  **Reporting:**
    - "Leak Report": Highlights the top 3 areas of financial loss.

## 4. Key Metrics
- **Brewhouse Efficiency:** (Sugar extraction)
- **Cellar Efficiency:** (Liquid retention through fermentation/transfer)
- **Packaging Efficiency:** (Liquid into the can/keg)
- **Total System Yield:** (Raw materials -> Sales)

## 5. Consultant Value Proposition
- **The "Audit":** You run their last 50 batches through YieldViz.
- **The "Shock":** "You lost $15,000 in Q1 explicitly due to hop trub management."
- **The Fix:** You implement a new centrifuge SOP (using BrewRun).
- **The Validation:** You show Q2 data proving the $15k saving. This justifies your consulting fee instantly.
