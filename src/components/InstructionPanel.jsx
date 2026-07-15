const stepsContent = [
  {
    tag: 'Input',
    title: 'Noisy Reference Signal',
    body: 'x(n) is a noisy sinusoid. Seeded RNG seed=42. σ²ₓ≈0.5+η² sets stability bound.',
    formula: 'x(n) = sin(2π·6·n/N) + η·[0.35·sin(1.1·2πn/N) + rand() + 0.25·sin(18·2πn/N)]',
    bullets: ['Low-frequency noise', 'White noise', 'High-frequency noise'],
    intuition: 'ANC headphones — x(n) is the reference mic capturing engine noise.',
    computed: 'makeSignal(0.45,0,101,false)'
  },
  {
    tag: 'Filter',
    title: 'Adaptive Filter Output',
    body: 'FIR convolution. All weights=0 at start so y(n)=0.',
    formula: 'y(n) = Σₖ wₖ · x(n−1−k),  k=0…M−1',
    bullets: ['M tap weights', 'All zeros at t=0', 'Convolution sum'],
    intuition: 'M faders on a mixing desk — all at zero until LMS moves them.',
    computed: 'xv[k]=x[n-1-k]; y=sum(w[k]*xv[k])'
  },
  {
    tag: 'Desired',
    title: 'Desired Signal',
    body: 'Training target. Σ junction computes d(n)−y(n). Without d(n) no learning.',
    formula: 'd(n) = 0.98·sin(2π·6·n/N + 0.4)',
    bullets: ['Clean target', 'Phase-shifted', 'No noise'],
    intuition: 'Echo cancellation — d(n) = near-end mic (voice+echo).',
    computed: 'makeSignal(0.06,0.4,202,true)'
  },
  {
    tag: 'Error',
    title: 'Error Signal',
    body: 'Error is the only teaching signal. Large|e|→large update. e→0 means converged.',
    formula: 'e(n)=d(n)−y(n)  →  MSE=E[e²(n)]',
    bullets: ['Teaching signal', 'Error drives update', 'Converges to 0'],
    intuition: 'GPS recalculation — big error = steer hard.',
    computed: 'e computed after each FIR output'
  },
  {
    tag: 'LMS',
    title: 'LMS Update',
    body: 'Stochastic gradient descent on MSE bowl. μ too large → diverge.',
    formula: 'w[k] ← w[k] + μ·e(n)·xv[k]  for k=0…M−1',
    bullets: ['Gradient descent', 'μ step size', 'Simultaneous update'],
    intuition: 'Rolling ball down a bowl — μ is step length.',
    computed: 'All M weights updated simultaneously'
  },
  {
    tag: 'Clean',
    title: 'Converged Output',
    body: 'At convergence y(n)≈d(n), e(n)≈0. Push μ past bound → diverges.',
    formula: 'w*=R⁻¹p  |  MSE_floor=σ²_d−pᵀw*',
    bullets: ['Converged weights', 'MSE minimized', 'Stable'],
    intuition: 'Guitar tuning — small turns=accurate.',
    computed: 'MSE curve plots real e²(n)'
  }
];

export default function InstructionPanel({ stepIndex, isOpen, onClose }) {
  const content = stepsContent[stepIndex];
  return (
    <div
      className="instruction-panel"
      style={{
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span className="ic-tag">{content.tag}</span>
        <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '4px 8px' }}>✕</button>
      </div>
      <div className="ic-title">{content.title}</div>
      <div className="ic-body">{content.body}</div>
      <code className="ic-eq">{content.formula}</code>
      <ul style={{ marginTop: '12px', paddingLeft: '20px', color: '#5b6178', fontSize: '13px' }}>
        {content.bullets.map((b, i) => (
          <li key={i} style={{ marginBottom: '4px' }}>{b}</li>
        ))}
      </ul>
      <div style={{ marginTop: '16px', padding: '10px', background: '#fbf1de', borderRadius: '8px', color: '#c9821a', fontSize: '13px' }}>
        💡 {content.intuition}
      </div>
      <div style={{ marginTop: '12px', padding: '10px', background: '#e8f0fd', borderRadius: '8px', color: '#2e6fdb', fontSize: '13px' }}>
        🔬 {content.computed}
      </div>
    </div>
  );
}
