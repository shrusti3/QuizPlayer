import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { collection, doc, setDoc, getDocs, query, orderBy } from 'firebase/firestore';

import AnimatedBackground from './components/AnimatedBackground';
import StarfieldBackground from './components/StarfieldBackground';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import ProfileScreen from './components/ProfileScreen';
import AuthScreen from './components/AuthScreen';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [view, setView] = useState('WELCOME'); // 'WELCOME' | 'QUIZ' | 'RESULT' | 'PROFILE' | 'AUTH'
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [finalScore, setFinalScore] = useState(0);
  const [totalQ, setTotalQ] = useState(0);

  // Real Authentication
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [quizHistory, setQuizHistory] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({ 
          uid: currentUser.uid,
          name: currentUser.email.split('@')[0], 
          email: currentUser.email,
          avatar: '🧑‍🚀', 
          joined: 'Today' 
        });
        if (view === 'AUTH') setView('WELCOME');
      } else {
        setUser(null);
        setQuizHistory([]); // clear history on logout
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [view]);

  // Fetch Firestore History
  useEffect(() => {
    if (user?.uid) {
      const fetchHistory = async () => {
        try {
          const q = query(collection(db, "users", user.uid, "quizHistory"), orderBy("date", "asc"));
          const querySnapshot = await getDocs(q);
          const history = [];
          querySnapshot.forEach((doc) => {
            history.push(doc.data());
          });
          setQuizHistory(history);
        } catch (err) {
          console.error("Error fetching history:", err);
        }
      };
      fetchHistory();
    }
  }, [user?.uid]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const startQuiz = (cat) => {
    setSelectedCategory(cat);
    setView('QUIZ');
  };

  const completeQuiz = async (score, total) => {
    setFinalScore(score);
    setTotalQ(total);
    setView('RESULT'); // Show result screen immediately!
    
    // Save to history in Firestore
    if (user) {
      const newEntry = { 
        category: typeof selectedCategory === 'object' ? `${selectedCategory.topic} (AI)` : selectedCategory, 
        score, 
        total,
        date: new Date().toISOString()
      };
      
      const newHistory = [...quizHistory, newEntry];
      setQuizHistory(newHistory);
      
      try {
        await setDoc(doc(db, "users", user.uid, "quizHistory", Date.now().toString()), newEntry);
      } catch (err) {
        console.error("Error saving to Firestore:", err);
      }
    }
  };

  const restartQuiz = () => {
    setView('WELCOME');
    setSelectedCategory(null);
  };

  const handleLoginClick = () => {
    setView('AUTH');
  };

  const handleLogout = () => {
    signOut(auth);
    setView('WELCOME');
  };

  if (authLoading) return <div style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;

  return (
    <div className="app-container">
      {theme === 'dark' ? <StarfieldBackground /> : <AnimatedBackground />}
      
      <div className="top-bar">
        {user ? (
          <>
            <button className="social-btn glass-panel" onClick={() => setView('PROFILE')} style={{ marginRight: '1rem', padding: '0.4rem 1rem' }}>
              {user.avatar} {user.name}
            </button>
            <button className="social-btn glass-panel" onClick={handleLogout} style={{ marginRight: '1rem', padding: '0.4rem 1rem' }}>
              Logout
            </button>
          </>
        ) : (
          <button className="social-btn glass-panel" onClick={handleLoginClick} style={{ marginRight: '1rem' }}>
            Login / Sign Up
          </button>
        )}
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      <main className="main-content">
        {view === 'WELCOME' && <WelcomeScreen onStart={startQuiz} />}
        {view === 'AUTH' && <AuthScreen onBack={restartQuiz} />}
        {view === 'QUIZ' && <QuizScreen category={selectedCategory} onComplete={completeQuiz} />}
        {view === 'RESULT' && <ResultScreen score={finalScore} total={totalQ} onRestart={restartQuiz} />}
        {view === 'PROFILE' && <ProfileScreen user={user} history={quizHistory} onBack={restartQuiz} />}
      </main>
    </div>
  );
}
