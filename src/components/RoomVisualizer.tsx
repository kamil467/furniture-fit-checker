import React, { useEffect, useRef } from 'react';

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

export function RoomVisualizer({ roomDimensions, selectedFurniture }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const CANVAS_SIZE = 600; // Increased canvas size
  const PADDING = 60; // Increased padding

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
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="w-full border border-gray-200 rounded-lg shadow-sm"
      />
      {!roomDimensions && (
        <p className="text-center text-gray-500 mt-4">
          Enter room dimensions to see visualization
        </p>
      )}
    </div>
  );
}