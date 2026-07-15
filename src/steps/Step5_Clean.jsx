import { useState, useEffect, useRef } from 'react';
import { makeSignal, runLMS } from '../core/lms';
import { setupCanvas, drawSeries, drawMSECurve, addAxisLabels } from '../core/canvas';
import NavRow from '../components/NavRow';
import BlockDiagram from '../components/BlockDiagram';
import WeightBars from '../components/WeightBars';
import AnimControls from '../components/AnimControls';
import CompareMode from '../components/CompareMode';

export default function Step5_Clean({ cur, onNext, onPrev }) {
  const [mu, setMu] = useState(0.05);
  const [ns, setNs] = useState(0.20);
  const [M, setM] = useState(8);
  const [animIdx, setAnimIdx] = useState(0);
  const [animRunning, setAnimRunning] = useState(false);
  const [animSpeed, setAnimSpeed] = useState(1);
  const [compareOn, setCompareOn] = useState(false);
  const frameRef = useRef(null);

  const x = makeSignal(ns, 0, 101, false);
  const d = makeSignal(0.07, 0.4, 202, true);
  const lms = runLMS(x, d, mu, M);
  const maxLen = lms.errs.length;

  const canvas1 = useRef(null);
  const canvas2 = useRef(null);

  const redraw = () => {
    if (canvas1.current) {
      const { ctx, w, h } = setupCanvas(canvas1.current, 130);
      drawSeries(ctx, d.slice(M), '#1aa672', w, h, { upTo: animIdx });
      drawSeries(ctx, lms.ys, '#e0494a', w, h, { upTo: animIdx });
      addAxisLabels(ctx, w, h, 'd(n) & y(n)');
    }
    if (canvas2.current) {
      const { ctx, w, h } = setupCanvas(canvas2.current, 100);
      drawMSECurve(ctx, lms.errs, w, h, { upTo: animIdx });
      addAxisLabels(ctx, w, h, 'MSE');
    }
  };

  useEffect(() => {
    if (!animRunning) return;
    let lastTick = 0;
    const loop = (ts) => {
      if (ts - lastTick >= 35 / animSpeed) {
        lastTick = ts;
        setAnimIdx(i => {
          const next = Math.min(i + Math.max(1, Math.floor(animSpeed)), maxLen);
          if (next >= maxLen) setAnimRunning(false);
          return next;
        });
      }
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [animRunning, animSpeed]);

  useEffect(() => { redraw(); }, [animIdx, mu, ns, M]);

  const stability = mu < 0.18 ? 'ok' : mu < 0.22 ? 'warn' : 'bad';
  const currentWeights = lms.weightsHistory[Math.max(0, animIdx - 1)] || new Array(M).fill(0);

  return (
    <div className="layout">
      <div className="left-pane">
        <NavRow cur={cur} onNext={onNext} onPrev={onPrev} />
        <div className="info-card success">
          <div className="ic-tag">Step 6 of 6</div>
          <div className="ic-title">Converged Output</div>
          <div className="ic-body">At convergence, y(n) closely matches d(n).</div>
          <code className="ic-eq">y(n) ≈ d(n)</code>
        </div>
      </div>
      <div className="right-pane">
        <BlockDiagram stepIndex={5} />
        <div className="sig-card" style={{ marginTop: '20px' }}>
          <div className="sig-card-header">
            <span className="sig-lbl">Final Result</span>
            <div className="compare-toggle">
              <span style={{ marginRight: '8px', fontSize: '13px', color: '#5b6178' }}>Compare μ</span>
              <div className={`toggle-switch ${compareOn ? 'on' : ''}`} onClick={() => setCompareOn(!compareOn)} />
            </div>
          </div>
          {!compareOn ? (
            <>
              <div className="ctrl-panel">
                <div className="ctrl-row">
                  <div className="ctrl-g">
                    <div className="ctrl-l">μ: {mu.toFixed(3)}</div>
                    <input type="range" min="0.005" max="0.25" step="0.001" value={mu} onChange={e => setMu(parseFloat(e.target.value))} />
                  </div>
                  <div className="ctrl-g">
                    <div className="ctrl-l">Noise: {ns.toFixed(2)}</div>
                    <input type="range" min="0.05" max="0.5" step="0.01" value={ns} onChange={e => setNs(parseFloat(e.target.value))} />
                  </div>
                  <div className="ctrl-g">
                    <div className="ctrl-l">M: {M}</div>
                    <input type="range" min="2" max="16" step="1" value={M} onChange={e => setM(parseInt(e.target.value))} />
                  </div>
                </div>
              </div>
              <AnimControls
                running={animRunning}
                onToggle={() => setAnimRunning(!animRunning)}
                onReset={() => { setAnimIdx(0); setAnimRunning(false); }}
                speed={animSpeed}
                onSpeed={setAnimSpeed}
              />
              <canvas ref={canvas1} />
              <canvas ref={canvas2} />
              <div style={{ marginTop: '16px' }}>
                <WeightBars weights={currentWeights} />
              </div>
              <div style={{ marginTop: '16px' }}>
                <span className={`status-badge ${stability}`}>
                  {stability === 'ok' ? '✓ Stable' : stability === 'warn' ? '⚠ Marginal' : '✗ Unstable'}
                </span>
              </div>
            </>
          ) : (
            <CompareMode />
          )}
        </div>
      </div>
    </div>
  );
}
