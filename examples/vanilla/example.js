import { initRawComponent } from '../../lib/rawcomponent.js';
import { getRawValuesAsync } from '../../api/mockRawValues.js';

// ── 1. Data ──────────────────────────────────────────────────────────────────
// Real raw fluorescence integers extracted from a 1_1_A3.srd instrument file.
// 19 202 samples × 8 channels, 250 ms per sample → ~80 minutes total.
// Channels 1–4 are original readings; channels 5–8 are derived variants.

const { channels, timeStepMs } = await getRawValuesAsync();

// ── 2. Theme ──────────────────────────────────────────────────────────────────
let dark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

const graph = {
    rawGraphId:          'rawgraph-id',
    rawGraphContainerId: 'rawgraph-container-id',
};

const zoom = {
    rawZoomOutId: 'rawzoom-out-id',
    rawZoomInId:  'rawzoom-in-id',
};

const values = { channels, timeStepMs };

// initRawComponent returns a cleanup function that removes all event listeners.
// Re-running it with new colors/fonts is the simplest way to apply a theme change.
let cleanup = null;

function start(isDark) {
    document.documentElement.dataset.appliedMode = isDark ? 'dark' : 'light';

    const colors = isDark
        ? ['#4fc36a', '#5b9bd5', '#e06060', '#d4a020', '#a07ad0', '#40c8c8', '#e07840', '#90b060']
        : ['green',   'blue',   'red',    'goldenrod', 'purple', 'teal',   'darkorange', 'olivedrab'];

    const scroll = {
        rawScrollId:          'rawscroll-id',
        rawScrollContainerId: 'rawscroll-container-id',
        rawScrollBackground: getComputedStyle(document.documentElement).getPropertyValue('--scroll-back'),
        rawScrollPortColor:  getComputedStyle(document.documentElement).getPropertyValue('--scroll-port'),
    };

    const xAxis = {
        rawXAxisId:          'raw-x-axis-id',
        rawXAxisContainerId: 'raw-x-axis-container-id',
        rawXAxisFontSize:    10,
        rawXAxisFontName:    '"Fira Code", monospace',
        rawXAxisFontColor:   isDark ? 'white' : 'black',
    };

    const yAxis = {
        rawYAxisMinId:     'raw-y-axis-min-id',
        rawYAxisMaxId:     'raw-y-axis-max-id',
        rawYAxisFontSize:  11,
        rawYAxisFontColor: isDark ? 'white' : 'black',
        rawYAxisFontName:  '"Fira Code", monospace',
    };

    cleanup = initRawComponent(graph, scroll, zoom, values, colors, xAxis, yAxis);
}

// ── 3. Wire up the component ──────────────────────────────────────────────────
start(dark);

// ── 4. Theme toggle button ────────────────────────────────────────────────────
const themeToggle = document.getElementById('theme-toggle-id');
themeToggle.textContent = dark ? '☀️' : '🌙';
themeToggle.addEventListener('click', () => {
    dark = !dark;
    themeToggle.textContent = dark ? '☀️' : '🌙';
    cleanup();
    start(dark);
});

// ── 5. Resizable left panel ───────────────────────────────────────────────────
// Demonstrates that the graph adapts to its container's size: the library's
// internal ResizeObserver picks up the new --left-width automatically.
initLeftPanelResize('left-resizer-id');

function initLeftPanelResize(resizerId, minPercent = 10, maxPercent = 70) {
    const resizer = document.getElementById(resizerId);
    let dragging = false;
    let rafId = null;

    resizer.addEventListener('mousedown', handleMouseDown);

    function handleMouseDown(e) {
        e.preventDefault();
        dragging = true;
        resizer.classList.add('active');
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(e) {
        if (!dragging) return;

        const percent = (e.clientX / window.innerWidth) * 100;
        const clampedPercent = Math.min(Math.max(percent, minPercent), maxPercent);

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            rafId = null;
            document.documentElement.style.setProperty('--left-width', clampedPercent + '%');
        });
    }

    function handleMouseUp() {
        dragging = false;
        resizer.classList.remove('active');
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
}
