# IaiGraph — Raw Fluorescence Viewer

A vanilla JavaScript canvas library for visualizing raw fluorescence data from DNA sequencing instruments.

- Up to **8 channels**, each rendered as a colored trace on an HTML5 Canvas
- **Zoom in/out** — ×2 per click, window centered on the visible range
- **Horizontal scroll bar** — drag to pan after zooming in
- **X-axis** in seconds/minutes, tick spacing adapts automatically to zoom level
- **Y-axis** auto-scaled to the visible window on every draw
- **Light and dark theme** support via CSS custom properties
- No dependencies, no build step for the consumer

## Quick start

ES modules require a local server (browsers block `file://` imports).

```bash
npx http-server -p 8080 -c-1
```

Then open `http://localhost:8080` in a browser.  
Alternatively, use [VS Code Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) and click **Go Live** with `index.html` open.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure — all required element IDs |
| `example.css` | Layout and theming — adjust `--y-axis-width`, `--graph-height`, etc. |
| `example.js` | Synthetic data generation and `initRawComponent` call |
| `lib/rawcomponent.js` | Library entry point — **import this file** |
| `lib/rawgraph.js` | Canvas renderer (also exported for standalone use) |
| `lib/rawscroll.js` | Scroll bar (also exported for standalone use) |

## DOM contract

`initRawComponent` locates elements by ID at call time. The following elements must exist in the page before the script runs:

| ID | Tag | Purpose |
|----|-----|---------|
| `rawgraph-id` | `<canvas>` | Main graph — library paints channels here |
| `rawgraph-container-id` | `<div>` | Controls graph canvas size via `getBoundingClientRect()` |
| `rawscroll-id` | `<canvas>` | Horizontal scroll bar |
| `rawscroll-container-id` | `<div>` | Controls scroll canvas size |
| `rawzoom-out-id` | `<button>` | Zoom out (halves the zoom level) |
| `rawzoom-in-id` | `<button>` | Zoom in (doubles the zoom level) |
| `raw-x-axis-id` | `<canvas>` | X-axis time labels |
| `raw-x-axis-container-id` | `<div>` | Controls X-axis canvas width |
| `raw-y-axis-max-id` | `<span>` | Y-axis maximum label (positioned by the library) |
| `raw-y-axis-min-id` | `<span>` | Y-axis minimum label (positioned by the library) |

**Size the `<div>` containers with CSS, not the `<canvas>` elements directly.** The library reads container dimensions and resizes the canvases automatically, including on window resize.

## Providing your own data

```js
const values = {
    channels: [
        [/* channel 1 — Array<number> */],
        [/* channel 2 */],
        // … up to 8 channels
    ],
    timeStepMs: 250,   // milliseconds between consecutive samples
};
```

Channels may have different lengths; the longest determines the total time axis. Values are raw integers — the Y-axis scales automatically to the visible range.

## `initRawComponent` reference

```js
const cleanup = initRawComponent(graph, scroll, zoom, values, colors, xAxis, yAxis);
```

| Parameter | Shape | Description |
|-----------|-------|-------------|
| `graph` | `{ rawGraphId, rawGraphContainerId }` | Canvas and container IDs for the main graph |
| `scroll` | `{ rawScrollId, rawScrollContainerId, rawScrollBackground, rawScrollPortColor }` | Scroll bar IDs and colors |
| `zoom` | `{ rawZoomOutId, rawZoomInId }` | Zoom button IDs |
| `values` | `{ channels, timeStepMs }` | Data arrays and sampling interval |
| `colors` | `string[]` | One CSS color per channel |
| `xAxis` | `{ rawXAxisId, rawXAxisContainerId, rawXAxisFontSize, rawXAxisFontName, rawXAxisFontColor }` | X-axis canvas and font settings |
| `yAxis` | `{ rawYAxisMinId, rawYAxisMaxId, rawYAxisFontSize, rawYAxisFontColor, rawYAxisFontName }` | Y-axis label elements and font settings |

`cleanup()` removes all event listeners attached by the library (resize, click, pointer). Call it when tearing down the component.

## Updating the library files

The files in `lib/` are built from [IaiGraph](https://github.com/pkvspb/IaiGraph). To update them, run `npm run build` in that project and copy the three files from its `dist/` folder into `lib/`.
