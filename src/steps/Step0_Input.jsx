import { useEffect, useRef } from 'react';
import { makeSignal } from '../core/lms';
import { setupCanvas, drawSeries, addAxisLabels } from '../core/canvas';
import NavRow from '../components/NavRow';
import BlockDiagram from '../components/BlockDiagram';

export default function Step0_Input({ cur, onNext, onPrev }) {
  const canvasRef = useRef(null);
  const x = makeSignal(0.45, 0, 101, false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const { ctx, w, h } = setupCanvas(canvasRef.current, 120);
    drawSeries(ctx, x, '#2e6fdb', w, h);
    addAxisLabels(ctx, w, h, 'x(n)');
  }, []);

  return (
    <div className="layout">
      <div className="left-pane">
        <NavRow cur={cur} onNext={onNext} onPrev={onPrev} />
        <div className="info-card">
          <div className="ic-tag">Step 1 of 6</div>
          <div className="ic-title">Input Signal</div>
          <div className="ic-body">x(n) is a noisy sinusoid with three noise components.</div>
          <code className="ic-eq">x(n) = sin(2π·6·n/N) + η·[low + white + high]</code>
        </div>
      </div>
      <div className="right-pane">
        <BlockDiagram stepIndex={0} />
        <div className="sig-card" style={{ marginTop: '20px' }}>
          <div className="sig-card-header"><span className="sig-lbl">Noisy Reference x(n)</span></div>
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}
