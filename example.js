import { initRawComponent } from './lib/rawcomponent.js';
import { getRawValuesAsync } from './api/mockRawValues.js';

// ── 1. Data ──────────────────────────────────────────────────────────────────
// Real raw fluorescence integers extracted from a 1_1_A3.srd instrument file.
// 19 202 samples × 8 channels, 250 ms per sample → ~80 minutes total.
// Channels 1–4 are original readings; channels 5–8 are derived variants.

const { channels, timeStepMs } = await getRawValuesAsync();

// ── 2. Theme ──────────────────────────────────────────────────────────────────
const dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
document.documentElement.dataset.appliedMode = dark ? 'dark' : 'light';

const colors = dark
    ? ['#4fc36a', '#5b9bd5', '#e06060', '#d4a020', '#a07ad0', '#40c8c8', '#e07840', '#90b060']
    : ['green',   'blue',   'red',    'goldenrod', 'purple', 'teal',   'darkorange', 'olivedrab'];

// ── 3. Wire up the component ──────────────────────────────────────────────────
const graph = {
    rawGraphId:          'rawgraph-id',
    rawGraphContainerId: 'rawgraph-container-id',
};

const scroll = {
    rawScrollId:          'rawscroll-id',
    rawScrollContainerId: 'rawscroll-container-id',
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
