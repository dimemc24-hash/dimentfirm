import { useState } from 'react';
import { ArrowRight, RefreshCcw, TrendingUp, Car, Home as HomeIcon } from 'lucide-react';
import {
  computeTrajectory,
  type HistoryBucket,
  type SavingsBucket,
  type TrajectoryResult,
  type AxisResult,
} from '../lib/trajectory';

type Step = 'behind' | 'income' | 'history' | 'savings' | 'result';

const STEP_ORDER: Step[] = ['behind', 'income', 'history', 'savings', 'result'];

const SAVINGS_OPTIONS: { value: SavingsBucket; label: string }[] = [
  { value: 'low', label: "Not much extra, realistically" },
  { value: 'mid', label: '$2,000 – $9,999' },
  { value: 'high', label: '$10,000 – $19,999' },
  { value: 'max', label: '$20,000 or more — a full down payment' },
];

const HISTORY_OPTIONS: { value: HistoryBucket; label: string }[] = [
  { value: 'none', label: 'None of these, ever' },
  { value: 'within2', label: 'Within the last 2 years' },
  { value: 'within5', label: '2–5 years ago' },
  { value: 'over5', label: 'More than 5 years ago' },
];

export default function TrajectoryComparator() {
  const [step, setStep] = useState<Step>('behind');
  const [behindOnCar, setBehindOnCar] = useState(false);
  const [behindOnHouse, setBehindOnHouse] = useState(false);
  const [income, setIncome] = useState('');
  const [history, setHistory] = useState<HistoryBucket | null>(null);
  const [result, setResult] = useState<TrajectoryResult | null>(null);

  const stepIndex = STEP_ORDER.indexOf(step);

  const goNext = (next: Step) => setStep(next);

  const finish = (finalHistory: HistoryBucket, finalSavings: SavingsBucket) => {
    const computed = computeTrajectory({
      behindOnCar,
      behindOnHouse,
      monthlyDisposableIncome: Number(income) || 0,
      history: finalHistory,
      savings: finalSavings,
    });
    setResult(computed);
    setStep('result');
  };

  const reset = () => {
    setStep('behind');
    setBehindOnCar(false);
    setBehindOnHouse(false);
    setIncome('');
    setHistory(null);
    setResult(null);
  };

  return (
    <div className="traj-container glass-card shadow-soft">
      {step !== 'result' && (
        <div className="traj-header">
          <h3>Step {stepIndex + 1} of {STEP_ORDER.length - 1}</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(stepIndex / (STEP_ORDER.length - 1)) * 100}%` }} />
          </div>
        </div>
      )}

      {step === 'behind' && (
        <div className="traj-step animate-fade-in">
          <h2 className="traj-question">Are you currently behind on payments for a car or a home?</h2>
          <p className="traj-sub">Check any that apply — or none.</p>
          <div className="traj-checks">
            <label className="traj-check">
              <input type="checkbox" checked={behindOnCar} onChange={e => setBehindOnCar(e.target.checked)} />
              <span>Behind on a car payment</span>
            </label>
            <label className="traj-check">
              <input type="checkbox" checked={behindOnHouse} onChange={e => setBehindOnHouse(e.target.checked)} />
              <span>Behind on a mortgage or rent-to-own home payment</span>
            </label>
          </div>
          <button className="btn btn-turtle traj-next" onClick={() => goNext('income')}>
            Continue <ArrowRight size={18} />
          </button>
        </div>
      )}

      {step === 'income' && (
        <div className="traj-step animate-fade-in">
          <h2 className="traj-question">About how much do you have left over each month after bills and debt payments?</h2>
          <p className="traj-sub">Your best honest estimate is fine — this stays between you and this page.</p>
          <div className="traj-income-input">
            <span className="traj-dollar">$</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="0"
              value={income}
              onChange={e => setIncome(e.target.value)}
              autoFocus
            />
            <span className="traj-per-month">/ month</span>
          </div>
          <button className="btn btn-turtle traj-next" onClick={() => goNext('history')}>
            Continue <ArrowRight size={18} />
          </button>
        </div>
      )}

      {step === 'history' && (
        <div className="traj-step animate-fade-in">
          <h2 className="traj-question">When was your most recent repossession, foreclosure, or court judgment against you — if any?</h2>
          <div className="traj-options">
            {HISTORY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className="traj-option-btn"
                onClick={() => { setHistory(opt.value); goNext('savings'); }}
              >
                <span>{opt.label}</span>
                <ArrowRight size={18} className="option-icon" />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'savings' && (
        <div className="traj-step animate-fade-in">
          <h2 className="traj-question">If nothing changes, how much could you realistically save over the next 2 years?</h2>
          <p className="traj-sub">$20,000 represents a typical 10% down payment in this area.</p>
          <div className="traj-options">
            {SAVINGS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className="traj-option-btn"
                onClick={() => { if (history) finish(history, opt.value); }}
              >
                <span>{opt.label}</span>
                <ArrowRight size={18} className="option-icon" />
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'result' && result && (
        <div className="traj-result animate-fade-in">
          <div className="traj-result-header">
            <TrendingUp size={28} className="traj-result-icon" />
            <h2>Your Current Path vs. Your Path After Bankruptcy</h2>
            <p className="traj-sub">
              This isn't Chapter 7 vs. Chapter 13 — just an honest look at timelines. We'll help you pick the right chapter next.
            </p>
          </div>

          <AxisCard icon={<Car size={22} />} title="Financing a Car" axis={result.car} />
          <AxisCard icon={<HomeIcon size={22} />} title="Buying a Home" axis={result.home} />

          {result.bothCurrentPathHealthy && (
            <p className="traj-honest-note">
              Your current numbers already look solid on paper for both of these. Bankruptcy may still make sense if
              collections, interest, or stress are the real problem — but we're not going to pretend it clearly speeds
              up a car or a house for you specifically.
            </p>
          )}

          <div className="traj-result-actions">
            <a href="#chapter-quiz" className="btn btn-turtle">
              Find out: Chapter 7 or Chapter 13? <ArrowRight size={18} />
            </a>
            <button className="btn btn-outline" onClick={reset}>
              <RefreshCcw size={18} /> Start Over
            </button>
          </div>
        </div>
      )}

      <style>{`
        .traj-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2.5rem;
        }
        .traj-header { margin-bottom: 2rem; }
        .traj-header h3 {
          font-family: var(--font-body);
          font-weight: 600;
          color: var(--color-text-muted);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }
        .progress-bar {
          height: 6px;
          background: var(--color-border);
          border-radius: var(--border-radius-full);
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: var(--color-text-main);
          transition: width 0.3s ease;
        }
        .traj-question {
          font-size: 1.75rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .traj-sub {
          color: var(--color-text-muted);
          margin-bottom: 2rem;
          font-size: 1rem;
        }
        .traj-checks {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .traj-check {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 1.25rem 1.5rem;
          background: white;
          border: 2px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          font-size: 1.05rem;
          cursor: pointer;
        }
        .traj-check input {
          width: 20px;
          height: 20px;
          accent-color: var(--color-turtle-green);
          flex-shrink: 0;
        }
        .traj-income-input {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: white;
          border: 2px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          margin-bottom: 2rem;
        }
        .traj-dollar {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }
        .traj-income-input input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 1.5rem;
          font-family: var(--font-body);
          width: 100%;
        }
        .traj-per-month {
          color: var(--color-text-muted);
          white-space: nowrap;
        }
        .traj-next { width: 100%; justify-content: center; display: flex; align-items: center; gap: 0.5rem; }
        .traj-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .traj-option-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          background: white;
          border: 2px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          font-family: var(--font-body);
          font-size: 1.05rem;
          color: var(--color-text-main);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }
        .traj-option-btn:hover {
          border-color: var(--color-text-main);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .option-icon { color: var(--color-text-muted); transition: transform 0.2s ease; flex-shrink: 0; }
        .traj-option-btn:hover .option-icon { transform: translateX(4px); color: var(--color-text-main); }

        .traj-result-header { text-align: center; margin-bottom: 2rem; }
        .traj-result-icon { color: var(--color-turtle-green); margin-bottom: 0.5rem; }
        .traj-honest-note {
          background: var(--color-background);
          border-radius: var(--border-radius);
          padding: 1.25rem 1.5rem;
          color: var(--color-text-muted);
          font-size: 0.95rem;
          margin-top: 1rem;
        }
        .traj-result-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        @media (max-width: 576px) {
          .traj-container { padding: 1.5rem; }
          .traj-question { font-size: 1.25rem; }
          .traj-result-actions { flex-direction: column; }
          .traj-result-actions a, .traj-result-actions button { justify-content: center; }
        }
      `}</style>
    </div>
  );
}

function AxisCard({ icon, title, axis }: { icon: React.ReactNode; title: string; axis: AxisResult }) {
  const winner = axis.verdict === 'bankruptcy-faster' ? 'bk' : 'current';
  return (
    <div className="axis-card">
      <div className="axis-card-title">
        {icon}
        <h3>{title}</h3>
      </div>
      <div className="axis-columns">
        <div className={`axis-col ${winner === 'current' ? 'axis-col-winner' : ''}`}>
          <span className="axis-col-label">Current Path</span>
          <strong>{axis.currentPathLabel}</strong>
          <p>{axis.currentPathDetail}</p>
        </div>
        <div className={`axis-col ${winner === 'bk' ? 'axis-col-winner' : ''}`}>
          <span className="axis-col-label">After Bankruptcy</span>
          <strong>{axis.bkPathLabel}</strong>
          <p>{axis.bkPathDetail}</p>
        </div>
      </div>
      <style>{`
        .axis-card {
          margin-bottom: 1.5rem;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
        }
        .axis-card-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background: var(--color-background);
          color: var(--color-turtle-shell);
        }
        .axis-card-title h3 { margin: 0; font-size: 1.1rem; }
        .axis-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .axis-col {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .axis-col + .axis-col { border-left: 1px solid var(--color-border); }
        .axis-col-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
          font-weight: 600;
        }
        .axis-col strong { font-size: 1.15rem; }
        .axis-col p { font-size: 0.9rem; color: var(--color-text-muted); margin: 0; }
        .axis-col-winner {
          background: var(--color-turtle-green-light);
        }
        @media (max-width: 576px) {
          .axis-columns { grid-template-columns: 1fr; }
          .axis-col + .axis-col { border-left: none; border-top: 1px solid var(--color-border); }
        }
      `}</style>
    </div>
  );
}
