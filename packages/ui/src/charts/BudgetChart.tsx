import React from 'react';

export interface BudgetChartProps {
  data: Array<{
    category: string;
    amount: number;
    color?: string;
  }>;
  total?: number;
  className?: string;
}

export function BudgetChart({
  data,
  total,
  className = '',
}: BudgetChartProps) {
  const totalAmount = total || data.reduce((sum, item) => sum + item.amount, 0);
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = (item.amount / totalAmount) * 100;
          const color = item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`;
          
          return (
            <div key={item.category} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.category}</span>
                <span className="text-gray-600">
                  ${item.amount.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              <div className="text-xs text-gray-500">
                {percentage.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
      
      {total && (
        <div className="pt-2 border-t border-gray-200">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}