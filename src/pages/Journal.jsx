import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFitness } from '../contexts/FitnessContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const { FiPlus, FiBook, FiEdit, FiTrash2, FiSearch, FiFilter, FiCalendar } = FiIcons;

const Journal = () => {
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } = useFitness();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 5,
    tags: '',
    gratitude: '',
    goals: '',
    challenges: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      mood: 5,
      tags: '',
      gratitude: '',
      goals: '',
      challenges: '',
    });
    setEditingEntry(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Please fill in title and content');
      return;
    }

    const entryData = {
      ...formData,
      mood: parseInt(formData.mood),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    if (editingEntry) {
      updateJournalEntry(editingEntry.id, entryData);
      toast.success('Journal entry updated successfully!');
    } else {
      addJournalEntry(entryData);
      toast.success('Journal entry added successfully!');
    }

    resetForm();
    setShowAddForm(false);
  };

  const handleEdit = (entry) => {
    setFormData({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
      tags: entry.tags ? entry.tags.join(', ') : '',
      gratitude: entry.gratitude || '',
      goals: entry.goals || '',
      challenges: entry.challenges || '',
    });
    setEditingEntry(entry);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this journal entry?')) {
      deleteJournalEntry(id);
      toast.success('Journal entry deleted');
    }
  };

  // Filter and search entries
  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesMood = filterMood === 'all' || 
                       (filterMood === 'positive' && entry.mood >= 7) ||
                       (filterMood === 'neutral' && entry.mood >= 4 && entry.mood < 7) ||
                       (filterMood === 'negative' && entry.mood < 4);
    
    return matchesSearch && matchesMood;
  });

  const moodEmojis = {
    1: '😢', 2: '😞', 3: '😐', 4: '😊', 5: '😄',
    6: '😁', 7: '😍', 8: '🤩', 9: '🥳', 10: '🚀'
  };

  const journalPrompts = [
    "What are three things you're grateful for today?",
    "What challenge did you overcome this week?",
    "How did your workout make you feel?",
    "What healthy habit do you want to develop?",
    "What's one thing you learned about yourself today?",
    "How can you be kinder to yourself this week?",
    "What progress have you made toward your goals?",
    "What's bringing you joy right now?",
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
            Fitness Journal
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Reflect on your fitness journey and personal growth
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>New Entry</span>
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-400" />
            <select
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            >
              <option value="all">All Moods</option>
              <option value="positive">Positive (7-10)</option>
              <option value="neutral">Neutral (4-6)</option>
              <option value="negative">Negative (1-3)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Journal Prompts */}
      {!showAddForm && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Journal Prompts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {journalPrompts.slice(0, 4).map((prompt, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg border border-primary-200 dark:border-primary-800 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setFormData({ ...formData, title: 'Reflection', content: prompt + '\n\n' });
                  setShowAddForm(true);
                }}
              >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {prompt}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Add/Edit Entry Form */}
      {showAddForm && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Today's Reflection"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mood (1-10)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.mood}
                    onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                    className="flex-1"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{moodEmojis[formData.mood]}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formData.mood}/10
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="Write about your day, thoughts, feelings, or experiences..."
                rows="6"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gratitude
                </label>
                <textarea
                  value={formData.gratitude}
                  onChange={(e) => setFormData({ ...formData, gratitude: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="What are you grateful for?"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Goals & Achievements
                </label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="Progress toward goals..."
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Challenges
                </label>
                <textarea
                  value={formData.challenges}
                  onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  placeholder="What challenges did you face?"
                  rows="3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                placeholder="fitness, motivation, goals, reflection"
              />
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
                {editingEntry ? 'Update Entry' : 'Save Entry'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Journal Entries */}
      <div className="space-y-4">
        {filteredEntries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {entry.title}
                    </h3>
                    <span className="text-2xl">{moodEmojis[entry.mood]}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {entry.mood}/10
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                      <span>{format(parseISO(entry.timestamp), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiBook} className="w-4 h-4" />
                      <span>{entry.content.length} characters</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiEdit} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {entry.content}
                </p>
              </div>

              {(entry.gratitude || entry.goals || entry.challenges) && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {entry.gratitude && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-medium text-green-800 dark:text-green-400 mb-1">
                        Gratitude
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {entry.gratitude}
                      </p>
                    </div>
                  )}
                  {entry.goals && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-1">
                        Goals & Achievements
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {entry.goals}
                      </p>
                    </div>
                  )}
                  {entry.challenges && (
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <h4 className="font-medium text-orange-800 dark:text-orange-400 mb-1">
                        Challenges
                      </h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        {entry.challenges}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {entry.tags && entry.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        ))}
        
        {filteredEntries.length === 0 && (
          <Card>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {searchTerm || filterMood !== 'all' 
                ? 'No entries match your search criteria.' 
                : 'No journal entries yet. Start writing your first entry!'}
            </div>
          </Card>
        )}
      </div>
    </motion.div>
  );
};

export default Journal;