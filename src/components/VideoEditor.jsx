import React, { useState, useRef, useCallback, useEffect } from 'react';
import VideoUpload from './VideoUpload';
import VideoPlayer from './VideoPlayer';
import VideoPreview from './VideoPreview';
import Timeline from './Timeline';
import ZoomBlockEditor from './ZoomBlockEditor';

const VideoEditor = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [zoomBlocks, setZoomBlocks] = useState([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [pausedTime, setPausedTime] = useState(0);

  const videoRef = useRef(null);
  const timelineRef = useRef(null);

  const handleVideoUpload = useCallback((file) => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoFile(file);
    const newUrl = URL.createObjectURL(file);
    setVideoUrl(newUrl);
  }, [videoUrl]);

  const handleVideoLoad = useCallback(() => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  }, []);

  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setPausedTime(videoRef.current.currentTime);
    } else {
      if (isPreviewMode) {
        setIsPreviewMode(false);
        setSelectedBlock(null);
      }
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, isPreviewMode]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  }, []);

  const addZoomBlock = useCallback(() => {
    const newBlock = {
      id: Date.now(),
      startTime: currentTime,
      endTime: Math.min(currentTime + 2, videoDuration),
      x: 50,
      y: 50,
      scale: 1.5
    };
    setZoomBlocks(prev => [...prev, newBlock]);
    setSelectedBlock(newBlock);
    setIsPreviewMode(true);
  }, [currentTime, videoDuration]);

  const updateZoomBlock = useCallback((id, updates) => {
    setZoomBlocks(blocks =>
      blocks.map(block =>
        block.id === id ? { ...block, ...updates } : block
      )
    );

    if (selectedBlock?.id === id) {
      setSelectedBlock(prev => ({ ...prev, ...updates }));
    }
  }, [selectedBlock]);

  const deleteZoomBlock = useCallback((id) => {
    setZoomBlocks(blocks => blocks.filter(block => block.id !== id));
    if (selectedBlock?.id === id) {
      setSelectedBlock(null);
      setIsPreviewMode(false);
    }
  }, [selectedBlock]);

  const handleBlockSelect = useCallback((block) => {
    if (!videoRef.current) return;
    if (block?.id === selectedBlock?.id) {
      setIsPreviewMode(!isPreviewMode);
      return;
    }
    if (block) {
      const timeToSet = !isPreviewMode ? pausedTime : block.startTime;
      
      videoRef.current.currentTime = timeToSet;
      setCurrentTime(timeToSet);
      setSelectedBlock(block);
      setIsPreviewMode(true);
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setPausedTime(timeToSet);
      }
    } else {
      setSelectedBlock(null);
      setIsPreviewMode(false);
    }
  }, [selectedBlock, isPlaying, isPreviewMode, pausedTime]);
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  return (
    <div className="w-full min-h-screen bg-gray-800 text-white p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Video Editor</h1>
        <VideoUpload onVideoUpload={handleVideoUpload} />
        <div className="mt-4 flex gap-x-8">
          <div className="w-[90%]">
            {videoUrl && (
              <VideoPreview
                videoUrl={videoUrl}
                videoRef={videoRef}
                isPlaying={isPlaying}
                currentTime={currentTime}
                zoomBlocks={zoomBlocks}
                selectedBlock={selectedBlock}
                isPreviewMode={isPreviewMode}
                onPlayPause={handlePlayPause}
                onLoadedMetadata={handleVideoLoad}
                onTimeUpdate={handleTimeUpdate}
                pausedTime={pausedTime}
              />
            )}
            {videoDuration > 0 && (
              <Timeline
                timelineRef={timelineRef}
                currentTime={currentTime}
                videoDuration={videoDuration}
                zoomBlocks={zoomBlocks}
                selectedBlock={selectedBlock}
                onBlockSelect={handleBlockSelect}
                onAddBlock={addZoomBlock}
              />
            )}
          </div>
          <div className="flex items-center">
            <ZoomBlockEditor
              selectedBlock={selectedBlock}
              videoDuration={videoDuration}
              onUpdateBlock={updateZoomBlock}
              onDeleteBlock={deleteZoomBlock}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;