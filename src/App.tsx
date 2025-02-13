import React, { useState } from 'react';
import { RoomDimensionForm } from './components/RoomDimensionForm';
import { FurnitureList } from './components/FurnitureList';
import { RoomVisualizer } from './components/RoomVisualizer';
import { LayoutDashboard } from 'lucide-react';

interface RoomDimensions {
  length: number;
  width: number;
  height: number;
}

interface Furniture {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  image: string;
}

// Hardcoded furniture data with images
const furnitureData: Furniture[] = [
  {
    id: '1',
    name: '3-Seater Sofa',
    length: 2.2,
    width: 0.95,
    height: 0.85,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: '2',
    name: 'Double Bed',
    length: 2.0,
    width: 1.6,
    height: 1.2,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: '3',
    name: 'Dining Table',
    length: 1.8,
    width: 0.9,
    height: 0.75,
    image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: '4',
    name: 'Wardrobe',
    length: 1.5,
    width: 0.6,
    height: 2.0,
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=300&q=80'
  }
];

function App() {
  const [roomDimensions, setRoomDimensions] = useState<RoomDimensions | null>(null);
  const [selectedFurniture, setSelectedFurniture] = useState<Furniture | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <LayoutDashboard className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Furniture Fit Checker
            </h1>
          </div>
          <p className="text-gray-600">
            Check if furniture will fit in your room before making a purchase
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <RoomDimensionForm onDimensionsSubmit={setRoomDimensions} />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <FurnitureList 
              furniture={furnitureData}
              roomDimensions={roomDimensions}
              onSelectFurniture={setSelectedFurniture}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <RoomVisualizer 
              roomDimensions={roomDimensions}
              selectedFurniture={selectedFurniture}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;