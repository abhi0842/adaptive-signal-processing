export const N = 160;

export function seededRng(seed) {
  let s = seed;
  return () => { s = (s*9301+49297)%233280; return s/233280; };
}

export function makeSignal(noiseAmt=0.3, phase=0, seed=42, isDesired=false) {
  const rnd = seededRng(seed);
  return Array.from({length:N}, (_,n) => {
    const clean = Math.sin(2*Math.PI*6*n/N + phase);
    if (isDesired) return clean * 0.98;
    const lo  = 0.35 * Math.sin(2*Math.PI*1.1*n/N);
    const hi  = 0.25 * Math.sin(2*Math.PI*18*n/N);
    const wh  = rnd()*2 - 1;
    return clean + noiseAmt*(lo + wh + hi);
  });
}

export function runLMS(x, d, mu, M) {
  const w = new Array(M).fill(0);
  const errs=[], ys=[], w0t=[], weightsHistory=[];
  for (let n=M; n<N; n++) {
    const xv = Array.from({length:M}, (_,k) => x[n-1-k] ?? 0);
    const y  = w.reduce((s,wk,k) => s + wk*xv[k], 0);
    const e  = d[n] - y;
    w.forEach((_,k) => { w[k] += mu*e*xv[k]; });
    errs.push(e); ys.push(y); w0t.push(w[0]);
    weightsHistory.push([...w]);
  }
  return { errs, ys, w0t, weightsHistory, finalWeights:[...w] };
}

export function sigPower(x) {
  return x.reduce((s,v) => s+v*v, 0) / x.length;
}
