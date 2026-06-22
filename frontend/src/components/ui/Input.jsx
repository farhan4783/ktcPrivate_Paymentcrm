import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="text-sm font-semibold text-textPrimary">{label}</label>}
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          error && "border-danger focus-visible:ring-danger/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs font-medium text-danger">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
