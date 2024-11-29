import React, { useRef, useEffect, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';

const VideoPreview = ({
  videoUrl,
  videoRef,
  isPlaying,
  currentTime,
  zoomBlocks,
  selectedBlock,
  isPreviewMode,
  onPlayPause,
  onLoadedMetadata,
  onTimeUpdate,
  pausedTime,
}) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const lastFrameTimeRef = useRef(0);

  const getActiveZoomBlock = useCallback((time) => {
    if (isPreviewMode && selectedBlock) {
      return selectedBlock;
    }
    return zoomBlocks.find(block =>
      time >= block.startTime && time <= block.endTime
    );
  }, [zoomBlocks, selectedBlock, isPreviewMode]);

  const renderFrame = useCallback((force = false) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const now = performance.now();
    if (!force && now - lastFrameTimeRef.current < 16) return;
    lastFrameTimeRef.current = now;

    const ctx = canvas.getContext('2d');
    const activeZoomBlock = getActiveZoomBlock(video.currentTime);
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (activeZoomBlock) {
      const { x, y, scale } = activeZoomBlock;
      const centerX = (x / 100) * canvas.width;
      const centerY = (y / 100) * canvas.height;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(scale, scale);
      ctx.translate(-centerX, -centerY);
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      } catch (error) {
        console.error('Error drawing video frame:', error);
      }
      
      ctx.restore();
    } else {
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      } catch (error) {
        console.error('Error drawing video frame:', error);
      }
    }
  }, [getActiveZoomBlock]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const animate = () => {
      renderFrame();
      rafRef.current = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      animate();
    } else {
      renderFrame(true);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPlaying, renderFrame]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleSeeked = () => renderFrame(true);
    const handleLoadedData = () => renderFrame(true);

    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [renderFrame]);
  useEffect(() => {
    renderFrame(true);
  }, [selectedBlock, isPreviewMode, renderFrame]);

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        className="hidden"
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
      />
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button 
          onClick={onPlayPause} 
          className="p-2 bg-white/80 rounded-full text-gray-600 hover:bg-white"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <div className="p-2 bg-white/80 rounded-full text-gray-600">
          {Math.floor(currentTime)}s
        </div>
      </div>
      {getActiveZoomBlock(currentTime) && (
        <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
          {isPreviewMode ? 'Preview Mode' : 'Zoom Active'}:
          X{getActiveZoomBlock(currentTime).x}% Y{getActiveZoomBlock(currentTime).y}%
        </div>
      )}
    </div>
  );
};

export default React.memo(VideoPreview);