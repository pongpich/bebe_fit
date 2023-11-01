import React, { useRef, useEffect } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ url }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url); // ใช้ URL ที่ถูกส่งเข้ามาใน props
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play();
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url; // ใช้ URL ที่ถูกส่งเข้ามาใน props
        video.addEventListener('canplay', () => {
          video.play();
        });
      }
    }
  }, [url]);

  return (
    <video ref={videoRef} controls autoPlay width="560" height="320" />
  );
};

export default VideoPlayer;
