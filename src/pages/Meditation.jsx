import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFitness } from '../contexts/FitnessContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const { FiPlay, FiPause, FiStop, FiClock, FiHeart, FiSun, FiMoon, FiCloud } = FiIcons;

const Meditation = () => {
  const { meditationSessions, addMeditationSession } = useFitness();
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [selectedType, setSelectedType] = useState('mindfulness');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => {
          if (time === 1) {
            setIsActive(false);
            setIsCompleted(true);
            handleComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const handleStart = () => {
    setTime(selectedDuration * 60);
    setIsActive(true);
    setIsCompleted(false);
    toast.success('Meditation started! 🧘‍♀️');
  };

  const handlePause = () => {
    setIsActive(!isActive);
    toast.success(isActive ? 'Meditation paused' : 'Meditation resumed');
  };

  const handleStop = () => {
    if (time < selectedDuration * 60) {
      const completedMinutes = Math.ceil((selectedDuration * 60 - time) / 60);
      addMeditationSession({
        type: selectedType,
        duration: completedMinutes,
        completed: false,
      });
      toast.success(`Meditation session saved: ${completedMinutes} minutes`);
    }
    setIsActive(false);
    setTime(0);
    setIsCompleted(false);
  };

  const handleComplete = () => {
    addMeditationSession({
      type: selectedType,
      duration: selectedDuration,
      completed: true,
    });
    toast.success('🎉 Meditation completed! Great job!');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const meditationTypes = [
    {
      id: 'mindfulness',
      name: 'Mindfulness',
      description: 'Focus on the present moment',
      icon: FiHeart,
      color: 'from-pink-500 to-pink-600',
    },
    {
      id: 'breathing',
      name: 'Breathing',
      description: 'Deep breathing exercises',
      icon: FiCloud,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'body-scan',
      name: 'Body Scan',
      description: 'Progressive muscle relaxation',
      icon: FiSun,
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'sleep',
      name: 'Sleep',
      description: 'Relaxation for better sleep',
      icon: FiMoon,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const durations = [5, 10, 15, 20, 30, 45, 60];

  // Calculate statistics
  const totalSessions = meditationSessions.length;
  const totalMinutes = meditationSessions.reduce((sum, session) => sum + session.duration, 0);
  const completedSessions = meditationSessions.filter(s => s.completed).length;
  const averageSession = totalSessions > 0 ? totalMinutes / totalSessions : 0;

  const progress = selectedDuration > 0 ? ((selectedDuration * 60 - time) / (selectedDuration * 60)) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Meditation Timer
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Find your inner peace and mindfulness
        </p>
      </div>

      {/* Timer Card */}
      <Card className="text-center">
        <div className="mb-8">
          <div className="relative w-64 h-64 mx-auto mb-6">
            <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="transition-all duration-1000 ease-in-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                  {time > 0 ? formatTime(time) : formatTime(selectedDuration * 60)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {meditationTypes.find(t => t.id === selectedType)?.name}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            {!isActive && time === 0 && (
              <Button onClick={handleStart} className="flex items-center space-x-2">
                <SafeIcon icon={FiPlay} className="w-5 h-5" />
                <span>Start</span>
              </Button>
            )}
            
            {time > 0 && (
              <>
                <Button
                  onClick={handlePause}
                  variant="secondary"
                  className="flex items-center space-x-2"
                >
                  <SafeIcon icon={isActive ? FiPause : FiPlay} className="w-5 h-5" />
                  <span>{isActive ? 'Pause' : 'Resume'}</span>
                </Button>
                <Button
                  onClick={handleStop}
                  variant="danger"
                  className="flex items-center space-x-2"
                >
                  <SafeIcon icon={FiStop} className="w-5 h-5" />
                  <span>Stop</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Duration Selection */}
        {time === 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              Select Duration
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {durations.map(duration => (
                <button
                  key={duration}
                  onClick={() => setSelectedDuration(duration)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedDuration === duration
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {duration} min
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Type Selection */}
        {time === 0 && (
          <div>
            <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              Meditation Type
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meditationTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedType === type.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${type.color}`}>
                      <SafeIcon icon={type.icon} className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-white">
                        {type.name}
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-3xl mb-2">🧘‍♀️</div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
            Total Sessions
          </h4>
          <p className="text-2xl font-bold text-primary-500">
            {totalSessions}
          </p>
        </Card>

        <Card className="text-center">
          <div className="text-3xl mb-2">⏱️</div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
            Total Minutes
          </h4>
          <p className="text-2xl font-bold text-green-500">
            {totalMinutes}
          </p>
        </Card>

        <Card className="text-center">
          <div className="text-3xl mb-2">✅</div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
            Completed
          </h4>
          <p className="text-2xl font-bold text-blue-500">
            {completedSessions}
          </p>
        </Card>

        <Card className="text-center">
          <div className="text-3xl mb-2">📊</div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
            Average Session
          </h4>
          <p className="text-2xl font-bold text-purple-500">
            {averageSession.toFixed(1)} min
          </p>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Recent Meditation Sessions
        </h3>
        <div className="space-y-3">
          {meditationSessions.slice(0, 10).map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="p-2 bg-purple-500 rounded-lg">
                <SafeIcon 
                  icon={meditationTypes.find(t => t.id === session.type)?.icon || FiClock} 
                  className="w-5 h-5 text-white" 
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-800 dark:text-white">
                    {meditationTypes.find(t => t.id === session.type)?.name || session.type}
                  </span>
                  {session.completed && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full text-xs">
                      Completed
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {format(parseISO(session.timestamp), 'MMM dd, yyyy')} • {session.duration} minutes
                </p>
              </div>
            </motion.div>
          ))}
          
          {meditationSessions.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No meditation sessions yet. Start your mindfulness journey today!
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default Meditation;