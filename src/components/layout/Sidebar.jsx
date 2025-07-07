import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiHome, FiActivity, FiTarget, FiTrendingUp, FiHeart, 
  FiClock, FiBook, FiList, FiUsers, FiX 
} = FiIcons;

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/workout', icon: FiActivity, label: 'Workout Tracker' },
    { path: '/goals', icon: FiTarget, label: 'Goal Setting' },
    { path: '/progress', icon: FiTrendingUp, label: 'Progress' },
    { path: '/mood', icon: FiHeart, label: 'Mood Tracker' },
    { path: '/meditation', icon: FiClock, label: 'Meditation' },
    { path: '/journal', icon: FiBook, label: 'Journal' },
    { path: '/exercises', icon: FiList, label: 'Exercise Library' },
    { path: '/social', icon: FiUsers, label: 'Social' },
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 shadow-lg z-50 lg:translate-x-0 lg:static lg:z-auto border-r border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <SafeIcon icon={FiX} className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <SafeIcon 
                      icon={item.icon} 
                      className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} 
                    />
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Stats card */}
          <div className="p-4">
            <div className="bg-gradient-to-r from-accent-50 to-primary-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">
                Weekly Progress
              </h3>
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                <span>4/7 workouts</span>
                <span className="font-semibold text-accent-600 dark:text-accent-400">57%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                <div className="bg-gradient-to-r from-accent-400 to-primary-400 h-2 rounded-full w-[57%]"></div>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;