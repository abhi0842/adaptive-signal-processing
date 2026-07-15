import { useState } from 'react';
import './App.css';
import Step0_Input from './steps/Step0_Input';
import Step1_FilterOutput from './steps/Step1_FilterOutput';
import Step2_Desired from './steps/Step2_Desired';
import Step3_Error from './steps/Step3_Error';
import Step4_LMS from './steps/Step4_LMS';
import Step5_Clean from './steps/Step5_Clean';
import InstructionPanel from './components/InstructionPanel';

const STEPS = [
  Step0_Input,
  Step1_FilterOutput,
  Step2_Desired,
  Step3_Error,
  Step4_LMS,
  Step5_Clean
];

function App() {
  const [cur, setCur] = useState(0);
  const [instrOpen, setInstrOpen] = useState(false);

  const handleNext = () => {
    if (cur === 5) setCur(0);
    else setCur(cur + 1);
  };

  const handlePrev = () => {
    if (cur > 0) setCur(cur - 1);
  };

  const CurrentStep = STEPS[cur];

  return (
    <div className="app">
      <header className="app-header">
        <h1>Adaptive Signal Processing Simulator</h1>
        <button className="btn btn-ghost" onClick={() => setInstrOpen(!instrOpen)}>
          📋 Instructions
        </button>
      </header>
      <main>
        <CurrentStep cur={cur} onNext={handleNext} onPrev={handlePrev} />
      </main>
      <InstructionPanel
        stepIndex={cur}
        isOpen={instrOpen}
        onClose={() => setInstrOpen(false)}
      />
    </div>
  );
}

export default App;
