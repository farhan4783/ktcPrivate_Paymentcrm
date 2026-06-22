import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
  const variants = {
    primary: 'bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90 shadow-lg shadow-[#0EA5E9]/20',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-soft',
    outline: 'border border-gray-200 bg-transparent text-textPrimary hover:bg-gray-50',
    ghost: 'bg-transparent text-textSecondary hover:bg-gray-100 hover:text-textPrimary',
    danger: 'bg-danger text-white hover:bg-danger/90 shadow-soft',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base font-semibold',
  };

  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button };
