export default function WeightBars({ weights }) {
  const mx = Math.max(...weights.map(Math.abs), 0.05);
  return (
    <div className="weights-bars">
      {weights.map((w, i) => (
        <div
          key={i}
          className={`wbar ${w < 0 ? 'neg' : ''}`}
          style={{ height: `${Math.max(4, (Math.abs(w) / mx) * 100)}%` }}
        />
      ))}
    </div>
  );
}
