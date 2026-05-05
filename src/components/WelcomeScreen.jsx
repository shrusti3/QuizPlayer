import React, { useState, useRef } from 'react';
import { ALL_QUESTIONS } from '../data/questions';

// Beautiful abstract and contextual imagery mapped to each category
const metaData = [
  { cat: "☕ Java", desc: "Master the art of Object-Oriented Programming and Core Java logic.", color: "rgba(59, 130, 246, 0.8)", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80" },
  { cat: "🌍 GK", desc: "Test your worldly knowledge, trivia, and pop-culture facts.", color: "rgba(168, 85, 247, 0.8)", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80" },
  { cat: "🧮 Math", desc: "Crunch numbers, equations, and tricky logical puzzles.", color: "rgba(239, 68, 68, 0.8)", img: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80" },
  { cat: "🔬 Science", desc: "Explore the fundamental laws of physics, chemistry, and biology.", color: "rgba(16, 185, 129, 0.8)", img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80" },
  { cat: "📜 History", desc: "Journey through time, from ancient civilizations to modern wars.", color: "rgba(245, 158, 11, 0.8)", img: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80" },
  { cat: "🗺️ Geography", desc: "Identify countries, capitols, continents, and epic landscapes.", color: "rgba(6, 182, 212, 0.8)", img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80" },
  { cat: "🎬 Movies", desc: "Are you a cinephile? Guess legendary directors, actors, and films.", color: "rgba(236, 72, 153, 0.8)", img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80" },
  { cat: "⚽ Sports", desc: "From grass football to tennis courts, test your athletic knowledge.", color: "rgba(20, 184, 166, 0.8)", img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80" },
  { cat: "🎵 Music", desc: "Pop, Rock, Classical and more. Can you name that tune?", color: "rgba(99, 102, 241, 0.8)", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80" },
  { cat: "💻 Tech", desc: "Gadgets, programming lore, and deep Silicon Valley trivia.", color: "rgba(75, 85, 99, 0.8)", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80" }
];

const safeMetaData = metaData.map(m => m.desc ? m : { ...m, desc: m.cat.desc || m.cat.color || "Trivia challenge!" }); 

// Mock Data for Gamification
const MOCK_LEADERBOARD = [
  { rank: 1, name: "xX_QuizGod_Xx", score: 9800 },
  { rank: 2, name: "TriviaTitan", score: 8450 },
  { rank: 3, name: "BrainApe", score: 7200 },
  { rank: 4, name: "SiriUnleashed", score: 6100 },
  { rank: 5, name: "PlayerOne", score: 5050 }
];

export default function WelcomeScreen({ onStart }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState('Intermediate');

  const activeQuiz = safeMetaData[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % safeMetaData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + safeMetaData.length) % safeMetaData.length);
  };

  const copyInvite = () => {
    navigator.clipboard.writeText("https://mega-quiz-app.com/invite/8a1b9X");
    alert("Invite Link copied to clipboard!");
    setShowInvite(false);
  };

  const handleStartAI = () => {
    if (!aiTopic.trim()) {
      alert("Please enter a topic for the AI to generate!");
      return;
    }
    onStart({ isAI: true, topic: aiTopic, difficulty: aiDifficulty });
  };

  const touchStartX = useRef(null);

  const handleDragStart = (e) => {
    touchStartX.current = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
  };

  const handleDragEnd = (e) => {
    if (touchStartX.current === null) return;
    const upX = e.clientX || (e.changedTouches && e.changedTouches[0] && e.changedTouches[0].clientX);
    if (!upX && upX !== 0) return;
    
    const delta = touchStartX.current - upX;
    
    if (delta > 50) {
      handleNext();
    } else if (delta < -50) {
      handlePrev();
    }
    
    touchStartX.current = null;
  };

  const wheelTimeout = useRef(null);

  const handleWheel = (e) => {
    if (wheelTimeout.current) return;
    
    // Ignore small deltas to prevent oversensitivity, trackpad horizontal swiping causes very rapid deltaX
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      if (e.deltaX > 25) {
        handleNext();
        wheelTimeout.current = setTimeout(() => { wheelTimeout.current = null }, 600); // 600ms transition time cooldown
      } else if (e.deltaX < -25) {
        handlePrev();
        wheelTimeout.current = setTimeout(() => { wheelTimeout.current = null }, 600);
      }
    }
  };

  return (
    <>
      <div 
        className="spotify-dynamic-bg"
        style={{ 
          backgroundImage: `url('${activeQuiz.img}')`,
          backgroundColor: activeQuiz.color,
          backgroundBlendMode: 'overlay'
        }} 
      />

      <div className="spotify-player-container">
        
        {/* Top-Right gamification buttons */}
        <div className="social-actions-bar">
          <button className="social-btn glass-panel" onClick={() => setShowLeaderboard(true)}>
            🏆 Leaderboard
          </button>
          <button className="social-btn glass-panel" onClick={() => setShowInvite(true)}>
            📩 Invite Friends
          </button>
        </div>

        <div className="spotify-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
          <h1 className="y2k-logo">QUIZ CLUB</h1>
        </div>
        
        {/* CAROUSEL VIEWPORT */}
        <div 
          className="carousel-viewport"
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
          onWheel={handleWheel}
          style={{ cursor: 'grab', userSelect: 'none' }}
        >
          {safeMetaData.map((quiz, i) => {
            const length = safeMetaData.length;
            let offset = i - currentIndex;
            
            if (offset > length / 2) offset -= length;
            if (offset < -length / 2) offset += length;
            
            const absOffset = Math.abs(offset);
            const isActive = offset === 0;
            
            const translateX = offset * 160; 
            const translateZ = -absOffset * 300; 
            const rotateY = offset * -25; 
            const scale = isActive ? 1 : 1 - absOffset * 0.05;
            const opacity = absOffset > 2 ? 0 : 1 - absOffset * 0.4;
            const zIndex = 100 - absOffset;
            
            return (
              <div 
                key={i} 
                className="carousel-slide"
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                <div className="spotify-card">
                  <div className="album-art-wrap">
                    <img src={quiz.img} alt={quiz.cat} className="album-art" draggable="false" />
                  </div>
                  
                  <div className="album-info">
                    <h2>{quiz.cat}</h2>
                    <p className="album-desc">{quiz.desc}</p>
                  </div>
                  
                  <div className="spotify-controls">
                    <button className="ctrl-btn play-btn" onClick={() => onStart(quiz.cat)} title="Play">
                      <svg width="24" height="24" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Removed Track Scrubber as 3D visual takes over */}

        {/* AI CUSTOM QUIZ GENERATOR */}
        <div className="ai-generator-section glass-panel" style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '16px', textAlign: 'left' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--brand-cyan)' }}>✨ AI Custom Quiz</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Generate a unique 10-question quiz on any topic!</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="e.g. Java Streams, IPL History" 
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              style={{ flex: '1', padding: '0.8rem', borderRadius: '8px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
            />
            <select 
              value={aiDifficulty}
              onChange={(e) => setAiDifficulty(e.target.value)}
              style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none', cursor: 'pointer' }}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <button className="restart-btn" style={{ margin: 0, padding: '0.8rem 1.5rem' }} onClick={handleStartAI}>
              Generate & Play
            </button>
          </div>
        </div>

      </div>

      {/* POPUP MODALS */}
      {showLeaderboard && (
        <div className="modal-overlay" onClick={() => setShowLeaderboard(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Top Global Players</h2>
              <button className="close-btn" onClick={() => setShowLeaderboard(false)}>✕</button>
            </div>
            <div className="leaderboard-list">
              {MOCK_LEADERBOARD.map(p => (
                <div key={p.rank} className="lb-row">
                  <span className="lb-rank">#{p.rank}</span>
                  <span className="lb-name">{p.name}</span>
                  <span className="lb-score">{p.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showInvite && (
        <div className="modal-overlay" onClick={() => setShowInvite(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Challenge a Friend</h2>
              <button className="close-btn" onClick={() => setShowInvite(false)}>✕</button>
            </div>
            <p style={{marginBottom: '1.5rem', color: 'var(--text-muted)'}}>
              Copy your unique link below and send it to your friends to compete directly on the global leaderboard!
            </p>
            <button className="restart-btn" style={{width: '100%'}} onClick={copyInvite}>
              📋 Copy Match Link
            </button>
          </div>
        </div>
      )}

    </>
  );
}
