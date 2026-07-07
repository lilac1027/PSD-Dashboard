---
name: risk-scroll
description: Add a dynamic scrolling risk projects list to any dashboard or report. Supports 5-row continuous scroll, expandable detail rows, risk-level coloring, and Geo filtering. Use when the user asks for a risk list, risk tracker, risk register, or scrolling alert panel.
---

# Risk Scroll Component

Use this skill to add a reusable, zero-dependency dynamic scrolling risk projects list to any HTML dashboard or report.

## When to Use

- User asks to add a "risk list", "risk tracker", "risk register", or "top N risk projects"
- User wants a scrolling alert/exception panel
- User wants expandable risk items with detail (owner, action, date)

## Quick Integration

1. Copy `risk-scroll/risk-scroll.css` and `risk-scroll/risk-scroll.js` into the target project
2. Add `<link rel="stylesheet" href="risk-scroll.css">` and `<script src="risk-scroll.js"></script>` to the HTML
3. Add a container: `<div id="risk-panel"></div>`
4. Initialize with data:

```javascript
var data = [
  { project:'P-1402', country:'SG', riskScore:98, issue:'Negative margin',
    nextAction:'Full cost audit', owner:'David Lim', targetDate:'2026-08-15' }
];
RiskScroll.init(data, { containerId:'risk-panel', title:'Risk Projects' });
```

## Data Format

Each risk item object:
| Field | Type | Required | Description |
|---|---|---|---|
| project | string | yes | Project ID (e.g., P-1402) |
| country | string | yes | 2-letter country code |
| riskScore | number | yes | 0-100 numeric score |
| issue | string | yes | Issue description |
| nextAction | string | no | Recommended action |
| owner | string | no | Responsible person |
| targetDate | string | no | Resolution date (YYYY-MM-DD) |

## Options

| Option | Default | Description |
|---|---|---|
| containerId | 'risk-panel' | Target DOM element ID |
| title | 'Risk Projects' | Panel header title |
| subtitle | '' | Context text below title |
| geoMap | {} | { countryCode: 'Geo Name' } mapping for Geo labels |

## Cleanup

Call `RiskScroll.stop()` before destroying the component (e.g., on tab switch) to cancel the animation frame.
