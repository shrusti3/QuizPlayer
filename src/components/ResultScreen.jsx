import React from 'react';

export default function ResultScreen({ score, total, onRestart }) {
  let emoji, grade;
  
  if (score >= 9)      { emoji = "🏆"; grade = "GENIUS!"; }
  else if (score >= 7) { emoji = "🎯"; grade = "EXCELLENT!"; }
  else if (score >= 5) { emoji = "👍"; grade = "GOOD JOB!"; }
  else if (score >= 3) { emoji = "😅"; grade = "KEEP TRYING!"; }
  else                 { emoji = "💀"; grade = "OOPS!"; }

  return (
    <div className="result-card glass-panel">
      <div className="emoji-huge">{emoji}</div>
      <div className="grade-text">{grade}</div>
      <div className="score-text">You scored {score} / {total}</div>
      <button className="restart-btn" onClick={onRestart}>
        ↺ Play Again
      </button>
    </div>
  );
}
