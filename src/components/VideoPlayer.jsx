import React, { useRef, useEffect } from 'react';

const VideoPlayer = ({ videoSrc, currentTime, zoomBlocks }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 0.1) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);
  const activeBlock = zoomBlocks.find(block => 
    currentTime >= block.startTime && currentTime <= block.endTime
  );
  const getVideoStyle = () => {
    if (!activeBlock) {
      return {
        transform: 'translate(0%, 0%) scale(1)',
        transition: 'transform 0.3s ease-out'
      };
    }
    const translateX = -(activeBlock.x - 50) * (activeBlock.scale - 1) / activeBlock.scale;
    const translateY = -(activeBlock.y - 50) * (activeBlock.scale - 1) / activeBlock.scale;

    return {
      transform: `translate(${translateX}%, ${translateY}%) scale(${activeBlock.scale})`,
      transition: 'transform 0.3s ease-out'
    };
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-black" ref={containerRef}>
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        style={getVideoStyle()}
        src={videoSrc}
      />
    </div>
  );
};

export default VideoPlayer;