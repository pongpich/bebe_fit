import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import { useSelector, useDispatch } from "react-redux";
import { hidePopupVideoPlayer } from "../redux/exerciseVideos";


const VideoPlayerByteArk = ({ url }) => {
  const dispatch = useDispatch();
  const hidePopUpVideoPlayer = useSelector(({ exerciseVideos }) => (exerciseVideos ? exerciseVideos.hidePopUpVideoPlayer : ""));
  const videoRef = useRef(null);
  const [videoEnded, setVideoEnded] = useState(false); // เพิ่ม state สำหรับตรวจสอบว่าวีดีโอถูกดูจบหรือไม่
  const [videoDuration, setVideoDuration] = useState(0); // เพิ่ม state สำหรับเก็บระยะเวลาของวีดีโอ

  useEffect(() => {


    const video = videoRef.current;
    if (video) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url); // ใช้ URL ที่ถูกส่งเข้ามาใน props
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          //video.play();
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url; // ใช้ URL ที่ถูกส่งเข้ามาใน props
        video.addEventListener('canplay', () => {
          // video.play();
        });
      }


      video.addEventListener('ended', () => {
        setVideoEnded(true); // กำหนดว่าวีดีโอถูกดูจบ
      });

      video.addEventListener('loadedmetadata', () => {
        const videoDuration = video.duration; // ความยาวของวีดีโอ (ในวินาที)
        console.log(`ความยาวของวีดีโอ: ${videoDuration} วินาที`);
      });

      video.addEventListener('timeupdate', () => {
        setVideoDuration(video.currentTime); // อัปเดตระยะเวลาที่คลิปถูกเล่นไป
      });
    }
  }, [url]);

  useEffect(() => {
    console.log("videoEnded :", videoEnded);
  }, [videoEnded]);

  useEffect(() => {
    console.log("videoDuration :", videoDuration);
  }, [videoDuration]);

  const handleVideoClose = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      // และอื่น ๆ ที่คุณต้องการให้เกิดขึ้นเมื่อปิดวีดีโอ
    }

    //สั่ง set ตัวแปรใน redux และให้หน้า videoList ไปเช็ีคจากตัวแปรนั้นเพื่อซ่อน popup
    dispatch(hidePopupVideoPlayer(true))
  };

  return (
    <div>
      <video
        id="videoPlayer"
        ref={videoRef}
        controls
        width="560"
        height="320"
      />
      <button onClick={handleVideoClose} style={{ position: 'absolute', top: 0, right: 0 }}>
        ปิดวีดีโอ
      </button>Î
    </div>);
};

export default VideoPlayerByteArk;
