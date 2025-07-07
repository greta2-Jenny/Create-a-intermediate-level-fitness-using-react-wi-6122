import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFitness } from '../contexts/FitnessContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format, parseISO, subDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const { FiHeart, FiSmile, FiFrown, FiMeh, FiSun, FiCloud, FiCloudRain, FiCalendar } = FiIcons;

const MoodTracker = () => {
  const { moodEntries, addMoodEntry } = useFitness();
  const [selectedMood, setSelectedMood] = useState(5);
  const [moodNote, setMoodNote] = useState('');
  const [selectedFactors, setSelectedFactors] = useState([]);

  const moodEmojis = {
    1: '😢',
    2: '😞',
    3: '😐',
    4: '😊',
    5: '😄',
    6: '😁',
    7: '😍',
    8: '🤩',
    9: '🥳',
    10: '🚀'
  };

  const moodLabels = {
    1: 'Terrible',
    2: 'Bad',
    3: 'Poor',
    4: 'Okay',
    5: 'Good',
    6: 'Great',
    7: 'Amazing',
    8: 'Fantastic',
    9: 'Incredible',
    10: 'Perfect'
  };

  const moodFactors = [
    { id: 'exercise', label: 'Exercise', icon: FiHeart },
    { id: 'sleep', label: 'Sleep Quality', icon: FiSun },
    { id: 'stress', label: 'Stress Level', icon: FiCloud },
    { id: 'social', label: 'Social Time', icon: FiSmile },
    { id: 'work', label: 'Work/Study', icon: FiCalendar },
    { id: 'weather', label: 'Weather', icon: FiCloudRain },
  ];

  const handleFactorToggle = (factorId) => {
    setSelectedFactors(prev => 
      prev.includes(factorId) 
        ? prev.filter(f => f !== factorId)
        : [...prev, factorId]
    );
  };

  const handleSubmit = () => {
    if (selectedMood < 1 || selectedMood > 10) {
      toast.error('Please select a mood level');
      return;
    }

    addMoodEntry({
      mood: selectedMood,
      note: moodNote,
      factors: selectedFactors,
    });

    setSelectedMood(5);
    setMoodNote('');
    setSelectedFactors([]);
    toast.success('Mood entry added successfully!');
  };

  // Generate chart data for the last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const moodEntry = moodEntries.find(m => m.date === dateStr);
    
    return {
      date: format(date, 'MMM dd'),
      mood: moodEntry ? moodEntry.mood : null,
    };
  }).reverse();

  // Calculate mood statistics
  const averageMood = moodEntries.length > 0 
    ? moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length 
    : 0;

  const moodTrend = moodEntries.length >= 2 
    ? moodEntries[0].mood - moodEntries[1].mood 
    : 0;

  const bestMood = moodEntries.length > 0 
    ? Math.max(...moodEntries.map(m => m.mood)) 
    : 0;

  const worstMood = moodEntries.length > 0 
    ? Math.min(...moodEntries.map(m => m.mood)) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Mood Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Track your daily mood and discover patterns
        </p>
      </div>

      {/* Today's Mood Entry */}
      <Card className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
          How are you feeling today?
        </h3>
        
        {/* Mood Scale */}
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <span className="text-6xl">{moodEmojis[selectedMood]}</span>
          </div>
          <p className="text-lg font-medium text-gray-800 dark:text-white mb-4">
            {moodLabels[selectedMood]}
          </p>
          
          <div className="flex justify-center space-x-2 mb-4">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(mood => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                  selectedMood === mood
                    ? 'bg-primary-500 text-white scale-110'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Very Bad</span>
            <span>Perfect</span>
          </div>
        </div>

        {/* Mood Factors */}
        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
            What's affecting your mood?
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {moodFactors.map(factor => (
              <button
                key={factor.id}
                onClick={() => handleFactorToggle(factor.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedFactors.includes(factor.id)
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={factor.icon} className="w-5 h-5" />
                  <span className="text-sm font-medium">{factor.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mood Note */}
        <div className="mb-6">
          <textarea
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            placeholder="Add a note about your mood (optional)..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            rows="3"
          />
        </div>

        <Button onClick={handleSubmit} className="w-full md:w-auto">
          Save Mood Entry
        </Button>
      </Card>

      {/* Mood Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-3xl mb-2">{moodEmojis[Math.round(averageMood)] || '😐'}</div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
            Average Mood
          </h4>
          <p className="text-2xl font-bold text-primary-500">
            {averageMood.toFixed(1)}
          </p>
        </Card>

        <Card className="text-center">
          <div className="text-3xl mb-2">📈</div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
            Mood Trend
          </h4>
          <p className={`text-2xl font-bold ${
            moodTrend > 0 ? 'text-green-500' : moodTrend < 0 ? 'text-red-500' : 'text-gray-500'
          }`}>
            {moodTrend > 0 ? '+' : ''}{moodTrend.toFixed(1)}
          </p>
        </Card>

        <Card className="text-center">
          <div className="text-3xl mb-2">{moodEmojis[bestMood] || '😊'}</div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
            Best Mood
          </h4>
          <p className="text-2xl font-bold text-green-500">
            {bestMood}/10
          </p>
        </Card>

        <Card className="text-center">
          <div className="text-3xl mb-2">{moodEmojis[worstMood] || '😐'}</div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
            Lowest Mood
          </h4>
          <p className="text-2xl font-bold text-red-500">
            {worstMood}/10
          </p>
        </Card>
      </div>

      {/* Mood Chart */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Mood Trend (Last 30 Days)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={last30Days}>
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
              formatter={(value) => [value ? `${value}/10` : 'No data', 'Mood']}
            />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="#EC4899" 
              strokeWidth={3}
              dot={{ fill: '#EC4899', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Mood Entries */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Recent Mood Entries
        </h3>
        <div className="space-y-3">
          {moodEntries.slice(0, 10).map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="text-3xl">{moodEmojis[entry.mood]}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-800 dark:text-white">
                    {moodLabels[entry.mood]}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {entry.mood}/10
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {format(parseISO(entry.timestamp), 'MMM dd, yyyy')}
                </p>
                {entry.note && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    "{entry.note}"
                  </p>
                )}
                {entry.factors && entry.factors.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {entry.factors.map(factorId => {
                      const factor = moodFactors.find(f => f.id === factorId);
                      return factor ? (
                        <span
                          key={factorId}
                          className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-xs"
                        >
                          {factor.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {moodEntries.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No mood entries yet. Start tracking your mood today!
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default MoodTracker;