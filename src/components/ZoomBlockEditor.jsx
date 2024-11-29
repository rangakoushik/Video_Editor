import React, { useState } from 'react';

const ZoomBlockEditor = ({ selectedBlock, videoDuration, onUpdateBlock, onDeleteBlock }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = parseFloat(value);

        if (name === "x" || name === "y") {
            const clampedValue = Math.max(0, Math.min(100, parsedValue));
            onUpdateBlock(selectedBlock.id, { [name]: clampedValue });
        } else if (name === "scale") {
            const clampedScale = Math.max(1, Math.min(parsedValue, 5));
            onUpdateBlock(selectedBlock.id, { [name]: clampedScale });
        }
    };

    const handleStartChange = (e) => {
        let newStart = parseFloat(e.target.value);
        newStart = Math.max(0, Math.min(newStart, selectedBlock.endTime - 0.1));
        onUpdateBlock(selectedBlock.id, { startTime: newStart });
    };

    const handleEndChange = (e) => {
        let newEnd = parseFloat(e.target.value);
        newEnd = Math.max(selectedBlock.startTime + 0.1, Math.min(newEnd, videoDuration));
        onUpdateBlock(selectedBlock.id, { endTime: newEnd });
    };

    const presetPositions = [
        { label: 'Top Left', x: 0, y: 0 },
        { label: 'Top Right', x: 100, y: 0 },
        { label: 'Bottom Left', x: 0, y: 100 },
        { label: 'Bottom Right', x: 100, y: 100 },
        { label: 'Center', x: 50, y: 50 },
    ];

    if (!selectedBlock) {
        return (
            <div className="bg-gray-700 p-4 rounded-lg">
                <p>Select a zoom block to edit.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-black">Edit Zoom Block</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label htmlFor="startTime" className='text-black'>Start Time (s):</label>
                    <input
                        type="number"
                        name="startTime"
                        value={selectedBlock.startTime.toFixed(1)}
                        onChange={handleStartChange}
                        step="0.1"
                        className="w-full bg-gray-600 text-white p-2 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="endTime" className='text-black'>End Time (s):</label>
                    <input
                        type="number"
                        name="endTime"
                        value={selectedBlock.endTime.toFixed(1)}
                        onChange={handleEndChange}
                        step="0.1"
                        className="w-full bg-gray-600 text-white p-2 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="x" className='text-black'>X Position (%):</label>
                    <input
                        type="number"
                        name="x"
                        value={selectedBlock.x}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        className="w-full bg-gray-600 text-white p-2 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="y" className='text-black'>Y Position (%):</label>
                    <input
                        type="number"
                        name="y"
                        value={selectedBlock.y}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        className="w-full bg-gray-600 text-white p-2 rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="scale" className='text-black'>Zoom Scale:</label>
                    <input
                        type="number"
                        name="scale"
                        value={selectedBlock.scale.toFixed(1)}
                        onChange={handleInputChange}
                        min="1"
                        max="5"
                        step="0.1"
                        className="w-full bg-gray-600 text-white p-2 rounded-md"
                    />
                </div>

                <div>
                    <label className='text-black'>Preset Positions:</label>
                    <div className="grid grid-cols-3 gap-2">
                        {presetPositions.map((preset) => (
                            <button
                                key={preset.label}
                                onClick={() => onUpdateBlock(selectedBlock.id, { x: preset.x, y: preset.y })}
                                className="bg-blue-500 text-white p-2 rounded-md text-xs hover:bg-blue-600"
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <button 
                    onClick={() => onDeleteBlock(selectedBlock.id)} 
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                >
                    Delete Block
                </button>
            </div>
        </div>
    );
};

export default ZoomBlockEditor;
