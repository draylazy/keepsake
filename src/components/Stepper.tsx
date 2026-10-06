import React from 'react';

export default function Stepper({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <div className="stepper">
      <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1. Photos</div>
      <div className="line"></div>
      <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2. Style</div>
      <div className="line"></div>
      <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3. Share</div>
      
      <style>{`
        .stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
          font-family: var(--font-heading);
        }
        .step {
          opacity: 0.5;
          transition: opacity 0.3s;
        }
        .step.active {
          opacity: 1;
          color: var(--accent-gold);
        }
        .line {
          height: 1px;
          width: 30px;
          background-color: var(--line-color);
        }
      `}</style>
    </div>
  );
}
