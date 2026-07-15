import { useState, useEffect, useRef } from 'react';
import { makeSignal, runLMS } from '../core/lms';
import { setupCanvas, drawSeries, drawMSECurve, addAxisLabels } from '../core/canvas';
import AnimControls from './AnimControls';

export default function CompareMode() {
  const [muA, setMuA] = useState(0.02);
  const [muB, setMuB] = useState(0.18);
  const [animIdx, setAnimIdx] = useState(0);
  const [animRunning, setAnimRunning] = useState(false);
  const [animSpeed, setAnimSpeed] = useState(1);
  const frameRef = useRef(null);

  const x = makeSignal(0.25, 0, 21, false);
  const d = makeSignal(0.04, 0.5, 22, true);
  const lmsA = runLMS(x, d, muA, 8);
  const lmsB = runLMS(x, d, muB, 8);
  const maxLen = lmsA.errs.length;

  const canvasA1 = useRef(null);
  const canvasA2 = useRef(null);
  const canvasB1 = useRef(null);
  const canvasB2 = useRef(null);

  const redraw = () => {
    if (canvasA1.current) {
      const { ctx, w, h } = setupCanvas(canvasA1.current, 110);
      drawSeries(ctx, d.slice(8), '#1aa672', w, h, { upTo: animIdx });
      drawSeries(ctx, lmsA.ys, '#2e6fdb', w, h, { upTo: animIdx });
      addAxisLabels(ctx, w, h);
    }
    if (canvasA2.current) {
      const { ctx, w, h } = setupCanvas(canvasA2.current, 70);
      drawMSECurve(ctx, lmsA.errs, w, h, { upTo: animIdx });
      addAxisLabels(ctx, w, h, 'MSE');
    }
    if (canvasB1.current) {
      const { ctx, w, h } = setupCanvas(canvasB1.current, 110);
      drawSeries(ctx, d.slice(8), '#1aa672', w, h, { upTo: animIdx });
      drawSeries(ctx, lmsB.ys, '#7c4fd1', w, h, { upTo: animIdx });
      addAxisLabels(ctx, w, h);
    }
    if (canvasB2.current) {
      const { ctx, w, h } = setupCanvas(canvasB2.current, 70);
      drawMSECurve(ctx, lmsB.errs, w, h, { upTo: animIdx });
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

  useEffect(() => { redraw(); }, [animIdx, muA, muB]);

  return (
    <div className="compare-grid show">
      <div className="compare-col col-a">
        <div className="sig-card">
          <div className="sig-card-header"><span className="sig-lbl">μ = 0.02 (Stable)</span></div>
          <div className="ctrl-row">
            <div className="ctrl-g">
              <div className="ctrl-l">μ</div>
              <input type="range" min="0.005" max="0.25" step="0.001" value={muA} onChange={e => setMuA(parseFloat(e.target.value))} />
            </div>
          </div>
          <canvas ref={canvasA1} />
          <canvas ref={canvasA2} />
        </div>
      </div>
      <div className="compare-col col-b">
        <div className="sig-card">
          <div className="sig-card-header"><span className="sig-lbl">μ = 0.18 (Marginal)</span></div>
          <div className="ctrl-row">
            <div className="ctrl-g">
              <div className="ctrl-l">μ</div>
              <input type="range" min="0.005" max="0.25" step="0.001" value={muB} onChange={e => setMuB(parseFloat(e.target.value))} />
            </div>
          </div>
          <canvas ref={canvasB1} />
          <canvas ref={canvasB2} />
        </div>
      </div>
      <div style={{ gridColumn: '1 / -1', marginTop: '12px' }}>
        <AnimControls
          running={animRunning}
          onToggle={() => setAnimRunning(!animRunning)}
          onReset={() => { setAnimIdx(0); setAnimRunning(false); }}
          speed={animSpeed}
          onSpeed={setAnimSpeed}
          extraBtn
        />
      </div>
    </div>
  );
}
