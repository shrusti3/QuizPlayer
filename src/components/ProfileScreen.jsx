import React from 'react';

export default function ProfileScreen({ user, history, onBack }) {
  const totalTaken = history.length;
  
  // Calculate average score (normalized to percentage if totals differ, or just average raw score)
  // Let's normalize to percentage
  const avgScorePct = totalTaken === 0 ? 0 : 
    history.reduce((acc, curr) => acc + (curr.score / curr.total), 0) / totalTaken * 100;

  // For the graph, let's take the last 10 quizzes
  const graphData = history.slice(-10);
  
  // SVG Graph parameters
  const svgWidth = 600;
  const svgHeight = 200;
  const padding = 20;
  
  // Calculate points
  const points = graphData.map((quiz, i) => {
    const x = padding + (i * ((svgWidth - padding * 2) / Math.max(graphData.length - 1, 1)));
    const y = svgHeight - padding - ((quiz.score / quiz.total) * (svgHeight - padding * 2));
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="profile-wrapper" style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="secondary-btn glass-panel" onClick={onBack} style={{ padding: '0.5rem 1rem', borderRadius: '8px', color: 'var(--text-light)' }}>
          ← Back
        </button>
        <h2 style={{ color: 'var(--brand-primary)', fontFamily: 'Space Grotesk' }}>Dashboard</h2>
        <div style={{ width: '70px' }}></div> {/* Spacer */}
      </div>

      {/* User Card */}
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ fontSize: '4rem', background: 'var(--bg-grad1)', borderRadius: '50%', width: '100px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {user?.avatar || '👤'}
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>{user?.name || 'Guest'}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Joined {user?.joined || 'Recently'}</p>
        </div>
        
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: '2rem', fontFamily: 'Space Grotesk', color: 'var(--brand-primary)' }}>{totalTaken}</div>
          <div style={{ color: 'var(--text-muted)' }}>Quizzes Taken</div>
          <div style={{ fontSize: '2rem', fontFamily: 'Space Grotesk', color: 'var(--opt-correct)', marginTop: '0.5rem' }}>{avgScorePct.toFixed(1)}%</div>
          <div style={{ color: 'var(--text-muted)' }}>Avg Score</div>
        </div>
      </div>

      {/* Progress Graph */}
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--brand-secondary)' }}>📈 Performance Tracking</h3>
        {graphData.length < 2 ? (
          <p style={{ color: 'var(--text-muted)' }}>Take a few more quizzes to unlock your performance graph!</p>
        ) : (
          <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
            <svg width={svgWidth} height={svgHeight} style={{ filter: 'drop-shadow(0 0 10px var(--brand-primary))' }}>
              <polyline 
                fill="none" 
                stroke="var(--brand-primary)" 
                strokeWidth="4" 
                points={points} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              {graphData.map((quiz, i) => {
                const x = padding + (i * ((svgWidth - padding * 2) / Math.max(graphData.length - 1, 1)));
                const y = svgHeight - padding - ((quiz.score / quiz.total) * (svgHeight - padding * 2));
                return (
                  <circle key={i} cx={x} cy={y} r="6" fill="var(--bg-grad1)" stroke="var(--brand-primary)" strokeWidth="3" />
                );
              })}
            </svg>
          </div>
        )}
      </div>

      {/* History List */}
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--brand-secondary)' }}>🕒 Recent History</h3>
        {graphData.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No quizzes taken yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {graphData.slice().reverse().map((q, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <span style={{ fontWeight: 600 }}>{q.category}</span>
                <span style={{ fontFamily: 'Space Grotesk', color: (q.score/q.total) >= 0.5 ? 'var(--opt-correct)' : 'var(--timer-warn)' }}>
                  {q.score} / {q.total}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
