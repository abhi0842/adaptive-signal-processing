export default function NavRow({ cur, onNext, onPrev }) {
  return (
    <div className="nav-row">
      <button className="btn btn-primary" onClick={cur === 5 ? onNext : onNext}>
        {cur === 5 ? '↻ Start Over' : 'Next →'}
      </button>
      <button
        className="btn btn-ghost"
        onClick={onPrev}
        style={{ visibility: cur === 0 ? 'hidden' : 'visible' }}
      >
        ← Back
      </button>
      <span className="step-counter">Step {cur + 1} of 6</span>
    </div>
  );
}
