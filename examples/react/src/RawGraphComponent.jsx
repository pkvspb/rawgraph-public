import { useRef, useEffect } from 'react';
import { initRawComponent } from '../../../lib/rawcomponent.js';

const CHANNEL_COLOR_VARS = [
    '--raw-channel-1', '--raw-channel-2', '--raw-channel-3', '--raw-channel-4',
    '--raw-channel-5', '--raw-channel-6', '--raw-channel-7', '--raw-channel-8',
];

export default function RawGraphComponent({ values, theme }) {
    const rawGraphContainerRef = useRef(null);

    function getStyledColor(typeName) {
        return getComputedStyle(rawGraphContainerRef.current).getPropertyValue(typeName);
    }

    function drawRawComponent(values) {
        const colors = CHANNEL_COLOR_VARS.map(getStyledColor);

        const rawGraphId = 'rawgraph-id';
        const rawGraphContainerId = 'rawgraph-container-id';

        const rawScrollId = 'rawscroll-id';
        const rawScrollContainerId = 'rawscroll-container-id';
        const rawScrollBackground = getStyledColor('--scroll-back');
        const rawScrollPortColor = getStyledColor('--scroll-port');

        const rawZoomOutId = 'rawzoom-out-id';
        const rawZoomInId = 'rawzoom-in-id';

        const rawXAxisId = 'raw-x-axis-id';
        const rawXAxisContainerId = 'raw-x-axis-container-id';
        const rawXAxisFontSize = 10;
        const rawXAxisFontName = '"Fira Code", monospace';
        const rawXAxisFontColor = getStyledColor('--text');

        const rawYAxisMinId = 'raw-y-axis-min-id';
        const rawYAxisMaxId = 'raw-y-axis-max-id';
        const rawYAxisFontSize = 11;
        const rawYAxisFontColor = getStyledColor('--text');
        const rawYAxisFontName = '"Fira Code", monospace';

        const graph = { rawGraphId, rawGraphContainerId };
        const scroll = { rawScrollId, rawScrollContainerId, rawScrollBackground, rawScrollPortColor };
        const zoom = { rawZoomOutId, rawZoomInId };

        const xAxis = { rawXAxisId, rawXAxisContainerId, rawXAxisFontSize, rawXAxisFontName, rawXAxisFontColor };
        const yAxis = { rawYAxisMinId, rawYAxisMaxId, rawYAxisFontSize, rawYAxisFontColor, rawYAxisFontName };

        return initRawComponent(graph, scroll, zoom, values, colors, xAxis, yAxis);
    }

    useEffect(() => {
        const unInitRawComponent = drawRawComponent(values);

        return () => unInitRawComponent();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- drawRawComponent closes over the stable ref/getStyledColor
    }, [values, theme]);

    return (
        <>
            <div className="x-axis-container" id="raw-x-axis-container-id">
                <canvas id="raw-x-axis-id"></canvas>
            </div>

            <div className="y-axis-container">
                <span id="raw-y-axis-max-id"></span>
                <span id="raw-y-axis-min-id"></span>
            </div>

            <div ref={rawGraphContainerRef} className="graph-container" id="rawgraph-container-id">
                <canvas id="rawgraph-id"></canvas>
            </div>

            <div className="scroll-container" id="rawscroll-container-id">
                <canvas id="rawscroll-id"></canvas>
            </div>
        </>
    );
}
