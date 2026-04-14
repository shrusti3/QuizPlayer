import React, { useState, useEffect } from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [view, setView] = useState('WELCOME'); // 'WELCOME' | 'QUIZ' | 'RESULT'
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [finalScore, setFinalScore] = useState(0);
  const [totalQ, setTotalQ] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const startQuiz = (cat) => {
    setSelectedCategory(cat);
    setView('QUIZ');
  };

  const completeQuiz = (score, total) => {
    setFinalScore(score);
    setTotalQ(total);
    setView('RESULT');
  };

  const restartQuiz = () => {
    setView('WELCOME');
    setSelectedCategory(null);
  };

  return (
    <div className="app-container">
      <AnimatedBackground />
      
      <div className="top-bar">
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <main className="main-content">
        {view === 'WELCOME' && <WelcomeScreen onStart={startQuiz} />}
        {view === 'QUIZ' && <QuizScreen category={selectedCategory} onComplete={completeQuiz} />}
        {view === 'RESULT' && <ResultScreen score={finalScore} total={totalQ} onRestart={restartQuiz} />}
      </main>
    </div>
  );
}
