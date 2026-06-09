import { initRawComponent } from './lib/rawcomponent.js';

// ── 1. Data ──────────────────────────────────────────────────────────────────
// Supply up to 8 channels of raw integer samples plus the sampling interval.
// Each channel is a plain Array<number>; channels may differ in length.
//
// Here we generate 4 synthetic fluorescence-like traces so the example is
// self-contained. Replace these arrays with data from your own API call.

const N          = 2000;   // number of samples per channel
const timeStepMs = 250;    // milliseconds between samples → ~8.3 min total

function makeChannel(baseline, amplitude, cycles, phase) {
    const data = new Array(N);
    for (let i = 0; i < N; i++) {
        const signal = amplitude * Math.sin(2 * Math.PI * cycles * i / N + phase);
        const noise  = (Math.random() - 0.5) * amplitude * 0.04;
        data[i] = Math.max(0, Math.round(baseline + signal + noise));
    }
    return data;
}

const channels = [
    makeChannel(200_000, 150_000, 3,           0),
    makeChannel(180_000, 120_000, 2,   Math.PI / 4),
    makeChannel(220_000, 100_000, 4,   Math.PI / 2),
    makeChannel(160_000, 140_000, 2.5, Math.PI),
];

// ── 2. Theme ──────────────────────────────────────────────────────────────────
// Detect the OS preference and apply a CSS data attribute that the stylesheet
// uses to switch color variables. The scrollbar colors are read from CSS.

const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
document.documentElement.dataset.appliedMode = dark ? 'dark' : 'light';

// One color per channel — must have at least as many entries as channels.length.
const colors = dark
    ? ['#4fc36a', '#5b9bd5', '#e06060', '#d4a020']
    : ['green',   'blue',   'red',    'goldenrod'];

// ── 3. Wire up the component ──────────────────────────────────────────────────
// Each parameter object maps to a group of DOM element IDs defined in index.html.

const graph = {
    rawGraphId:          'rawgraph-id',
    rawGraphContainerId: 'rawgraph-container-id',
};

const scroll = {
    rawScrollId:          'rawscroll-id',
    rawScrollContainerId: 'rawscroll-container-id',
    // Read the scrollbar colors from CSS so they match the active theme.
    rawScrollBackground: getComputedStyle(document.documentElement).getPropertyValue('--scroll-back'),
    rawScrollPortColor:  getComputedStyle(document.documentElement).getPropertyValue('--scroll-port'),
};

const zoom = {
    rawZoomOutId: 'rawzoom-out-id',
    rawZoomInId:  'rawzoom-in-id',
};

const values = { channels, timeStepMs };

const xAxis = {
    rawXAxisId:          'raw-x-axis-id',
    rawXAxisContainerId: 'raw-x-axis-container-id',
    rawXAxisFontSize:    10,
    rawXAxisFontName:    'Verdana',
    rawXAxisFontColor:   dark ? 'white' : 'black',
};

const yAxis = {
    rawYAxisMinId:     'raw-y-axis-min-id',
    rawYAxisMaxId:     'raw-y-axis-max-id',
    rawYAxisFontSize:  11,
    rawYAxisFontColor: dark ? 'white' : 'black',
    rawYAxisFontName:  'Verdana',
};

// initRawComponent returns a cleanup function that removes all event listeners.
// Call it if you ever need to tear down the component (e.g. SPA navigation).
const _cleanup = initRawComponent(graph, scroll, zoom, values, colors, xAxis, yAxis);
