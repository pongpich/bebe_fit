import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import styled from 'styled-components';
import Hls from 'hls.js';
import { completeVideoPlayPercentage, minimumVideoPlayPercentage, updateFrequency } from "../constants/defaultValues";
import { FacebookShareButton, TwitterShareButton, FacebookMessengerShareButton, LineShareButton, WhatsappShareButton } from "react-share";
import { updateVideoStatusBraveAndBurn } from "../redux/exerciseVideos";
import ListGroup from 'reactstrap/lib/ListGroup';




const PopupWrapper = styled.div`
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.8);
display: flex;
justify-content: center;
align-items: center;
z-index: 999;
`;

const CloseButton = styled.button`
background-color: #fff;
border: none;
padding: 5px 10px;
position: absolute;
top: 10px; /* ปรับตำแหน่งตามที่ต้องการ */
right: 10px; /* ปรับตำแหน่งตามที่ต้องการ */
z-index: 1000; /* ตั้งค่า z-index เพื่อให้ปุ่มอยู่ด้านบนสุด */
`;



const BraveAndBurn = () => {
    const dispatch = useDispatch();

    const [isPopupOpen, setPopupOpen] = useState(false);
    const [videoEnded, setVideoEnded] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);
    const [videoDuration, setVideoDuration] = useState(0); // เพิ่ม state สำหรับเก็บความยาวของวีดีโอ
    const [videoCurrDuration, setVideoCurrDuration] = useState(0); // เพิ่ม state สำหรับเก็บระยะเวลาที่เล่นไปของวีดีโอ

    const [prevPlayTime, setPrevPlayTime] = useState(0);


    const videoRef = useRef(null);

    const user = useSelector(({ authUser }) => (authUser ? authUser.user : ""));
    const week = useSelector(({ exerciseVideos }) => (exerciseVideos ? exerciseVideos.week : ""));
    const brave_and_burn_challenge = useSelector(({ exerciseVideos }) => (exerciseVideos ? exerciseVideos.brave_and_burn_challenge : ""));



    // คำสั่งเปิด/ปิด popup
    const togglePopup = () => {
        setPopupOpen(!isPopupOpen);
    };


    useEffect(() => {
        setVideoUrl(JSON.parse(brave_and_burn_challenge.video).url3)
        if (brave_and_burn_challenge.video_status === "success") {
            setVideoEnded(true);
        }
    }, [])

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource("https://planforfittufqepu.stream-playlist.byteark.com/streams/TuMnX1KBc4pR/playlist.m3u8"); // ใช้ URL ที่ถูกส่งเข้ามาใน props
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    //video.play();
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = "https://planforfittufqepu.stream-playlist.byteark.com/streams/TuMnX1KBc4pR/playlist.m3u8"; // ใช้ URL ที่ถูกส่งเข้ามาใน props
                video.addEventListener('canplay', () => {
                    // video.play();
                });
            }


            video.addEventListener('ended', () => {
                setVideoEnded(true); // กำหนดว่าวีดีโอถูกดูจบ
            });

            video.addEventListener('loadedmetadata', () => {
                const videoDuration = video.duration; // ความยาวของวีดีโอ (ในวินาที)
                setVideoDuration(videoDuration);
            });

            video.addEventListener('timeupdate', () => {
                setVideoCurrDuration(video.currentTime); // อัปเดตระยะเวลาที่คลิปถูกเล่นไป
            });
        }
    }, [isPopupOpen]);


    useEffect(() => {
        //ทำการหน่วงเวลาตาม updateFrequency เพื่อยิง updatePlayTime
        const diffTime = Math.abs(videoCurrDuration - prevPlayTime);
        if (diffTime < updateFrequency) { return }
        setPrevPlayTime(videoCurrDuration)

        //เช็คว่าถ้าดูวีดีโอยังไม่ถึง minimumVideoPlayPercentage ไม่ต้อง updatePlayTime
        if (videoCurrDuration / videoDuration < minimumVideoPlayPercentage) {
            return
        }

        setVideoEnded(true);
    }, [videoCurrDuration]);

    useEffect(() => {
        if (videoEnded) {
            dispatch(updateVideoStatusBraveAndBurn(user && user.user_id))
        }
    }, [videoEnded])

    return (
        <div >
            {isPopupOpen && (
                <PopupWrapper>
                    <video
                        id="videoPlayer"
                        ref={videoRef}
                        controls
                        width={900}
                    />
                    <CloseButton onClick={togglePopup}>ปิด</CloseButton>
                </PopupWrapper>
            )}

            <div id="the-video-player"></div>

            <div className='center d-flex flex-column align-items-center' style={{ backgroundColor: "white", padding: 50 }}>

                <div className='card' style={{ width: 476, backgroundColor: "white", padding: 1, borderRadius: 20 }}>
                    <div className='containerThumb'>
                        <img
                            className='img-fluid'
                            style={{
                                borderTopLeftRadius: '20px',
                                borderTopRightRadius: '20px',
                                borderBottomLeftRadius: '0',
                                borderBottomRightRadius: '0'
                            }}
                            src={require(`../assets/img/brave&burn/brave&burn${week}.png`)}>
                        </img>
                    </div>

                    <div style={{ padding: 35 }}>
                        <p style={{ fontSize: 22, margin: '0' }}>Brave&Burn</p>
                        <p style={{ fontSize: 42, margin: '0' }}>
                            {
                                (week > 3) ?
                                    `${week}th`
                                    :
                                    (week === 3) ?
                                        `${week}rd`
                                        :
                                        (week === 2) ?
                                            `${week}nd`
                                            :
                                            `${week}st`
                            }
                            {` Challenge!!`}
                        </p>
                        <div className='d-flex justify-content-center align-items-center'>
                            <div
                                className='btn d-flex justify-content-center align-items-center'
                                style={{ color: "white", backgroundColor: "#EF60A3", width: 350, height: 60, borderRadius: 50, fontSize: 24 }}
                                onClick={togglePopup}
                            >
                                เล่นชาเลนจ์นี้
                            </div>
                        </div>
                    </div>
                </div>
                {
                    videoEnded &&
                    <div className='mt-3'>
                        <FacebookShareButton url={'https://fit.bebefitroutine.com/achievement/achievement8.html'}>
                            <div onClick={() => console.log("SHARE!!")} className='btn btn-primary gap-2'>
                                <i className="fa-brands fa-facebook"> SHARE</i>
                            </div>
                        </FacebookShareButton>

                    </div>
                }


            </div>
        </div>
    );
}

export default BraveAndBurn;
