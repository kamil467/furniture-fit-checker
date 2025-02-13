import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface Furniture {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  image: string;
}

interface RoomDimensions {
  length: number;
  width: number;
  height: number;
}

interface Props {
  furniture: Furniture[];
  roomDimensions: RoomDimensions | null;
  onSelectFurniture?: (furniture: Furniture | null) => void;
}

export function FurnitureList({ furniture, roomDimensions, onSelectFurniture }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const checkFit = (item: Furniture) => {
    if (!roomDimensions) return null;
    
    return (
      item.length <= roomDimensions.length &&
      item.width <= roomDimensions.width &&
      item.height <= roomDimensions.height
    );
  };

  const handleFurnitureClick = (item: Furniture) => {
    const newSelectedId = selectedId === item.id ? null : item.id;
    setSelectedId(newSelectedId);
    onSelectFurniture?.(newSelectedId ? item : null);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Available Furniture</h2>
      <div className="space-y-4">
        {furniture.map((item) => {
          const fits = checkFit(item);
          const isSelected = selectedId === item.id;
          
          return (
            <div
              key={item.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-indigo-500' : ''
              } ${
                fits === null
                  ? 'border-gray-200 hover:border-indigo-200'
                  : fits
                  ? 'border-green-200 bg-green-50 hover:bg-green-100'
                  : 'border-red-200 bg-red-50 hover:bg-red-100'
              }`}
              onClick={() => handleFurnitureClick(item)}
            >
              <div className="flex items-start space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    {fits !== null && (
                      fits ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Length: {item.length}m</p>
                    <p>Width: {item.width}m</p>
                    <p>Height: {item.height}m</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}