---
name: risk-scroll
description: This skill should be used when the user asks to "add a risk scroll", "create a scrolling risk list", "show risk projects", "build a risk panel", "integrate the risk-scroll component", or mentions risk scrolling, risk project lists, or the risk-scroll widget. Also applies when editing or debugging files in the risk-scroll/ directory.
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# Risk Projects Scrolling List — Skill

Zero-dependency, reusable component for displaying a dynamic scrolling risk projects list.
Shows 5 rows at a time with smooth continuous upward scroll, expandable detail rows, and auto-looping.

## Files

| File | Purpose |
|---|---|
| `risk-scroll/risk-scroll.js` | Component logic — buildPanel, startScroll, stopScroll, toggleDetail, init |
| `risk-scroll/risk-scroll.css` | Styling — panel layout, risk-level coloring (red/amber/blue), scroll container |
| `risk-scroll/README.md` | Full API docs and integration guide |

For complete API details and integration examples, read `risk-scroll/README.md`.

## Key Design Facts

- **5-row viewport** — `risk-list-wrap` height is 245px, each row is 49px
- **Scroll speed** — 20 px/sec via `requestAnimationFrame`
- **Auto-loop** — when offset reaches one row height, the first item is moved to the end
- **Risk-level coloring** — index 0–2 = red, 3–5 = amber, 6+ = blue
- **Expandable detail** — click a row to reveal Next Action / Owner / Target Date; only one open at a time
- **GEO-aware** — pass `geoMap: { countryCode: 'Geo Name' }` in options to show Geo labels

## Quick Start

```html
<link rel="stylesheet" href="risk-scroll/risk-scroll.css">
<script src="risk-scroll/risk-scroll.js"></script>
<div id="risk-panel"></div>
<script>
  var data = [
    { project:'P-1402', country:'SG', riskScore:98, issue:'Negative margin -330%',
      nextAction:'Full cost audit', owner:'David Lim', targetDate:'2026-08-15' },
    { project:'P-0891', country:'HK', riskScore:92, issue:'Budget adjusted 3x',
      nextAction:'Freeze changes', owner:'Calvin Wong', targetDate:'2026-07-20' }
  ];
  RiskScroll.init(data, { containerId:'risk-panel', title:'Risk Projects' });
</script>
```

## API Reference

### `RiskScroll.init(data, options)`

Initialize the component. Starts the scroll animation automatically.

**data** — Array of objects with:
- `project` (string) — project ID
- `country` (string) — 2-letter country code
- `riskScore` (number) — 0–100
- `issue` (string) — issue description
- `nextAction` (string, optional)
- `owner` (string, optional)
- `targetDate` (string, optional)

**options** — Object with:
- `containerId` (string, default `'risk-panel'`) — target DOM element ID
- `title` (string, default `'Risk Projects'`) — panel header
- `subtitle` (string, optional) — context text below title
- `geoMap` (Object, optional) — `{ countryCode: 'Geo Name' }` mapping

### `RiskScroll.toggleDetail(rid)`
Toggle a risk item's detail panel by ID prefix (e.g. `'risk-0'`).

### `RiskScroll.start()`
Start or resume the scroll animation.

### `RiskScroll.stop()`
Stop the scroll animation. Call before destroying the component.

## Integration with MSPO Dashboard

When integrating with the main dashboard, filter risk projects by Geo selection and sort by riskScore descending:

```javascript
var filtered = chartData.riskProjects.filter(function(p) {
  return geoCountries.has(p.country);
}).sort(function(a,b) { return b.riskScore - a.riskScore; });

RiskScroll.init(filtered.slice(0, 10), {
  containerId: 'risk-panel',
  title: 'Risk Projects',
  subtitle: 'AP — Top 10',
  geoMap: geoMap
});
```

## Common Tasks

When the user asks to modify this component, consider:
- **Adjust scroll speed** → change `RISK_SCROLL_SPEED` in risk-scroll.js
- **Change number of visible rows** → adjust `risk-list-wrap` height in CSS (current: 245px = 5 × 49px)
- **Change risk-level thresholds** → modify the `cls` assignment in `buildPanel()` (currently i < 3 → red, i < 6 → amber)
- **Add new data fields** → update the item template in `buildPanel()` and the detail section
- **Style changes** → edit risk-scroll.css; key classes: `.risk-panel`, `.risk-item`, `.risk-detail`
