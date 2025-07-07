import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  gradient = false,
  onClick,
  ...props 
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      className={`
        ${gradient 
          ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white' 
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        }
        rounded-xl shadow-lg p-6 transition-all duration-300
        ${hover ? 'hover:shadow-xl' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;