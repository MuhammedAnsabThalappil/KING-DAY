import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'purple' | 'pink' | 'yellow' | 'green' | 'red' | 'gray';
  size?: 'sm' | 'md';
}

const variantStyles = {
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
  pink: 'bg-pink-100 text-pink-800 border-pink-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  green: 'bg-green-100 text-green-800 border-green-200',
  red: 'bg-red-100 text-red-800 border-red-200',
  gray: 'bg-slate-100 text-slate-700 border-slate-200',
};

const Badge: React.FC<BadgeProps> = ({ children, variant = 'blue', size = 'sm' }) => {
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full border ${variantStyles[variant]} ${sizeStyles}`}
    >
      {children}
    </span>
  );
};

export default Badge;
