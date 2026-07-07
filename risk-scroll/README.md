# Risk Projects Scrolling List

A zero-dependency, reusable component for displaying a dynamic scrolling risk projects list. Shows 5 rows at a time with smooth continuous upward scroll, expandable detail rows, and auto-looping.

## Features

- **5-row viewport** with smooth 60fps continuous upward scroll
- **Auto-loop** — items cycle seamlessly from bottom back to top
- **Expandable detail** — click any row to reveal Next Action, Owner, Target Date
- **Risk-level coloring** — red (top 3), amber (4-6), blue (7+)
- **GEO-aware** — optionally pass a country→Geo mapping for Geo labels
- **Zero dependencies** — pure vanilla JS + CSS

## Quick Start

```html
<link rel="stylesheet" href="risk-scroll.css">
<script src="risk-scroll.js"></script>
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

## API

### `RiskScroll.init(data, options)`
Initialize the component.

- **data** `Array` — array of risk project objects with fields:
  - `project` (string) — project ID
  - `country` (string) — 2-letter country code
  - `riskScore` (number) — 0–100 score
  - `issue` (string) — issue description
  - `nextAction` (string, optional) — recommended action
  - `owner` (string, optional) — responsible person
  - `targetDate` (string, optional) — resolution date
- **options** `Object`:
  - `containerId` (string, default `'risk-panel'`) — target DOM element ID
  - `title` (string, default `'Risk Projects'`) — panel header title
  - `subtitle` (string, optional) — context text below title
  - `geoMap` (Object, optional) — `{ countryCode: 'Geo Name' }` mapping

### `RiskScroll.toggleDetail(rid)`
Programmatically toggle a risk item's detail panel.

### `RiskScroll.start()`
Start/resume the scroll animation.

### `RiskScroll.stop()`
Stop the scroll animation (call before destroying the component).

## Integration Example

### With MSPO Dashboard
```javascript
// Filter by Geo selection, then render
var filtered = chartData.riskProjects.filter(function(p) {
  return geoCountries.has(p.country);
}).sort(function(a,b) { return b.riskScore - a.riskScore; });

var geoMap = {};
for (var gName in chartData.lenovoGeos) {
  for (var rName in chartData.lenovoGeos[gName].regions) {
    chartData.lenovoGeos[gName].regions[rName].countries.forEach(function(c) {
      geoMap[c.code] = gName;
    });
  }
}

RiskScroll.init(filtered.slice(0, 10), {
  containerId: 'risk-panel',
  title: 'Risk Projects',
  subtitle: 'AP — Top 10',
  geoMap: geoMap
});
```

## License

MIT — free to use, modify, and distribute.
