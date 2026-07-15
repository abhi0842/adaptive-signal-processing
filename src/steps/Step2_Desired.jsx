import { useEffect, useRef } from 'react';
import { makeSignal, runLMS } from '../core/lms';
import { setupCanvas, drawSeries, addAxisLabels } from '../core/canvas';
import NavRow from '../components/NavRow';
import BlockDiagram from '../components/BlockDiagram';

export default function Step2_Desired({ cur, onNext, onPrev }) {
  const canvasRef = useRef(null);
  const x = makeSignal(0.45, 0, 101, false);
  const d = makeSignal(0.06, 0.4, 202, true);
  const lms = runLMS(x, d, 0.001, 8);

  useEffect(() => {
    if (!canvasRef.current) return;
    const { ctx, w, h } = setupCanvas(canvasRef.current, 130);
    drawSeries(ctx, d.slice(8), '#1aa672', w, h);
    drawSeries(ctx, lms.ys, '#e0494a', w, h);
    addAxisLabels(ctx, w, h, 'd(n) & y(n)');
  }, []);

  return (
    <div className="layout">
      <div className="left-pane">
        <NavRow cur={cur} onNext={onNext} onPrev={onPrev} />
        <div className="info-card success">
          <div className="ic-tag">Step 3 of 6</div>
          <div className="ic-title">Desired Signal</div>
          <div className="ic-body">d(n) is the clean target we want the filter to learn.</div>
          <code className="ic-eq">d(n) = 0.98·sin(2π·6·n/N + 0.4)</code>
        </div>
      </div>
      <div className="right-pane">
        <BlockDiagram stepIndex={2} />
        <div className="sig-card" style={{ marginTop: '20px' }}>
          <div className="sig-card-header"><span className="sig-lbl">Desired d(n) (green) & y(n) (red)</span></div>
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}
