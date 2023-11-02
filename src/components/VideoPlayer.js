import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import { useSelector, useDispatch } from "react-redux";
import { hidePopupVideoPlayer, updatePlaytime } from "../redux/exerciseVideos";
import { completeVideoPlayPercentage, minimumVideoPlayPercentage, updateFrequency } from "../constants/defaultValues";


const VideoPlayerByteArk = ({ url, day_number, video_number, selectedVDO }) => {
  const dispatch = useDispatch();
  const hidePopUpVideoPlayer = useSelector(({ exerciseVideos }) => (exerciseVideos ? exerciseVideos.hidePopUpVideoPlayer : ""));
  const exerciseVideo = useSelector(({ exerciseVideos }) => (exerciseVideos ? exerciseVideos.exerciseVideo : ""));
  const user = useSelector(({ authUser }) => (authUser ? authUser.user : ""));
  const videoRef = useRef(null);
  const [videoEnded, setVideoEnded] = useState(false); // เพิ่ม state สำหรับตรวจสอบว่าวีดีโอถูกดูจบหรือไม่
  const [videoCurrDuration, setVideoCurrDuration] = useState(0); // เพิ่ม state สำหรับเก็บระยะเวลาที่เล่นไปของวีดีโอ
  const [videoDuration, setVideoDuration] = useState(0); // เพิ่ม state สำหรับเก็บความยาวของวีดีโอ
  const [prevPlayTime, setPrevPlayTime] = useState(0);


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
        setVideoDuration(videoDuration);
      });

      video.addEventListener('timeupdate', () => {
        setVideoCurrDuration(video.currentTime); // อัปเดตระยะเวลาที่คลิปถูกเล่นไป
      });
    }
  }, [url]);

  useEffect(() => {
    //console.log("videoEnded :", videoEnded);
  }, [videoEnded]);

  useEffect(() => {
    //console.log("videoDuration :", videoDuration);
  }, [videoDuration]);

  useEffect(() => {

    //ทำการหน่วงเวลาตาม updateFrequency เพื่อยิง updatePlayTime
    const diffTime = Math.abs(videoCurrDuration - prevPlayTime);
    if (diffTime < updateFrequency) { return }
    setPrevPlayTime(videoCurrDuration)

    //เช็คว่าถ้าดูวีดีโอยังไม่ถึง minimumVideoPlayPercentage ไม่ต้อง updatePlayTime
    //เช็คว่าถ้าเคยดูคลิปนั้นจบแล้ว ไม่ต้อง updatePlayTime
    if (
      (videoCurrDuration / videoDuration < minimumVideoPlayPercentage) ||
      (selectedVDO.play_time / selectedVDO.duration >= completeVideoPlayPercentage)) {
      return
    }

    updatePlayTime();
  }, [videoCurrDuration]);

  const updatePlayTime = () => {
    const tempExerciseVideo = [...exerciseVideo];
    tempExerciseVideo[day_number][video_number] = { ...tempExerciseVideo[day_number][video_number], play_time: videoDuration, duration: videoDuration };

    /* this.props.updatePlaytime(user_id, start_date, expire_date, day_number, video_number, play_time, duration, tempExerciseVideo); */
    dispatch(updatePlaytime(
      user.user_id,
      user.start_date,
      user.expire_date,
      day_number,
      video_number,
      videoDuration,
      videoDuration,
      tempExerciseVideo
    ));

  }

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
