import React, { useState } from 'react';
import { Ruler } from 'lucide-react';

interface RoomDimensions {
  length: number;
  width: number;
  height: number;
}

interface Props {
  onDimensionsSubmit: (dimensions: RoomDimensions) => void;
}

export function RoomDimensionForm({ onDimensionsSubmit }: Props) {
  const [dimensions, setDimensions] = useState<RoomDimensions>({
    length: 0,
    width: 0,
    height: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDimensionsSubmit(dimensions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <Ruler className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Room Dimensions</h2>
      </div>
      
      {['length', 'width', 'height'].map((dimension) => (
        <div key={dimension}>
          <label 
            htmlFor={dimension}
            className="block text-sm font-medium text-gray-700 capitalize"
          >
            {dimension} (meters)
          </label>
          <input
            type="number"
            id={dimension}
            min="0"
            step="0.01"
            value={dimensions[dimension as keyof RoomDimensions]}
            onChange={(e) => setDimensions(prev => ({
              ...prev,
              [dimension]: parseFloat(e.target.value) || 0
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                     focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                     p-2 border"
            required
          />
        </div>
      ))}
      
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md
                 hover:bg-indigo-700 focus:outline-none focus:ring-2
                 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
      >
        Check Furniture Fit
      </button>
    </form>
  );
}