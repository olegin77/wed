import React from 'react';

export interface BudgetProps {
  total: number;
  spent: number;
  remaining?: number;
  currency?: string;
  className?: string;
}

export function Budget({
  total,
  spent,
  remaining,
  currency = '$',
  className = '',
}: BudgetProps) {
  const calculatedRemaining = remaining ?? total - spent;
  const spentPercentage = (spent / total) * 100;
  const remainingPercentage = (calculatedRemaining / total) * 100;

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Spent</span>
            <span>{currency}{spent.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Remaining</span>
            <span className={calculatedRemaining < 0 ? 'text-red-600' : 'text-green-600'}>
              {currency}{calculatedRemaining.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                calculatedRemaining < 0 ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(Math.max(remainingPercentage, 0), 100)}%` }}
            />
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-200">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total Budget</span>
            <span>{currency}{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}