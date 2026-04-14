import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import RainEffect from './RainEffect';
import { ALL_QUESTIONS } from '../data/questions';

export default function QuizScreen({ category, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedIdx, setSelectedIdx] = useState(null);
  
  // Gamification overlays
  const [showRain, setShowRain] = useState(false);
  const [lifelineUsed, setLifelineUsed] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState([]); 

  // Realistic SFX (Silenced per user request)
  const playSound = (type) => {
    // Audio engine muted currently
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#06b6d4', '#ec4899', '#fce7f3']
    });
  };

  useEffect(() => {
    const shuffled = [...ALL_QUESTIONS[category]].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
  }, [category]);

  const q = questions[currentQ];

  useEffect(() => {
    if (!q || selectedIdx !== null) return;
    if (timeLeft <= 0) {
      playSound('wrong');
      setShowRain(true);
      handleAnswer(-1); // Timeout
      return;
    }
    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, q, selectedIdx]);

  const handleLifeline = () => {
    if (lifelineUsed || selectedIdx !== null) return;
    
    let wrongIndices = [];
    q.options.forEach((_, i) => {
      if (i !== q.a) wrongIndices.push(i);
    });
    
    wrongIndices.sort(() => Math.random() - 0.5);
    setDisabledOptions([wrongIndices[0], wrongIndices[1]]);
    setLifelineUsed(true);
  };

  const handleAnswer = (idx) => {
    if (selectedIdx !== null) return; 
    
    setSelectedIdx(idx);
    const isCorrect = idx === q.a;
    
    if (idx !== -1) {
      if (isCorrect) {
        playSound('correct');
        triggerConfetti();
        setScore(prev => prev + 1);
      } else {
        playSound('wrong');
        setShowRain(true);
      }
    }
    
    // Hold evaluation screen momentarily
    setTimeout(() => {
      setShowRain(false);
      if (currentQ + 1 >= questions.length) {
        onComplete(score + (isCorrect ? 1 : 0), questions.length);
      } else {
        setCurrentQ(prev => prev + 1);
        setSelectedIdx(null);
        setDisabledOptions([]); 
        setTimeLeft(15);
      }
    }, 2000); // 2 second pause to appreciate the animation/boos
  };

  if (!q) return null;

  const progPct = (timeLeft / 15) * 100;
  const barColor = timeLeft <= 5 ? 'var(--timer-warn)' : 'var(--brand-cyan)';

  return (
    <>
      <div className="quiz-wrapper">
        <div className="quiz-header">
          <div className="category-badge scale-up">{category}</div>
          
          <button 
            className={`lifeline-btn ${lifelineUsed ? 'used' : ''}`}
            onClick={handleLifeline}
            disabled={lifelineUsed || selectedIdx !== null}
          >
            🪄 50/50 Hint
          </button>
          
          <div className="score-badge">Score: {score}</div>
        </div>

        <div className="timer-area">
          <div className="timer-text" style={{ color: barColor }}>Time Left: {timeLeft}s</div>
          <div className="timer-bar-bg">
            <div 
              className="timer-bar-fill" 
              style={{ width: `${progPct}%`, backgroundColor: barColor }}
            />
          </div>
        </div>

        <div className="q-card glass-panel">
          <div style={{ color: 'var(--brand-cyan)', fontWeight: 600, marginBottom: '1rem' }}>
            Question {currentQ + 1} / {questions.length}
          </div>
          <h2>{q.q}</h2>
        </div>

        <div className="options-grid">
          {q.options.map((opt, i) => {
            const isDisabled = disabledOptions.includes(i);
            let btnClass = 'opt-btn glass-panel';
            
            if (isDisabled) {
               btnClass += ' opt-disabled';
            } else if (selectedIdx !== null) {
               if (i === q.a) btnClass += ' opt-correct';
               else if (i === selectedIdx) btnClass += ' opt-wrong';
            }
            
            return (
              <button 
                key={i} 
                className={btnClass}
                onClick={() => handleAnswer(i)}
                disabled={selectedIdx !== null || isDisabled}
              >
                {isDisabled ? <span style={{opacity: 0.3, textDecoration: 'line-through'}}>{opt}</span> : opt}
              </button>
            );
          })}
        </div>
      </div>
      
      {showRain && <RainEffect />}
    </>
  );
}
