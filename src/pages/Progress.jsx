import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFitness } from '../contexts/FitnessContext';
import Card from '../components/ui/Card';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

const { FiTrendingUp, FiActivity, FiTarget, FiCalendar, FiAward, FiHeart, FiClock } = FiIcons;

const Progress = () => {
  const { workouts, goals, moodEntries, meditationSessions } = useFitness();
  const [timeRange, setTimeRange] = useState('week');

  // Generate date range based on selection
  const getDateRange = () => {
    const now = new Date();
    switch (timeRange) {
      case 'week':
        return eachDayOfInterval({
          start: startOfWeek(now),
          end: endOfWeek(now)
        });
      case 'month':
        return Array.from({ length: 30 }, (_, i) => subDays(now, i)).reverse();
      case 'year':
        return Array.from({ length: 12 }, (_, i) => {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          return date;
        }).reverse();
      default:
        return [];
    }
  };

  const dates = getDateRange();

  // Prepare chart data
  const chartData = dates.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayWorkouts = workouts.filter(w => w.date === dateStr);
    const dayMood = moodEntries.find(m => m.date === dateStr);
    const dayMeditation = meditationSessions.filter(m => m.date === dateStr);
    
    return {
      date: timeRange === 'year' ? format(date, 'MMM yyyy') : format(date, 'MMM dd'),
      workouts: dayWorkouts.length,
      calories: dayWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0),
      mood: dayMood ? dayMood.mood : 0,
      meditation: dayMeditation.reduce((sum, m) => sum + m.duration, 0),
    };
  });

  // Workout type distribution
  const workoutTypes = workouts.reduce((acc, workout) => {
    acc[workout.type] = (acc[workout.type] || 0) + 1;
    return acc;
  }, {});

  const workoutDistribution = Object.entries(workoutTypes).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  // Goal completion stats
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.progress >= 100).length;
  const inProgressGoals = goals.filter(g => g.progress > 0 && g.progress < 100).length;
  const notStartedGoals = goals.filter(g => g.progress === 0).length;

  const goalStats = [
    { name: 'Completed', value: completedGoals, color: '#10B981' },
    { name: 'In Progress', value: inProgressGoals, color: '#F59E0B' },
    { name: 'Not Started', value: notStartedGoals, color: '#EF4444' },
  ];

  // Calculate streaks
  const calculateWorkoutStreak = () => {
    if (workouts.length === 0) return 0;
    
    const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    let currentDate = new Date();
    
    for (const workout of sortedWorkouts) {
      const workoutDate = new Date(workout.date);
      const diffDays = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= streak + 1) {
        streak++;
        currentDate = workoutDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const workoutStreak = calculateWorkoutStreak();

  // Stats cards data
  const stats = [
    {
      title: 'Total Workouts',
      value: workouts.length,
      icon: FiActivity,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
    },
    {
      title: 'Workout Streak',
      value: `${workoutStreak} days`,
      icon: FiTrendingUp,
      color: 'from-green-500 to-green-600',
      change: '+2 days',
    },
    {
      title: 'Goals Completed',
      value: `${completedGoals}/${totalGoals}`,
      icon: FiTarget,
      color: 'from-purple-500 to-purple-600',
      change: `${Math.round((completedGoals / totalGoals) * 100) || 0}%`,
    },
    {
      title: 'Total Meditation',
      value: `${meditationSessions.reduce((sum, s) => sum + s.duration, 0)} min`,
      icon: FiClock,
      color: 'from-indigo-500 to-indigo-600',
      change: '+25%',
    },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

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
            Progress Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Visualize your fitness journey and achievements
          </p>
        </div>
        
        <div className="flex space-x-2">
          {['week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-500 mt-1">
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                  <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workout Activity Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Workout Activity
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                className="text-gray-600 dark:text-gray-300"
              />
              <YAxis className="text-gray-600 dark:text-gray-300" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Area
                type="monotone"
                dataKey="workouts"
                stroke="#3B82F6"
                fill="url(#workoutGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="workoutGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Calories Burned Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Calories Burned
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                className="text-gray-600 dark:text-gray-300"
              />
              <YAxis className="text-gray-600 dark:text-gray-300" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Bar 
                dataKey="calories" 
                fill="url(#calorieGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="calorieGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Mood Trend Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Mood Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                className="text-gray-600 dark:text-gray-300"
              />
              <YAxis 
                domain={[0, 10]}
                className="text-gray-600 dark:text-gray-300" 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#EC4899" 
                strokeWidth={3}
                dot={{ fill: '#EC4899', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Workout Distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Workout Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={workoutDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {workoutDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Goal Progress */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Goal Progress Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goalStats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={stat.color}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(stat.value / totalGoals) * 251.2} 251.2`}
                    className="transition-all duration-300 ease-in-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">
                    {stat.value}
                  </span>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                {stat.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {totalGoals > 0 ? Math.round((stat.value / totalGoals) * 100) : 0}% of total goals
              </p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Achievements */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Recent Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workoutStreak >= 7 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <SafeIcon icon={FiAward} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Week Warrior
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {workoutStreak} day workout streak!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          
          {completedGoals > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-800"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <SafeIcon icon={FiTarget} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Goal Crusher
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {completedGoals} goals completed!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          
          {workouts.length >= 10 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <SafeIcon icon={FiActivity} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white">
                    Fitness Enthusiast
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {workouts.length} workouts completed!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default Progress;