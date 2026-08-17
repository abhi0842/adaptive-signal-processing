import { useEffect, useRef } from 'react';
import { makeSignal, runLMS } from '../core/lms';
import { setupCanvas, drawSeries, addAxisLabels } from '../core/canvas';
import NavRow from '../components/NavRow';
import BlockDiagram from '../components/BlockDiagram';
import WeightBars from '../components/WeightBars';

export default function Step1_FilterOutput({ cur, onNext, onPrev }) {
  const canvasRef = useRef(null);
  const x = makeSignal(0.45, 0, 101, false);
  const d = makeSignal(0.06, 0.4, 202, true);
  const lms = runLMS(x, d, 0.001, 8);

  useEffect(() => {
    if (!canvasRef.current) return;
    const { ctx, w, h } = setupCanvas(canvasRef.current, 120);
    drawSeries(ctx, x.slice(8), '#2e6fdb', w, h, { alpha: 0.3 });
    drawSeries(ctx, lms.ys, '#e0494a', w, h);
    addAxisLabels(ctx, w, h, 'y(n)');
  }, [x, lms.ys]);

  return (
    <div className="layout">
      <div className="left-pane">
        <NavRow cur={cur} onNext={onNext} onPrev={onPrev} />
        <div className="info-card">
          <div className="ic-tag">Step 2 of 6</div>
          <div className="ic-title">Filter Output</div>
          <div className="ic-body">All weights start at 0, so y(n) is initially zero.</div>
          <code className="ic-eq">y(n) = Σ w[k]·x(n−1−k)</code>
        </div>
      </div>
      <div className="right-pane">
        <BlockDiagram stepIndex={1} />
        <div className="sig-card" style={{ marginTop: '20px' }}>
          <div className="sig-card-header"><span className="sig-lbl">Filter Output y(n)</span></div>
          <canvas ref={canvasRef} />
          <div style={{ marginTop: '16px' }}>
            <WeightBars weights={new Array(8).fill(0)} />
          </div>
        </div>
      </div>
    </div>
  );
}
