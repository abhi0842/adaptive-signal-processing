import { useEffect, useRef } from 'react';
import { makeSignal, runLMS } from '../core/lms';
import { setupCanvas, drawSeries, addAxisLabels } from '../core/canvas';
import NavRow from '../components/NavRow';
import BlockDiagram from '../components/BlockDiagram';

export default function Step3_Error({ cur, onNext, onPrev }) {
  const canvasRef = useRef(null);
  const x = makeSignal(0.45, 0, 101, false);
  const d = makeSignal(0.06, 0.4, 202, true);
  const lms = runLMS(x, d, 0.001, 8);

  useEffect(() => {
    if (!canvasRef.current) return;
    const { ctx, w, h } = setupCanvas(canvasRef.current, 120);
    drawSeries(ctx, lms.errs, '#e0494a', w, h);
    addAxisLabels(ctx, w, h, 'e(n)');
  }, []);

  return (
    <div className="layout">
      <div className="left-pane">
        <NavRow cur={cur} onNext={onNext} onPrev={onPrev} />
        <div className="info-card danger">
          <div className="ic-tag">Step 4 of 6</div>
          <div className="ic-title">Error Signal</div>
          <div className="ic-body">e(n) = d(n)−y(n) is the teaching signal for LMS.</div>
          <code className="ic-eq">e(n) = d(n) − y(n)</code>
        </div>
      </div>
      <div className="right-pane">
        <BlockDiagram stepIndex={3} />
        <div className="sig-card" style={{ marginTop: '20px' }}>
          <div className="sig-card-header"><span className="sig-lbl">Error e(n)</span></div>
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}
