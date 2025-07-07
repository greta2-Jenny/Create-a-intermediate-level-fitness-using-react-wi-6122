import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import WorkoutTracker from './pages/WorkoutTracker';
import GoalSetting from './pages/GoalSetting';
import Progress from './pages/Progress';
import MoodTracker from './pages/MoodTracker';
import Meditation from './pages/Meditation';
import Journal from './pages/Journal';
import ExerciseLibrary from './pages/ExerciseLibrary';
import Social from './pages/Social';
import { ThemeProvider } from './contexts/ThemeContext';
import { FitnessProvider } from './contexts/FitnessContext';
import LoadingSpinner from './components/ui/LoadingSpinner';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ThemeProvider>
      <FitnessProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar toggleSidebar={toggleSidebar} />
            <div className="flex">
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <main className="flex-1 lg:ml-64 pt-16">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/workout" element={<WorkoutTracker />} />
                    <Route path="/goals" element={<GoalSetting />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/mood" element={<MoodTracker />} />
                    <Route path="/meditation" element={<Meditation />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/exercises" element={<ExerciseLibrary />} />
                    <Route path="/social" element={<Social />} />
                  </Routes>
                </AnimatePresence>
              </main>
            </div>
            <Toaster 
              position="top-right"
              toastOptions={{
                className: 'dark:bg-gray-800 dark:text-white',
                duration: 3000,
              }}
            />
          </div>
        </Router>
      </FitnessProvider>
    </ThemeProvider>
  );
}

export default App;