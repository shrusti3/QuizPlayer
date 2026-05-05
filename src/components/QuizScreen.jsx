import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import RainEffect from './RainEffect';
import { ALL_QUESTIONS } from '../data/questions';
import { generateQuiz } from '../services/ai';

export default function QuizScreen({ category, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [loading, setLoading] = useState(typeof category === 'object' && category.isAI);
  const [error, setError] = useState(null);
  
  // Gamification overlays
  const [showRain, setShowRain] = useState(false);
  const [lifelineUsed, setLifelineUsed] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState([]); 
  
  // Streak System
  const [streak, setStreak] = useState(0);
  const [streakBadge, setStreakBadge] = useState(null);

  // Realistic SFX (Silenced per user request)
  const playSound = (type) => {
    // Audio engine muted currently
  };

  const triggerConfetti = (amount = 150) => {
    confetti({
      particleCount: amount,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#06b6d4', '#ec4899', '#fce7f3']
    });
  };

  useEffect(() => {
    if (typeof category === 'object' && category.isAI) {
      setLoading(true);
      generateQuiz(category.topic, category.difficulty)
        .then(data => {
          setQuestions(data);
          setLoading(false);
        })
        .catch(err => {
          console.warn("AI Error:", err);
          let friendlyError = "The AI is currently out of credits or experiencing high demand. Please try again in a minute!";
          if (err.message && (err.message.includes('Quota') || err.message.includes('429'))) {
             friendlyError = "Free Tier Quota Exceeded! Please wait 60 seconds before generating another AI quiz.";
          }
          setError(friendlyError);
          setLoading(false);
        });
    } else {
      const shuffled = [...ALL_QUESTIONS[category]].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
    }
  }, [category]);

  const q = questions[currentQ];

  useEffect(() => {
    if (loading || error || !q || selectedIdx !== null) return;
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
        setScore(prev => prev + 1);
        
        const newStreak = streak + 1;
        setStreak(newStreak);
        
        if (newStreak === 5 || newStreak === 10) {
          setStreakBadge(newStreak);
          triggerConfetti(300); // Massive confetti for streak
          setTimeout(() => setStreakBadge(null), 3000);
        } else {
          triggerConfetti(50);
        }
      } else {
        playSound('wrong');
        setStreak(0); // Break streak
        setShowRain(true);
        setTimeout(() => setShowRain(false), 2000);
      }
    } else {
      setStreak(0); // Break streak on timeout
    }
  };

  const handleNext = () => {
    if (currentQ + 1 >= questions.length) {
      onComplete(score, questions.length);
    } else {
      setCurrentQ(prev => prev + 1);
      setSelectedIdx(null);
      setDisabledOptions([]); 
      setTimeLeft(15);
    }
  };

  if (loading) {
    return (
      <div className="quiz-wrapper" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <h2 style={{ color: 'var(--brand-cyan)' }}>🤖 AI is cooking your questions...</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Generating {category.difficulty} questions about {category.topic}</p>
        <div className="spinner" style={{ marginTop: '2rem', width: '50px', height: '50px', border: '5px solid rgba(255,255,255,0.1)', borderTop: '5px solid var(--brand-cyan)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-wrapper" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--timer-warn)' }}>⚠️ Error Generating Quiz</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem', maxWidth: '400px' }}>{error}</p>
        <button className="restart-btn" style={{ marginTop: '2rem' }} onClick={() => window.location.reload()}>Go Back</button>
      </div>
    );
  }

  if (!q) return null;

  const progPct = (timeLeft / 15) * 100;
  const barColor = timeLeft <= 5 ? 'var(--timer-warn)' : 'var(--brand-cyan)';
  
  const displayCategory = typeof category === 'object' ? `${category.topic} (AI)` : category;

  return (
    <>
      <div className="quiz-wrapper">
        <div className="quiz-header">
          <div className="category-badge scale-up">{displayCategory}</div>
          
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

        {selectedIdx !== null && (
          <div className="explanation-card glass-panel" style={{ marginTop: '1.5rem', animation: 'fadeInUp 0.5s ease', textAlign: 'left', padding: '1.5rem' }}>
            <h3 style={{ color: selectedIdx === q.a ? 'var(--opt-correct)' : 'var(--opt-wrong)', marginBottom: '0.5rem' }}>
              {selectedIdx === q.a ? '✅ Correct!' : '❌ Incorrect!'}
            </h3>
            {q.explanation && (
              <p style={{ color: 'var(--text-main)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                <strong style={{ color: 'var(--brand-cyan)' }}>Explanation:</strong> {q.explanation}
              </p>
            )}
            <button className="restart-btn" style={{ width: '100%', margin: 0 }} onClick={handleNext}>
              {currentQ + 1 >= questions.length ? 'See Results' : 'Next Question ➡️'}
            </button>
          </div>
        )}
      </div>
      
      {showRain && <RainEffect />}
      
      {streakBadge && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'var(--brand-primary)', color: 'white', padding: '2rem 4rem',
          borderRadius: '30px', zIndex: 10000, textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          animation: 'scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔥</div>
          <h2 style={{ fontSize: '3rem', margin: 0, fontFamily: 'Space Grotesk' }}>{streakBadge} IN A ROW!</h2>
          <p style={{ fontSize: '1.2rem', marginTop: '1rem', opacity: 0.9 }}>Unstoppable!</p>
        </div>
      )}
    </>
  );
}
