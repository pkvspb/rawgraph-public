import { useEffect, useRef, useState } from 'react';
import { getRawValuesAsync } from '../../../api/mockRawValues.js';
import { useLeftPanelResize } from './hooks/useLeftPanelResize.js';
import RawGraphComponent from './RawGraphComponent.jsx';

function detectSystemTheme() {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Set before the first render so RawGraphComponent's effect (which runs
// before App's effects) reads the correct theme's CSS variables.
document.documentElement.dataset.appliedMode = detectSystemTheme();

export default function App() {
    const [theme, setTheme] = useState(detectSystemTheme);
    const [values, setValues] = useState(null);

    const leftResizerRef = useRef(null);
    useLeftPanelResize(leftResizerRef);

    function toggleTheme() {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        // Set synchronously, before setTheme triggers a re-render — child
        // effects run before this component's, so the attribute must
        // already be updated by the time RawGraphComponent re-reads colors.
        document.documentElement.dataset.appliedMode = nextTheme;
        setTheme(nextTheme);
    }

    useEffect(() => {
        let cancelled = false;

        (async () => {
            const { channels, timeStepMs } = await getRawValuesAsync();

            if (cancelled) return;
            setValues({ channels, timeStepMs });
        })();

        return () => { cancelled = true; };
    }, []);

    return (
        <>
            <div className="left" id="left-id"></div>
            <div ref={leftResizerRef} className="left-resizer" id="left-resizer-id"></div>

            <div className="zoom-controls">
                <button id="rawzoom-out-id">−</button>
                <button id="rawzoom-in-id">+</button>
            </div>

            <div className="theme-controls">
                <button
                    onClick={toggleTheme}
                    style={{fontSize: "12px"}}
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>

            {values && <RawGraphComponent values={values} theme={theme} />}
        </>
    );
}
