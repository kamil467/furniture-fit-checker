import React, { useEffect, useRef, useState } from 'react';

interface Props {
  roomDimensions: {
    length: number;
    width: number;
    height: number;
  } | null;
  selectedFurniture: {
    name: string;
    length: number;
    width: number;
    height: number;
    image: string;
  } | null;
}

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

function ImageModal({ isOpen, onClose, imageUrl, title }: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-4xl w-full p-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-auto rounded-lg"
        />
      </div>
    </div>
  );
}

export function RoomVisualizer({ roomDimensions, selectedFurniture }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const CANVAS_SIZE = 600; // Increased canvas size
  const PADDING = 60; // Increased padding
  const [modalImage, setModalImage] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !roomDimensions) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw room background
    const roomImage = new Image();
    roomImage.src = 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80';
    
    roomImage.onload = () => {
      // Draw room background
      ctx.drawImage(roomImage, 0, 0, canvas.width, canvas.height);

      // Calculate scale based on room dimensions to fit within canvas
      const maxDimension = Math.max(roomDimensions.length, roomDimensions.width);
      const scale = (CANVAS_SIZE - PADDING * 2) / maxDimension;

      // Calculate scaled dimensions
      const roomLength = roomDimensions.length * scale;
      const roomWidth = roomDimensions.width * scale;

      // Center the room in the canvas
      const startX = (canvas.width - roomLength) / 2;
      const startY = (canvas.height - roomWidth) / 2;

      // Draw semi-transparent overlay for room area
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(startX, startY, roomLength, roomWidth);

      // Draw room outline with shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = '#4F46E5';
      ctx.lineWidth = 3;
      ctx.strokeRect(startX, startY, roomLength, roomWidth);
      ctx.shadowColor = 'transparent';

      // Add room dimensions text with background
      ctx.font = 'bold 16px sans-serif';
      
      // Length
      const lengthText = `${roomDimensions.length}m`;
      const lengthMetrics = ctx.measureText(lengthText);
      const textPadding = 6;
      
      // Text background
      ctx.fillStyle = 'white';
      ctx.fillRect(
        startX + roomLength / 2 - lengthMetrics.width / 2 - textPadding,
        startY - 28,
        lengthMetrics.width + textPadding * 2,
        24
      );
      
      // Text
      ctx.fillStyle = '#4B5563';
      ctx.fillText(
        lengthText,
        startX + roomLength / 2 - lengthMetrics.width / 2,
        startY - 12
      );
      
      // Width
      ctx.save();
      const widthText = `${roomDimensions.width}m`;
      const widthMetrics = ctx.measureText(widthText);
      
      // Text background
      ctx.translate(startX - 28, startY + roomWidth / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = 'white';
      ctx.fillRect(
        -widthMetrics.width / 2 - textPadding,
        -12,
        widthMetrics.width + textPadding * 2,
        24
      );
      
      // Text
      ctx.fillStyle = '#4B5563';
      ctx.fillText(
        widthText,
        -widthMetrics.width / 2,
        4
      );
      ctx.restore();

      // Draw furniture if selected
      if (selectedFurniture) {
        const furnitureLength = selectedFurniture.length * scale;
        const furnitureWidth = selectedFurniture.width * scale;

        // Center furniture in room
        const furnitureX = startX + (roomLength - furnitureLength) / 2;
        const furnitureY = startY + (roomWidth - furnitureWidth) / 2;

        // Check if furniture fits
        const fits = selectedFurniture.length <= roomDimensions.length &&
                    selectedFurniture.width <= roomDimensions.width &&
                    selectedFurniture.height <= roomDimensions.height;

        // Load and draw furniture image
        const furnitureImg = new Image();
        furnitureImg.src = selectedFurniture.image;
        
        furnitureImg.onload = () => {
          // Draw furniture shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
          ctx.shadowBlur = 12;
          ctx.shadowOffsetY = 4;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
          ctx.fillRect(furnitureX, furnitureY, furnitureLength, furnitureWidth);
          ctx.shadowColor = 'transparent';
          ctx.shadowOffsetY = 0;

          // Draw furniture image
          ctx.drawImage(
            furnitureImg,
            furnitureX,
            furnitureY,
            furnitureLength,
            furnitureWidth
          );

          // Draw furniture outline
          ctx.strokeStyle = fits ? '#059669' : '#DC2626';
          ctx.lineWidth = 3;
          ctx.strokeRect(furnitureX, furnitureY, furnitureLength, furnitureWidth);

          // Add furniture name and dimensions with background
          const text = `${selectedFurniture.name} (${selectedFurniture.length}m × ${selectedFurniture.width}m)`;
          ctx.font = 'bold 14px sans-serif';
          const metrics = ctx.measureText(text);
          
          // Text background with rounded corners
          const bgPadding = 8;
          const bgHeight = 28;
          const bgY = furnitureY - bgHeight - 4;
          
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.roundRect(
            furnitureX,
            bgY,
            metrics.width + bgPadding * 2,
            bgHeight,
            6
          );
          ctx.fill();
          
          // Text
          ctx.fillStyle = fits ? '#059669' : '#DC2626';
          ctx.fillText(
            text,
            furnitureX + bgPadding,
            bgY + 19
          );
        };
      }
    };
  }, [roomDimensions, selectedFurniture]);

  return (
    <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Room Visualization</h3>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="w-full border border-gray-200 rounded-lg shadow-sm cursor-pointer"
          onClick={() => {
            if (roomDimensions) {
              setModalImage({
                url: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=90',
                title: 'Room View'
              });
            }
          }}
        />
        {selectedFurniture && (
          <button
            className="absolute bottom-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 px-3 py-2 rounded-lg shadow-sm border border-gray-200 text-sm font-medium flex items-center gap-2 transition-colors"
            onClick={() => setModalImage({
              url: selectedFurniture.image,
              title: selectedFurniture.name
            })}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3H6" />
            </svg>
            View Furniture
          </button>
        )}
      </div>
      {!roomDimensions && (
        <p className="text-center text-gray-500 mt-4">
          Enter room dimensions to see visualization
        </p>
      )}
      <ImageModal
        isOpen={!!modalImage}
        onClose={() => setModalImage(null)}
        imageUrl={modalImage?.url || ''}
        title={modalImage?.title || ''}
      />
    </div>
  );
}