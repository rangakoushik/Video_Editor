import React from 'react';
import { Plus } from 'lucide-react';

const Timeline = ({ 
  timelineRef, 
  currentTime, 
  videoDuration, 
  zoomBlocks, 
  selectedBlock, 
  onBlockSelect, 
  onAddBlock 
}) => {
  const handleBlockClick = (block) => {
    onBlockSelect(block === selectedBlock ? null : block);
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Timeline</h3>
        <button
          onClick={onAddBlock}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <Plus size={20} className="inline-block mr-1" />
          Add Zoom Block
        </button>
      </div>
      
      <div
        ref={timelineRef}
        className="relative h-16 bg-gray-600 rounded"
      >
        <div
          className="absolute top-0 w-1 h-full bg-red-500"
          style={{ left: `${(currentTime / videoDuration) * 100}%` }}
        />
        
        {zoomBlocks.map(block => (
          <div
            key={block.id}
            className={`absolute h-full top-0 bg-blue-300 rounded cursor-pointer opacity-75 hover:opacity-100 
              ${selectedBlock?.id === block.id ? 'ring-2 ring-blue-500' : ''}`}
            style={{
              left: `${(block.startTime / videoDuration) * 100}%`,
              width: `${((block.endTime - block.startTime) / videoDuration) * 100}%`
            }}
            onClick={() => handleBlockClick(block)}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;