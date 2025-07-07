import React from 'react';
import { motion } from 'framer-motion';
import { useFitness } from '../contexts/FitnessContext';
import Card from '../components/ui/Card';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

const { 
  FiActivity, FiTarget, FiHeart, FiClock, FiTrendingUp, 
  FiCalendar, FiFire, FiAward, FiChevronRight 
} = FiIcons;

const Dashboard = () => {
  const { workouts, goals, moodEntries, meditationSessions } = useFitness();

  // Calculate stats
  const totalWorkouts = workouts.length;
  const completedGoals = goals.filter(goal => goal.progress >= 100).length;
  const averageMood = moodEntries.length > 0 
    ? moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length 
    : 0;
  const totalMeditation = meditationSessions.reduce((sum, session) => sum + session.duration, 0);

  // Generate chart data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayWorkouts = workouts.filter(w => w.date === dateStr);
    const dayMood = moodEntries.find(m => m.date === dateStr);
    
    return {
      date: format(date, 'MMM dd'),
      workouts: dayWorkouts.length,
      mood: dayMood ? dayMood.mood : 0,
      calories: dayWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0),
    };
  }).reverse();

  const stats = [
    {
      title: 'Total Workouts',
      value: totalWorkouts,
      icon: FiActivity,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
    },
    {
      title: 'Goals Completed',
      value: completedGoals,
      icon: FiTarget,
      color: 'from-green-500 to-green-600',
      change: '+8%',
    },
    {
      title: 'Average Mood',
      value: averageMood.toFixed(1),
      icon: FiHeart,
      color: 'from-pink-500 to-pink-600',
      change: '+5%',
    },
    {
      title: 'Meditation (min)',
      value: totalMeditation,
      icon: FiClock,
      color: 'from-purple-500 to-purple-600',
      change: '+15%',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-gray-800 dark:text-white mb-2"
        >
          Welcome Back! 💪
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 dark:text-gray-300 text-lg"
        >
          Ready to crush your fitness goals today?
        </motion.p>
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
                    {stat.change} from last week
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workout Trend */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Workout Trend (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={last7Days}>
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
              <Line 
                type="monotone" 
                dataKey="workouts" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Mood Trend */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Mood Trend (Last 7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last7Days}>
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
              <Bar 
                dataKey="mood" 
                fill="url(#moodGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg cursor-pointer border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <SafeIcon icon={FiActivity} className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-800 dark:text-white">
                  Start Workout
                </span>
              </div>
              <SafeIcon icon={FiChevronRight} className="w-5 h-5 text-gray-400" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg cursor-pointer border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <SafeIcon icon={FiTarget} className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-800 dark:text-white">
                  Set New Goal
                </span>
              </div>
              <SafeIcon icon={FiChevronRight} className="w-5 h-5 text-gray-400" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg cursor-pointer border border-purple-200 dark:border-purple-800"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <SafeIcon icon={FiClock} className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-800 dark:text-white">
                  Meditate
                </span>
              </div>
              <SafeIcon icon={FiChevronRight} className="w-5 h-5 text-gray-400" />
            </div>
          </motion.div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {workouts.slice(0, 5).map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="p-2 bg-blue-500 rounded-lg">
                <SafeIcon icon={FiActivity} className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-white">
                  {workout.type} - {workout.duration} minutes
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {format(parseISO(workout.timestamp), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {workout.calories || 0} cal
                </p>
              </div>
            </motion.div>
          ))}
          
          {workouts.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No recent workouts. Start your fitness journey today!
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default Dashboard;