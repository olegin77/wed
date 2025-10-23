import React, { useState, useCallback } from 'react';

export interface Table {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  capacity: number;
  guests: string[];
  shape: 'round' | 'rectangular';
}

export interface SeatingPlanEditorProps {
  tables: Table[];
  onTablesChange: (tables: Table[]) => void;
  className?: string;
}

export function SeatingPlanEditor({
  tables,
  onTablesChange,
  className = '',
}: SeatingPlanEditorProps) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleTableMove = useCallback((tableId: string, deltaX: number, deltaY: number) => {
    onTablesChange(
      tables.map(table =>
        table.id === tableId
          ? { ...table, x: table.x + deltaX, y: table.y + deltaY }
          : table
      )
    );
  }, [tables, onTablesChange]);

  const handleMouseDown = (e: React.MouseEvent, tableId: string) => {
    e.preventDefault();
    setSelectedTable(tableId);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedTable) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    handleTableMove(selectedTable, deltaX, deltaY);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setSelectedTable(null);
  };

  return (
    <div
      className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute inset-0 p-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`absolute cursor-move select-none ${
              selectedTable === table.id ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{
              left: table.x,
              top: table.y,
              width: table.width,
              height: table.height,
            }}
            onMouseDown={(e) => handleMouseDown(e, table.id)}
          >
            <div
              className={`w-full h-full bg-white border-2 border-gray-300 rounded-lg shadow-sm flex items-center justify-center ${
                table.shape === 'round' ? 'rounded-full' : 'rounded-lg'
              }`}
            >
              <div className="text-center">
                <div className="font-semibold text-gray-900">
                  Table {table.id}
                </div>
                <div className="text-sm text-gray-500">
                  {table.guests.length}/{table.capacity}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}