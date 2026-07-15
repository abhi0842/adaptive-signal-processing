export function setupCanvas(canvas, h) {
  const dpr = window.devicePixelRatio||1;
  const w   = Math.max(canvas.parentElement.clientWidth-4, 200);
  canvas.width=w*dpr; canvas.height=h*dpr;
  canvas.style.width=w+'px'; canvas.style.height=h+'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr,dpr);
  ctx.fillStyle='#fafbfd'; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#e1e4ec'; ctx.lineWidth=0.6;
  for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(0,h/4*i);ctx.lineTo(w,h/4*i);ctx.stroke();}
  for(let i=1;i<6;i++){ctx.beginPath();ctx.moveTo(w/6*i,0);ctx.lineTo(w/6*i,h);ctx.stroke();}
  ctx.strokeStyle='#c8cdda'; ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();
  return {ctx,w,h};
}

export function drawSeries(ctx,data,color,W,H,{alpha=1,lw=1.8,upTo,scale}={}) {
  const n=data.length, cap=upTo??n;
  const mx=scale??Math.max(...data.map(Math.abs),0.01);
  ctx.beginPath(); ctx.strokeStyle=color; ctx.globalAlpha=alpha;
  ctx.lineWidth=lw; ctx.lineJoin='round';
  for(let i=0;i<Math.min(cap,n);i++){
    const x=(i/(n-1))*W, y=H/2-(data[i]/mx)*(H/2-10);
    i?ctx.lineTo(x,y):ctx.moveTo(x,y);
  }
  ctx.stroke(); ctx.globalAlpha=1;
}

export function drawMSECurve(ctx,errs,W,H,{upTo}={}) {
  const n=errs.length, cap=upTo??n;
  const sq=errs.map(v=>v*v), mx=Math.max(...sq,0.01);
  ctx.beginPath(); ctx.strokeStyle='#e0494a'; ctx.lineWidth=1.8;
  for(let i=0;i<Math.min(cap,n);i++){
    const x=(i/(n-1))*W, y=H-8-(sq[i]/mx)*(H-18);
    i?ctx.lineTo(x,y):ctx.moveTo(x,y);
  }
  ctx.stroke();
}

export function addAxisLabels(ctx,w,h,lbl) {
  ctx.fillStyle='#8a90a6'; ctx.font='10px sans-serif';
  if(lbl) ctx.fillText(lbl,4,12);
  ctx.fillText('n →',w-24,h-4);
}
