import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFitness } from '../contexts/FitnessContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const { FiPlus, FiActivity, FiClock, FiFire, FiPlay, FiPause, FiStop, FiEdit, FiTrash2 } = FiIcons;

const WorkoutTracker = () => {
  const { workouts, addWorkout, updateWorkout, deleteWorkout } = useFitness();
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [formData, setFormData] = useState({
    type: '',
    duration: '',
    calories: '',
    notes: '',
  });

  // Timer effect
  React.useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (!isRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const handleStartWorkout = (type) => {
    setActiveWorkout({ type, startTime: new Date() });
    setTimer(0);
    setIsRunning(true);
    toast.success(`Started ${type} workout!`);
  };

  const handlePauseWorkout = () => {
    setIsRunning(!isRunning);
    toast.success(isRunning ? 'Workout paused' : 'Workout resumed');
  };

  const handleStopWorkout = () => {
    if (activeWorkout) {
      const duration = Math.floor(timer / 60);
      const estimatedCalories = Math.floor(duration * 8); // Rough estimate
      
      addWorkout({
        type: activeWorkout.type,
        duration,
        calories: estimatedCalories,
        notes: `Completed ${activeWorkout.type} workout`,
      });
      
      setActiveWorkout(null);
      setTimer(0);
      setIsRunning(false);
      toast.success('Workout completed! 🎉');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.type || !formData.duration) {
      toast.error('Please fill in required fields');
      return;
    }

    addWorkout({
      type: formData.type,
      duration: parseInt(formData.duration),
      calories: parseInt(formData.calories) || 0,
      notes: formData.notes,
    });

    setFormData({ type: '', duration: '', calories: '', notes: '' });
    setShowAddForm(false);
    toast.success('Workout added successfully!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      deleteWorkout(id);
      toast.success('Workout deleted');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const workoutTypes = [
    { name: 'Cardio', icon: FiActivity, color: 'from-red-500 to-red-600' },
    { name: 'Strength', icon: FiFire, color: 'from-orange-500 to-orange-600' },
    { name: 'Yoga', icon: FiClock, color: 'from-purple-500 to-purple-600' },
    { name: 'Running', icon: FiPlay, color: 'from-blue-500 to-blue-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Workout Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track your workouts and monitor your progress
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Add Workout</span>
        </Button>
      </div>

      {/* Active Workout Timer */}
      {activeWorkout && (
        <Card gradient className="text-center">
          <h3 className="text-xl font-semibold mb-2">
            {activeWorkout.type} Workout in Progress
          </h3>
          <div className="text-4xl font-bold mb-4">
            {formatTime(timer)}
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              variant="secondary"
              onClick={handlePauseWorkout}
              className="flex items-center space-x-2"
            >
              <SafeIcon icon={isRunning ? FiPause : FiPlay} className="w-5 h-5" />
              <span>{isRunning ? 'Pause' : 'Resume'}</span>
            </Button>
            <Button
              variant="danger"
              onClick={handleStopWorkout}
              className="flex items-center space-x-2"
            >
              <SafeIcon icon={FiStop} className="w-5 h-5" />
              <span>Stop</span>
            </Button>
          </div>
        </Card>
      )}

      {/* Quick Start Workouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {workoutTypes.map((workout, index) => (
          <motion.div
            key={workout.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="text-center cursor-pointer"
              onClick={() => handleStartWorkout(workout.name)}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${workout.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <SafeIcon icon={workout.icon} className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {workout.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Start {workout.name.toLowerCase()} workout
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Workout Form */}
      {showAddForm && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Add Manual Workout
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Workout Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                >
                  <option value="">Select workout type</option>
                  {workoutTypes.map(type => (
                    <option key={type.name} value={type.name}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="30"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Calories Burned
                </label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="200"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="How did it go?"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Add Workout
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Workout History */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Workout History
        </h3>
        <div className="space-y-3">
          {workouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary-500 rounded-lg">
                  <SafeIcon icon={FiActivity} className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    {workout.type}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(parseISO(workout.timestamp), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {workout.duration} min
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Calories</p>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {workout.calories || 0}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(workout.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {workouts.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No workouts recorded yet. Start your first workout!
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default WorkoutTracker;