import { useState } from 'react';
import { ChevronRight, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QUESTIONS = [
    {
        text: "Do you own a home or vehicle you urgently want to keep?",
        options: [
            { text: "Yes, preserving my assets is the top priority.", score: { sheldon: 2, hariette: 0 } },
            { text: "No, or it's not a major concern right now.", score: { sheldon: 0, hariette: 1 } },
        ]
    },
    {
        text: "Are you currently behind on your mortgage or car payments?",
        options: [
            { text: "Yes, and I need a way to catch up without losing them.", score: { sheldon: 2, hariette: 0 } },
            { text: "No, I'm current on secured loans, or I don't have them.", score: { sheldon: 0, hariette: 1 } },
        ]
    },
    {
        text: "Do you have a stable, regular monthly income?",
        options: [
            { text: "Yes, my income is reliable.", score: { sheldon: 1, hariette: 0 } },
            { text: "No, my income fluctuates or is currently limited.", score: { sheldon: 0, hariette: 2 } },
        ]
    },
    {
        text: "Is most of your debt unsecured (like credit cards or medical bills)?",
        options: [
            { text: "Yes, that's what's overwhelming me.", score: { sheldon: 0, hariette: 2 } },
            { text: "I have a mix, or mostly secured debt.", score: { sheldon: 1, hariette: 0 } },
        ]
    },
    {
        text: "Which sounds better to you?",
        options: [
            { text: "A steady, structured 3-5 year plan with court protection.", score: { sheldon: 2, hariette: 0 } },
            { text: "A fast, 90-120 day sprint to a complete clean slate.", score: { sheldon: 0, hariette: 2 } },
        ]
    }
];

export default function Quiz() {
    const navigate = useNavigate();
    const [currentQ, setCurrentQ] = useState(0);
    const [scores, setScores] = useState({ sheldon: 0, hariette: 0 });
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (score) => {
        const newScores = {
            sheldon: scores.sheldon + score.sheldon,
            hariette: scores.hariette + score.hariette
        };

        if (currentQ < QUESTIONS.length - 1) {
            setScores(newScores);
            setCurrentQ(currentQ + 1);
        } else {
            setScores(newScores);
            setShowResult(true);
        }
    };

    const resetQuiz = () => {
        setCurrentQ(0);
        setScores({ sheldon: 0, hariette: 0 });
        setShowResult(false);
    };

    const isSheldon = scores.sheldon >= scores.hariette;

    return (
        <div className="quiz-container glass-card shadow-soft">
            {!showResult ? (
                <div className="quiz-active animate-fade-in">
                    <div className="quiz-header">
                        <h3>Question {currentQ + 1} of {QUESTIONS.length}</h3>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <h2 className="quiz-question">{QUESTIONS[currentQ].text}</h2>

                    <div className="quiz-options">
                        {QUESTIONS[currentQ].options.map((opt, idx) => (
                            <button
                                key={idx}
                                className="quiz-option-btn"
                                onClick={() => handleAnswer(opt.score)}
                            >
                                <span>{opt.text}</span>
                                <ChevronRight size={20} className="option-icon" />
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="quiz-result animate-fade-in">
                    <div className="result-mascot">
                        {isSheldon ? '🐢' : '🐰'}
                    </div>
                    <h2>You might be a {isSheldon ? 'Sheldon' : 'Hariette'}!</h2>
                    <p className="result-desc">
                        {isSheldon
                            ? "Based on your answers, the steady path of Chapter 13 might be your best bet. It offers the protection you need to keep your assets while getting back on track over 3-5 years."
                            : "Based on your answers, the quick sprint of Chapter 7 might be perfect for you. In 90-120 days, you could be completely free of those overwhelming unsecured debts."
                        }
                    </p>

                    <div className="result-actions">
                        <button
                            className={`btn ${isSheldon ? 'btn-turtle' : 'btn-hare'}`}
                            onClick={() => navigate(isSheldon ? '/sheldon' : '/hariette')}
                        >
                            Explore {isSheldon ? "Sheldon's" : "Hariette's"} Path
                        </button>
                        <button className="btn btn-outline" onClick={resetQuiz}>
                            <RefreshCcw size={18} /> Retake Quiz
                        </button>
                    </div>
                </div>
            )
            }

            <style>{`
        .quiz-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2.5rem;
        }
        .quiz-header {
          margin-bottom: 2rem;
        }
        .quiz-header h3 {
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
        .quiz-question {
          font-size: 1.75rem;
          margin-bottom: 2rem;
          line-height: 1.3;
        }
        .quiz-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .quiz-option-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          background: white;
          border: 2px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          font-family: var(--font-body);
          font-size: 1.125rem;
          color: var(--color-text-main);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }
        .quiz-option-btn:hover {
          border-color: var(--color-text-main);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .option-icon {
          color: var(--color-text-muted);
          transition: transform 0.2s ease;
        }
        .quiz-option-btn:hover .option-icon {
          transform: translateX(4px);
          color: var(--color-text-main);
        }
        
        .quiz-result {
          text-align: center;
          padding: 2rem 0;
        }
        .result-mascot {
          font-size: 5rem;
          margin-bottom: 1rem;
          animation: bounce 2s infinite ease-in-out;
        }
        .result-desc {
          max-width: 600px;
          margin: 1.5rem auto 2.5rem;
          font-size: 1.125rem;
          color: var(--color-text-muted);
        }
        .result-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        
        @media (max-width: 576px) {
          .quiz-container { padding: 1.5rem; }
          .quiz-question { font-size: 1.25rem; }
          .quiz-option-btn { padding: 1rem; font-size: 1rem; }
          .result-actions { flex-direction: column; }
        }
      `}</style>
        </div >
    );
}
