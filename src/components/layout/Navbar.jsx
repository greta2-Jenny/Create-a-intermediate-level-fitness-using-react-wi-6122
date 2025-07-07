import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMenu, FiSun, FiMoon, FiBell, FiSearch, FiActivity } = FiIcons;

const Navbar = ({ toggleSidebar }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <SafeIcon icon={FiMenu} className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <SafeIcon icon={FiActivity} className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              FitTracker Pro
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
            <SafeIcon icon={FiSearch} className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search exercises..."
              className="bg-transparent border-none outline-none text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400"
            />
          </div>

          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
            <SafeIcon icon={FiBell} className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <SafeIcon 
              icon={isDarkMode ? FiSun : FiMoon} 
              className="w-5 h-5 text-gray-600 dark:text-gray-300" 
            />
          </button>

          <div className="w-8 h-8 bg-gradient-to-r from-accent-400 to-primary-400 rounded-full"></div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;