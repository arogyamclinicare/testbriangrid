'use client';

import { forwardRef } from 'react';
import { TOUCH_TARGET_MIN_SIZE } from '@/lib/utils/responsive';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'touch';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 hover:scale-105';
    
    const variantClasses = {
      primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg hover:shadow-xl hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500 active:from-primary-800 active:to-primary-900',
      secondary: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 shadow-md hover:shadow-lg hover:from-gray-200 hover:to-gray-300 focus:ring-gray-500 active:from-gray-300 active:to-gray-400',
      outline: 'border-2 border-primary-300 bg-white text-primary-700 shadow-md hover:shadow-lg hover:bg-primary-50 hover:border-primary-400 focus:ring-primary-500 active:bg-primary-100',
      ghost: 'text-primary-700 hover:bg-primary-50 focus:ring-primary-500 active:bg-primary-100 shadow-sm hover:shadow-md',
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm rounded-lg font-semibold',
      md: 'px-4 py-2 text-base rounded-xl font-semibold',
      lg: 'px-6 py-3 text-lg rounded-xl font-bold',
      touch: `px-4 py-3 text-base rounded-xl font-semibold min-h-[${TOUCH_TARGET_MIN_SIZE}px] shadow-lg`,
    };

    const widthClasses = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {icon && !loading && <span className="mr-2">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
