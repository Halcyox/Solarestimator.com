import React, { ReactNode } from 'react';

interface FormFieldProps {
  id: string;
  label: ReactNode;
  error?: string | null;
  children: ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  id, 
  label, 
  error, 
  children 
}) => {
  return (
    <div className="w-full mb-4">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        {children}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField; 