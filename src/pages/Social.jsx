import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format } from 'date-fns';

const { 
  FiUsers, FiHeart, FiMessageCircle, FiShare, FiTrendingUp, 
  FiAward, FiPlus, FiUserPlus, FiActivity, FiClock 
} = FiIcons;

const Social = () => {
  const [activeTab, setActiveTab] = useState('feed');

  // Mock data for social features
  const posts = [
    {
      id: 1,
      user: {
        name: 'Sarah Johnson',
        avatar: 'SJ',
        level: 'Fitness Enthusiast'
      },
      content: 'Just completed a 5K run in under 25 minutes! 🏃‍♀️ Feeling amazing and ready to tackle the day!',
      workout: {
        type: 'Running',
        duration: '24:45',
        distance: '5.0 km',
        calories: 320
      },
      likes: 24,
      comments: 8,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      image: null
    },
    {
      id: 2,
      user: {
        name: 'Mike Chen',
        avatar: 'MC',
        level: 'Strength Trainer'
      },
      content: 'New personal record on bench press! 💪 Consistency and progressive overload really work. Thanks for all the support from this amazing community!',
      workout: {
        type: 'Strength Training',
        duration: '45:00',
        exercises: ['Bench Press', 'Squats', 'Deadlifts'],
        calories: 280
      },
      likes: 42,
      comments: 15,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      image: null
    },
    {
      id: 3,
      user: {
        name: 'Emma Wilson',
        avatar: 'EW',
        level: 'Yoga Instructor'
      },
      content: 'Morning yoga session complete! 🧘‍♀️ Starting the day with mindfulness and movement. Who else loves morning workouts?',
      workout: {
        type: 'Yoga',
        duration: '30:00',
        style: 'Vinyasa Flow',
        calories: 150
      },
      likes: 18,
      comments: 6,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      image: null
    }
  ];

  const friends = [
    {
      id: 1,
      name: 'Alex Rivera',
      avatar: 'AR',
      status: 'Just finished a workout',
      streak: 12,
      isOnline: true
    },
    {
      id: 2,
      name: 'Jessica Park',
      avatar: 'JP',
      status: 'On rest day',
      streak: 8,
      isOnline: false
    },
    {
      id: 3,
      name: 'David Kim',
      avatar: 'DK',
      status: 'Preparing for marathon',
      streak: 25,
      isOnline: true
    },
    {
      id: 4,
      name: 'Lisa Thompson',
      avatar: 'LT',
      status: 'Yoga instructor',
      streak: 15,
      isOnline: true
    }
  ];

  const challenges = [
    {
      id: 1,
      title: '30-Day Plank Challenge',
      description: 'Hold a plank for increasing durations each day',
      participants: 156,
      daysLeft: 18,
      progress: 60,
      joined: true
    },
    {
      id: 2,
      title: 'Weekly Running Club',
      description: 'Run at least 3 times this week',
      participants: 89,
      daysLeft: 3,
      progress: 75,
      joined: true
    },
    {
      id: 3,
      title: 'Mindful Meditation',
      description: 'Meditate for 10 minutes daily',
      participants: 234,
      daysLeft: 12,
      progress: 40,
      joined: false
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'David Kim', points: 2450, avatar: 'DK' },
    { rank: 2, name: 'Sarah Johnson', points: 2380, avatar: 'SJ' },
    { rank: 3, name: 'Mike Chen', points: 2210, avatar: 'MC' },
    { rank: 4, name: 'Emma Wilson', points: 2100, avatar: 'EW' },
    { rank: 5, name: 'You', points: 1950, avatar: 'YU' }
  ];

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return format(date, 'MMM dd');
  };

  const tabs = [
    { id: 'feed', name: 'Feed', icon: FiUsers },
    { id: 'friends', name: 'Friends', icon: FiUsers },
    { id: 'challenges', name: 'Challenges', icon: FiTrendingUp },
    { id: 'leaderboard', name: 'Leaderboard', icon: FiAward }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Social Hub
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Connect, share, and motivate each other on your fitness journey
        </p>
      </div>

      {/* Navigation Tabs */}
      <Card>
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <SafeIcon icon={tab.icon} className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Feed Tab */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Create Post */}
          <Card>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                YU
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Share your fitness journey..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>
              <Button>
                <SafeIcon icon={FiPlus} className="w-5 h-5" />
              </Button>
            </div>
          </Card>

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                      {post.user.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {post.user.name}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {post.user.level}
                        </span>
                        <span className="text-sm text-gray-400">
                          •
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatTimeAgo(post.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {post.content}
                      </p>

                      {/* Workout Details */}
                      {post.workout && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center space-x-1">
                              <SafeIcon icon={FiActivity} className="w-4 h-4 text-primary-500" />
                              <span className="font-medium">{post.workout.type}</span>
                            </div>
                            {post.workout.duration && (
                              <div className="flex items-center space-x-1">
                                <SafeIcon icon={FiClock} className="w-4 h-4 text-gray-500" />
                                <span>{post.workout.duration}</span>
                              </div>
                            )}
                            {post.workout.distance && (
                              <div>
                                <span className="font-medium">{post.workout.distance}</span>
                              </div>
                            )}
                            <div>
                              <span className="font-medium">{post.workout.calories} cal</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400">
                        <button className="flex items-center space-x-2 hover:text-red-500 transition-colors">
                          <SafeIcon icon={FiHeart} className="w-5 h-5" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors">
                          <SafeIcon icon={FiMessageCircle} className="w-5 h-5" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
                          <SafeIcon icon={FiShare} className="w-5 h-5" />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Your Fitness Buddies
            </h2>
            <Button className="flex items-center space-x-2">
              <SafeIcon icon={FiUserPlus} className="w-5 h-5" />
              <span>Add Friends</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friends.map((friend, index) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {friend.avatar}
                      </div>
                      {friend.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-white">
                        {friend.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {friend.status}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <span className="text-sm text-orange-500 font-medium">
                          🔥 {friend.streak} day streak
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Message
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Fitness Challenges
            </h2>
            <Button className="flex items-center space-x-2">
              <SafeIcon icon={FiPlus} className="w-5 h-5" />
              <span>Create Challenge</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        {challenge.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {challenge.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{challenge.participants} participants</span>
                        <span>{challenge.daysLeft} days left</span>
                      </div>
                    </div>
                    {challenge.joined && (
                      <div className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                        Joined
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progress
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {challenge.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${challenge.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button 
                    variant={challenge.joined ? "secondary" : "primary"}
                    className="w-full"
                  >
                    {challenge.joined ? "View Progress" : "Join Challenge"}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Weekly Leaderboard
          </h2>

          <Card>
            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center space-x-4 p-3 rounded-lg ${
                    user.name === 'You' 
                      ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' 
                      : 'bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8">
                    {user.rank <= 3 ? (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        user.rank === 1 ? 'bg-yellow-500' :
                        user.rank === 2 ? 'bg-gray-400' :
                        'bg-orange-500'
                      }`}>
                        {user.rank}
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 font-medium">
                        {user.rank}
                      </span>
                    )}
                  </div>
                  
                  <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.avatar}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`font-medium ${
                      user.name === 'You' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-800 dark:text-white'
                    }`}>
                      {user.name}
                    </h3>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-gray-800 dark:text-white">
                      {user.points.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      points
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </motion.div>
  );
};

export default Social;