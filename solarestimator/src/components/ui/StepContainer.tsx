import React, { ReactNode } from 'react';

interface StepContainerProps {
  title: string;
  children: ReactNode;
}

export const StepContainer: React.FC<StepContainerProps> = ({ title, children }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-6 text-center text-accent-color">
        {title}
      </h2>
      {children}
    </div>
  );
};

export default StepContainer; 