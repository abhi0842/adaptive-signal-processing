export default function BlockDiagram({ stepIndex }) {
  const getColor = (step) => {
    if (stepIndex === step) {
      return {
        0: { fill: '#2e6fdb', text: '#fff', arrow: '#2e6fdb' },
        1: { fill: 'transparent', text: '#1c2030', arrow: '#2e6fdb' },
        2: { fill: '#1aa672', text: '#fff', arrow: '#1aa672' },
        3: { fill: 'transparent', text: '#1c2030', arrow: '#e0494a' },
        4: { fill: '#fbf1de', text: '#c9821a', arrow: '#c9821a' },
        5: { fill: '#e4f7ef', text: '#1aa672', arrow: '#1aa672' }
      }[stepIndex];
    }
    return { fill: 'transparent', text: '#8a90a6', arrow: '#c8cdda' };
  };

  const c0 = getColor(0);
  const c1 = getColor(1);
  const c2 = getColor(2);
  const c3 = getColor(3);
  const c4 = getColor(4);
  const c5 = getColor(5);

  return (
    <svg viewBox="0 0 680 190" className="block-diagram">
      {/* x(n) arrow */}
      <line x1="20" y1="95" x2="130" y2="95" stroke={c0.arrow} strokeWidth={stepIndex===0?2.6:1.5} strokeDasharray={stepIndex===0?"":"4 4"} />
      <polygon points="130,95 122,91 122,99" fill={c0.arrow} />
      <text x="40" y="85" fill={c0.text} fontSize="12" fontFamily="sans-serif">x(n)</text>

      {/* Adaptive Filter block */}
      <rect x="140" y="60" width="140" height="70" rx="8" fill={stepIndex===0?c0.fill:stepIndex===4?c4.fill:stepIndex===5?c5.fill:'transparent'} stroke={stepIndex===0?'#2e6fdb':stepIndex===4?'#c9821a':stepIndex===5?'#1aa672':'#c8cdda'} strokeWidth={2} />
      <text x="210" y="100" fill={stepIndex===0?'#fff':stepIndex===4?'#c9821a':stepIndex===5?'#1aa672':'#5b6178'} fontSize="12" fontFamily="sans-serif" textAnchor="middle">
        {stepIndex===4 ? 'w←w+μ·e·x' : 'Adaptive Filter'}
      </text>

      {/* y(n) arrow */}
      <line x1="280" y1="95" x2="370" y2="95" stroke={stepIndex===1?c1.arrow:stepIndex===5?c5.arrow:'#c8cdda'} strokeWidth={stepIndex===1||stepIndex===5?2.6:1.5} />
      <polygon points="370,95 362,91 362,99" fill={stepIndex===1?c1.arrow:stepIndex===5?c5.arrow:'#c8cdda'} />
      <text x="300" y="85" fill={stepIndex===1||stepIndex===5?c1.text:'#8a90a6'} fontSize="12" fontFamily="sans-serif">y(n)</text>

      {/* Σ circle */}
      <circle cx="390" cy="95" r="22" fill={stepIndex===2?c2.fill:stepIndex===5?c5.fill:'transparent'} stroke={stepIndex===2||stepIndex===5?'#1aa672':'#c8cdda'} strokeWidth={2} />
      <text x="390" y="100" fill={stepIndex===2||stepIndex===5?'#fff':'#5b6178'} fontSize="16" fontFamily="sans-serif" textAnchor="middle">Σ</text>

      {/* d(n) arrow */}
      <line x1="650" y1="95" x2="412" y2="95" stroke={stepIndex===2?c2.arrow:stepIndex===5?c5.arrow:'#c8cdda'} strokeWidth={stepIndex===2||stepIndex===5?2.6:1.5} />
      <polygon points="412,95 420,91 420,99" fill={stepIndex===2?c2.arrow:stepIndex===5?c5.arrow:'#c8cdda'} />
      <text x="600" y="85" fill={stepIndex===2||stepIndex===5?c2.text:'#8a90a6'} fontSize="12" fontFamily="sans-serif">d(n)</text>

      {/* e(n) path */}
      <path d="M390 117 L390 150 L200 150" stroke={stepIndex===3?c3.arrow:stepIndex===4?c4.arrow:stepIndex===5?c5.arrow:'#c8cdda'} strokeWidth={stepIndex===3||stepIndex===4||stepIndex===5?2.6:1.5} fill="none" />
      <polygon points="200,150 208,146 208,154" fill={stepIndex===3?c3.arrow:stepIndex===4?c4.arrow:stepIndex===5?c5.arrow:'#c8cdda'} />
      <text x="280" y="168" fill={stepIndex===3?'#e0494a':stepIndex===4?'#c9821a':stepIndex===5?'#1aa672':'#8a90a6'} fontSize="12" fontFamily="sans-serif">
        {stepIndex===5?'e(n)≈0':'e(n)=d(n)−y(n)'}
      </text>
    </svg>
  );
}
