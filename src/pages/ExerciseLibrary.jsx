import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiFilter, FiPlay, FiClock, FiTarget, FiHeart, FiActivity, FiZap, FiX } = FiIcons;

const ExerciseLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState(null);

  const exercises = [
    {
      id: 1,
      name: 'Push-ups',
      category: 'strength',
      difficulty: 'beginner',
      duration: '30 seconds',
      calories: 8,
      muscles: ['Chest', 'Arms', 'Core'],
      instructions: [
        'Start in a plank position with hands shoulder-width apart',
        'Lower your body until your chest nearly touches the floor',
        'Push back up to the starting position',
        'Keep your body in a straight line throughout the movement'
      ],
      tips: [
        'Keep your core engaged',
        'Don\'t let your hips sag',
        'Control the movement - don\'t rush'
      ]
    },
    {
      id: 2,
      name: 'Squats',
      category: 'strength',
      difficulty: 'beginner',
      duration: '45 seconds',
      calories: 10,
      muscles: ['Legs', 'Glutes', 'Core'],
      instructions: [
        'Stand with feet shoulder-width apart',
        'Lower your body by bending your knees and hips',
        'Keep your chest up and knees behind your toes',
        'Return to standing position'
      ],
      tips: [
        'Keep your weight on your heels',
        'Don\'t let your knees cave inward',
        'Go as low as you can while maintaining form'
      ]
    },
    {
      id: 3,
      name: 'Burpees',
      category: 'cardio',
      difficulty: 'intermediate',
      duration: '30 seconds',
      calories: 15,
      muscles: ['Full Body'],
      instructions: [
        'Start in a standing position',
        'Drop into a squat and place hands on the ground',
        'Jump feet back into plank position',
        'Do a push-up, then jump feet back to squat',
        'Jump up with arms overhead'
      ],
      tips: [
        'Maintain good form even when tired',
        'Modify by stepping back instead of jumping',
        'Keep your core tight throughout'
      ]
    },
    {
      id: 4,
      name: 'Mountain Climbers',
      category: 'cardio',
      difficulty: 'intermediate',
      duration: '30 seconds',
      calories: 12,
      muscles: ['Core', 'Arms', 'Legs'],
      instructions: [
        'Start in a plank position',
        'Bring one knee toward your chest',
        'Quickly switch legs, bringing the other knee forward',
        'Continue alternating legs rapidly'
      ],
      tips: [
        'Keep your hips level',
        'Don\'t bounce your hips up and down',
        'Maintain a strong plank position'
      ]
    },
    {
      id: 5,
      name: 'Plank',
      category: 'strength',
      difficulty: 'beginner',
      duration: '60 seconds',
      calories: 6,
      muscles: ['Core', 'Arms', 'Back'],
      instructions: [
        'Start in a push-up position',
        'Lower to your forearms',
        'Keep your body in a straight line',
        'Hold the position while breathing normally'
      ],
      tips: [
        'Don\'t let your hips sag or pike up',
        'Keep your head in neutral position',
        'Breathe steadily throughout the hold'
      ]
    },
    {
      id: 6,
      name: 'Jumping Jacks',
      category: 'cardio',
      difficulty: 'beginner',
      duration: '45 seconds',
      calories: 10,
      muscles: ['Full Body'],
      instructions: [
        'Stand with feet together and arms at your sides',
        'Jump while spreading your legs shoulder-width apart',
        'Simultaneously raise your arms overhead',
        'Jump back to starting position'
      ],
      tips: [
        'Land softly on the balls of your feet',
        'Keep your core engaged',
        'Maintain a steady rhythm'
      ]
    },
    {
      id: 7,
      name: 'Lunges',
      category: 'strength',
      difficulty: 'beginner',
      duration: '45 seconds',
      calories: 9,
      muscles: ['Legs', 'Glutes', 'Core'],
      instructions: [
        'Stand with feet hip-width apart',
        'Step forward with one leg',
        'Lower your body until both knees are at 90 degrees',
        'Push back to starting position and repeat'
      ],
      tips: [
        'Keep your front knee over your ankle',
        'Don\'t let your front knee go past your toes',
        'Keep your torso upright'
      ]
    },
    {
      id: 8,
      name: 'High Knees',
      category: 'cardio',
      difficulty: 'beginner',
      duration: '30 seconds',
      calories: 11,
      muscles: ['Legs', 'Core'],
      instructions: [
        'Stand with feet hip-width apart',
        'Run in place while lifting knees high',
        'Aim to bring knees up to hip level',
        'Pump your arms as you run'
      ],
      tips: [
        'Stay on the balls of your feet',
        'Keep your core engaged',
        'Maintain an upright posture'
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Exercises', icon: FiActivity },
    { id: 'strength', name: 'Strength', icon: FiTarget },
    { id: 'cardio', name: 'Cardio', icon: FiHeart },
    { id: 'flexibility', name: 'Flexibility', icon: FiZap },
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ];

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscles.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Exercise Library
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Discover and learn new exercises for your fitness journey
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search exercises or muscle groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.id} value={difficulty.id}>
                  {difficulty.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`text-center cursor-pointer transition-all ${
                selectedCategory === category.id
                  ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="p-4">
                <SafeIcon icon={category.icon} className="w-8 h-8 mx-auto mb-2 text-primary-500" />
                <h3 className="font-medium text-gray-800 dark:text-white">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {exercises.filter(e => category.id === 'all' || e.category === category.id).length} exercises
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden cursor-pointer" onClick={() => setSelectedExercise(exercise)}>
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 flex items-center justify-center">
                <SafeIcon icon={FiActivity} className="w-16 h-16 text-primary-500" />
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {exercise.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                    {exercise.difficulty}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiClock} className="w-4 h-4" />
                    <span>{exercise.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiZap} className="w-4 h-4" />
                    <span>{exercise.calories} cal</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {exercise.muscles.map((muscle, muscleIndex) => (
                    <span
                      key={muscleIndex}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
                
                <Button
                  className="w-full flex items-center justify-center space-x-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExercise(exercise);
                  }}
                >
                  <SafeIcon icon={FiPlay} className="w-4 h-4" />
                  <span>View Details</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <Card>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No exercises found matching your criteria. Try adjusting your search or filters.
          </div>
        </Card>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedExercise(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {selectedExercise.name}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedExercise.difficulty)}`}>
                      {selectedExercise.difficulty}
                    </span>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiClock} className="w-4 h-4" />
                      <span>{selectedExercise.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiZap} className="w-4 h-4" />
                      <span>{selectedExercise.calories} cal</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>

              <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg mb-6 flex items-center justify-center">
                <SafeIcon icon={FiActivity} className="w-16 h-16 text-primary-500" />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                    Target Muscles
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedExercise.muscles.map((muscle, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-sm"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                    Instructions
                  </h3>
                  <ol className="space-y-2">
                    {selectedExercise.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {instruction}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                    Tips
                  </h3>
                  <ul className="space-y-2">
                    {selectedExercise.tips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-2 h-2 bg-accent-500 rounded-full mt-2"></span>
                        <span className="text-gray-700 dark:text-gray-300">
                          {tip}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <Button className="flex-1">
                    Start Exercise
                  </Button>
                  <Button variant="secondary" onClick={() => setSelectedExercise(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExerciseLibrary;