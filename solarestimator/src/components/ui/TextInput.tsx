import React, { InputHTMLAttributes, forwardRef } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`
          w-full px-4 py-2 border rounded-md shadow-sm 
          ${hasError 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
          }
          transition-colors input input-bordered
          ${className || ''}
        `}
        {...props}
      />
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput; 