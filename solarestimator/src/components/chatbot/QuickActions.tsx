'use client';

import React from 'react';

interface QuickActionsProps {
  actions: string[];
  onActionClick: (action: string) => void;
  disabled?: boolean;
  show?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  onActionClick,
  disabled = false,
  show = true
}) => {
  if (!show) return null;

  const handleActionClick = (action: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    
    if (!disabled) {
      onActionClick(action);
    }
  };

  return (
    <div className="px-3 pb-2">
      <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
      <div className="grid grid-cols-1 gap-1">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={handleActionClick(action)}
            className="text-left text-xs p-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded border border-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}; 