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
        style={{ backgroundImage: `url('${activeQuiz.img}')` }} 
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

        <h1 className="spotify-title">Quiz Library</h1>
        
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
          <div 
            className="carousel-track" 
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {safeMetaData.map((quiz, i) => (
              <div key={i} className="carousel-slide">
                <div className="spotify-card glass-panel">
                  <div className="album-art-wrap">
                    <img src={quiz.img} alt={quiz.cat} className="album-art" />
                  </div>
                  
                  <div className="album-info">
                    <h2>{quiz.cat}</h2>
                    <p className="album-desc">{quiz.desc}</p>
                  </div>
                  
                  <div className="spotify-controls">
                    <button className="ctrl-btn secondary-btn" onClick={handlePrev} title="Previous">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                    </button>
                    <button className="ctrl-btn play-btn" onClick={() => onStart(quiz.cat)} title="Play">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="black"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                    <button className="ctrl-btn secondary-btn" onClick={handleNext} title="Next">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="track-scrubber">
          <span className="time-text">0:00</span>
          <div className="scrubber-bar">
             <div className="scrubber-fill" style={{ width: `${(currentIndex / (safeMetaData.length - 1)) * 100}%` }}></div>
          </div>
          <span className="time-text">-15:00</span>
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
