import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';

const FitnessContext = createContext();

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};

export const FitnessProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [moodEntries, setMoodEntries] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [meditationSessions, setMeditationSessions] = useState([]);
  const [reminders, setReminders] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedWorkouts = localStorage.getItem('fitness-workouts');
        const savedGoals = localStorage.getItem('fitness-goals');
        const savedMoodEntries = localStorage.getItem('fitness-mood');
        const savedJournalEntries = localStorage.getItem('fitness-journal');
        const savedMeditationSessions = localStorage.getItem('fitness-meditation');
        const savedReminders = localStorage.getItem('fitness-reminders');

        if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
        if (savedGoals) setGoals(JSON.parse(savedGoals));
        if (savedMoodEntries) setMoodEntries(JSON.parse(savedMoodEntries));
        if (savedJournalEntries) setJournalEntries(JSON.parse(savedJournalEntries));
        if (savedMeditationSessions) setMeditationSessions(JSON.parse(savedMeditationSessions));
        if (savedReminders) setReminders(JSON.parse(savedReminders));
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('fitness-workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('fitness-goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('fitness-mood', JSON.stringify(moodEntries));
  }, [moodEntries]);

  useEffect(() => {
    localStorage.setItem('fitness-journal', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('fitness-meditation', JSON.stringify(meditationSessions));
  }, [meditationSessions]);

  useEffect(() => {
    localStorage.setItem('fitness-reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Workout functions
  const addWorkout = (workout) => {
    const newWorkout = {
      id: Date.now(),
      date: format(new Date(), 'yyyy-MM-dd'),
      timestamp: new Date().toISOString(),
      ...workout
    };
    setWorkouts(prev => [newWorkout, ...prev]);
  };

  const updateWorkout = (id, updates) => {
    setWorkouts(prev => prev.map(workout => 
      workout.id === id ? { ...workout, ...updates } : workout
    ));
  };

  const deleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id));
  };

  // Goal functions
  const addGoal = (goal) => {
    const newGoal = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      progress: 0,
      ...goal
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const updateGoal = (id, updates) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  // Mood functions
  const addMoodEntry = (mood) => {
    const newMoodEntry = {
      id: Date.now(),
      date: format(new Date(), 'yyyy-MM-dd'),
      timestamp: new Date().toISOString(),
      ...mood
    };
    setMoodEntries(prev => [newMoodEntry, ...prev]);
  };

  // Journal functions
  const addJournalEntry = (entry) => {
    const newJournalEntry = {
      id: Date.now(),
      date: format(new Date(), 'yyyy-MM-dd'),
      timestamp: new Date().toISOString(),
      ...entry
    };
    setJournalEntries(prev => [newJournalEntry, ...prev]);
  };

  const updateJournalEntry = (id, updates) => {
    setJournalEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, ...updates } : entry
    ));
  };

  const deleteJournalEntry = (id) => {
    setJournalEntries(prev => prev.filter(entry => entry.id !== id));
  };

  // Meditation functions
  const addMeditationSession = (session) => {
    const newSession = {
      id: Date.now(),
      date: format(new Date(), 'yyyy-MM-dd'),
      timestamp: new Date().toISOString(),
      ...session
    };
    setMeditationSessions(prev => [newSession, ...prev]);
  };

  // Reminder functions
  const addReminder = (reminder) => {
    const newReminder = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...reminder
    };
    setReminders(prev => [newReminder, ...prev]);
  };

  const updateReminder = (id, updates) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, ...updates } : reminder
    ));
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const value = {
    // State
    workouts,
    goals,
    moodEntries,
    journalEntries,
    meditationSessions,
    reminders,
    
    // Actions
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addGoal,
    updateGoal,
    deleteGoal,
    addMoodEntry,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    addMeditationSession,
    addReminder,
    updateReminder,
    deleteReminder,
  };

  return (
    <FitnessContext.Provider value={value}>
      {children}
    </FitnessContext.Provider>
  );
};