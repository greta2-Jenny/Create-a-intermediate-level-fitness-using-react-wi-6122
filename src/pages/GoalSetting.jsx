import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFitness } from '../contexts/FitnessContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const { FiPlus, FiTarget, FiTrendingUp, FiCalendar, FiCheckCircle, FiCircle, FiEdit, FiTrash2 } = FiIcons;

const GoalSetting = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useFitness();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: '',
    currentValue: 0,
    unit: '',
    category: '',
    deadline: '',
    priority: 'medium',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      targetValue: '',
      currentValue: 0,
      unit: '',
      category: '',
      deadline: '',
      priority: 'medium',
    });
    setEditingGoal(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.targetValue) {
      toast.error('Please fill in required fields');
      return;
    }

    const goalData = {
      ...formData,
      targetValue: parseFloat(formData.targetValue),
      currentValue: parseFloat(formData.currentValue),
      progress: (parseFloat(formData.currentValue) / parseFloat(formData.targetValue)) * 100,
    };

    if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
      toast.success('Goal updated successfully!');
    } else {
      addGoal(goalData);
      toast.success('Goal added successfully!');
    }

    resetForm();
    setShowAddForm(false);
  };

  const handleEdit = (goal) => {
    setFormData({
      title: goal.title,
      description: goal.description,
      targetValue: goal.targetValue.toString(),
      currentValue: goal.currentValue,
      unit: goal.unit,
      category: goal.category,
      deadline: goal.deadline,
      priority: goal.priority,
    });
    setEditingGoal(goal);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
      toast.success('Goal deleted');
    }
  };

  const updateProgress = (goalId, newValue) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      const progress = (newValue / goal.targetValue) * 100;
      updateGoal(goalId, { 
        currentValue: newValue, 
        progress: Math.min(progress, 100) 
      });
      
      if (progress >= 100) {
        toast.success('🎉 Goal completed! Congratulations!');
      }
    }
  };

  const categories = [
    { name: 'Weight Loss', icon: FiTrendingUp, color: 'from-red-500 to-red-600' },
    { name: 'Muscle Gain', icon: FiTarget, color: 'from-blue-500 to-blue-600' },
    { name: 'Endurance', icon: FiCalendar, color: 'from-green-500 to-green-600' },
    { name: 'Flexibility', icon: FiCircle, color: 'from-purple-500 to-purple-600' },
  ];

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  };

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
            Goal Setting
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Set and track your fitness goals
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>Add Goal</span>
        </Button>
      </div>

      {/* Goal Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => {
          const categoryGoals = goals.filter(g => g.category === category.name);
          const completedGoals = categoryGoals.filter(g => g.progress >= 100);
          
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <SafeIcon icon={category.icon} className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {completedGoals.length} of {categoryGoals.length} completed
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Goal Form */}
      {showAddForm && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {editingGoal ? 'Edit Goal' : 'Add New Goal'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Lose 10 pounds"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Value *
                </label>
                <input
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="10"
                  min="0"
                  step="0.1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current Value
                </label>
                <input
                  type="number"
                  value={formData.currentValue}
                  onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Unit
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="pounds, kg, minutes, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Describe your goal and motivation..."
                  rows="3"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowAddForm(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingGoal ? 'Update Goal' : 'Add Goal'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <SafeIcon 
                      icon={goal.progress >= 100 ? FiCheckCircle : FiCircle} 
                      className={`w-6 h-6 ${goal.progress >= 100 ? 'text-green-500' : 'text-gray-400'}`} 
                    />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {goal.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[goal.priority]}`}>
                      {goal.priority}
                    </span>
                  </div>
                  
                  {goal.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-3 ml-9">
                      {goal.description}
                    </p>
                  )}
                  
                  <div className="ml-9 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Progress: {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {Math.round(goal.progress)}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(goal.progress, 100)}%` }}
                      ></div>
                    </div>
                    
                    {goal.deadline && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Deadline: {format(new Date(goal.deadline), 'MMM dd, yyyy')}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={goal.currentValue}
                      onChange={(e) => updateProgress(goal.id, parseFloat(e.target.value) || 0)}
                      className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                      min="0"
                      step="0.1"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {goal.unit}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiEdit} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        
        {goals.length === 0 && (
          <Card>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No goals set yet. Create your first goal to start tracking your progress!
            </div>
          </Card>
        )}
      </div>
    </motion.div>
  );
};

export default GoalSetting;