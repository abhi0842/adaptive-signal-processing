export default function AnimControls({ running, onToggle, onReset, speed, onSpeed, extraBtn }) {
  return (
    <div className="anim-controls">
      <button className="btn btn-primary" onClick={onToggle}>
        {running ? '⏸ Pause' : (extraBtn ? '▶ Animate Both' : '▶ Animate')}
      </button>
      <button className="btn btn-secondary btn-sm" onClick={onReset}>
        ↻ Reset
      </button>
      <div className="speed-group">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            className={`speed-btn ${speed === s ? 'active' : ''}`}
            onClick={() => onSpeed(s)}
          >
            {s}×
          </button>
        ))}
      </div>
    </div>
  );
}
