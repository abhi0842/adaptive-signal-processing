import { useState, useEffect, useRef, useCallback } from 'react';
import { makeSignal, runLMS } from '../core/lms';
import { setupCanvas, drawSeries, addAxisLabels } from '../core/canvas';
import NavRow from '../components/NavRow';
import BlockDiagram from '../components/BlockDiagram';
import WeightBars from '../components/WeightBars';
import AnimControls from '../components/AnimControls';

export default function Step4_LMS({ cur, onNext, onPrev }) {
  const [mu, setMu] = useState(0.05);
  const [M, setM] = useState(8);
  const [animIdx, setAnimIdx] = useState(0);
  const [animRunning, setAnimRunning] = useState(false);
  const [animSpeed, setAnimSpeed] = useState(1);
  const frameRef = useRef(null);

  const x = makeSignal(0.45, 0, 101, false);
  const d = makeSignal(0.06, 0.5, 202, true);
  const lms = runLMS(x, d, mu, M);
  const maxLen = lms.errs.length;

  const canvasRef = useRef(null);

  const redraw = useCallback(() => {
    if (!canvasRef.current) return;
    const { ctx, w, h } = setupCanvas(canvasRef.current, 120);
    drawSeries(ctx, lms.w0t, '#c9821a', w, h, { upTo: animIdx });
    if (animIdx > 0) {
      const converged = new Array(animIdx).fill(lms.w0t[animIdx - 1]);
      drawSeries(ctx, converged, '#1aa672', w, h, { lw: 1, alpha: 0.5 });
    }
    addAxisLabels(ctx, w, h, 'w₀(t)');
  }, [animIdx, lms]);

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
  }, [animRunning, animSpeed, maxLen]);

  useEffect(() => { redraw(); }, [redraw]);

  const stability = mu < 0.15 ? 'ok' : mu < 0.22 ? 'warn' : 'bad';
  const currentWeights = lms.weightsHistory[Math.max(0, animIdx - 1)] || new Array(M).fill(0);
  const currentErr = lms.errs[Math.max(0, animIdx - 1)] || 0;

  return (
    <div className="layout">
      <div className="left-pane">
        <NavRow cur={cur} onNext={onNext} onPrev={onPrev} />
        <div className="info-card warn">
          <div className="ic-tag">Step 5 of 6</div>
          <div className="ic-title">LMS Update</div>
          <div className="ic-body">w[k] ← w[k] + μ·e(n)·xv[k] for all k.</div>
          <code className="ic-eq">w[k] += μ·e(n)·x(n−1−k)</code>
        </div>
      </div>
      <div className="right-pane">
        <BlockDiagram stepIndex={4} />
        <div className="sig-card" style={{ marginTop: '20px' }}>
          <div className="sig-card-header"><span className="sig-lbl">LMS Training</span></div>
          <div className="ctrl-panel">
            <div className="ctrl-row">
              <div className="ctrl-g">
                <div className="ctrl-l">μ: {mu.toFixed(3)}</div>
                <input type="range" min="0.005" max="0.25" step="0.001" value={mu} onChange={e => setMu(parseFloat(e.target.value))} />
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
          <canvas ref={canvasRef} />
          <div style={{ marginTop: '16px' }}>
            <WeightBars weights={currentWeights} />
          </div>
          <div className="metric-row" style={{ marginTop: '16px' }}>
            <div className="met">
              <div className="met-n">μ</div>
              <div className="met-v">{mu.toFixed(3)}</div>
            </div>
            <div className="met">
              <div className="met-n">e²</div>
              <div className="met-v">{(currentErr * currentErr).toFixed(4)}</div>
            </div>
            <div className={`met ${stability}`}>
              <div className="met-n">Stability</div>
              <div className="met-v">{stability === 'ok' ? 'Stable' : stability === 'warn' ? 'Marginal' : 'Unstable'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
