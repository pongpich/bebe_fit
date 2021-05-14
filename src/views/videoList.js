import React, { Component } from "react";
import {
  Button
} from "reactstrap";
import { connect } from "react-redux";
import { updateProfile, logoutUser } from "../redux/auth";
import { getDailyWeighChallenge, postDailyWeighChallenge } from "../redux/challenges";
import { createCustomWeekForUser, videoListForUser, updatePlaytime, updatePlaylist, randomVideo, selectChangeVideo, resetStatus, clearVideoList, videoListForUserLastWeek, updateBodyInfo, updatePlaytimeLastWeek } from "../redux/exerciseVideos";


import bghead from "../assets/img/bghead.jpg";
import "./videoList.scss";


class VideoList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      sex: "female",
      age: "",
      weight: "",
      height: "",
      chest: "",
      waist: "",
      hip: "",
      statusOtherAttributes: "default",
      focusDay: 0,
      other_attributes: "",
      selectedVDO: null,
      editVDO_click: "default",
      lastWeekVDO_click: "default",
      tempPlaylist: [],
      indexPlaylist: 0,
      selectChangeVideoList: [],
      spinnerRandomVideo: "default",
      weightInDailyWeighChallenge: "",
      otherAttributesPage: "basicInfo"
    };
    this.onUpdateProfile = this.onUpdateProfile.bind(this);
    this.onDayChange = this.onDayChange.bind(this);
    this.onVideoTimeUpdate = this.onVideoTimeUpdate.bind(this);
    this.toggle = this.toggle.bind(this);
    this.togglePopupSelectEditVideo = this.togglePopupSelectEditVideo.bind(this);
    this.close = this.close.bind(this);
    this.exerciseDaySelection = this.exerciseDaySelection.bind(this);
    this.closeList = this.closeList.bind(this);
    this.addEventToVideo = this.addEventToVideo.bind(this);
  }

  async componentDidMount() {
    const { user } = this.props;
    if (this.props.user && this.props.user.other_attributes) {
      this.props.videoListForUser(
        this.props.user.user_id,
        // this.props.user.other_attributes = "{"age": 32, "hip": 41, "sex": "female", "chest": 38, "waist": 31, "height": 175, "weight": 79}"
        JSON.parse(this.props.user.other_attributes).weight,
        this.props.user.start_date,
        this.props.user.expire_date,
        this.props.user.offset
      );
      this.props.videoListForUserLastWeek(
        this.props.user.user_id,
        // this.props.user.other_attributes = "{"age": 32, "hip": 41, "sex": "female", "chest": 38, "waist": 31, "height": 175, "weight": 79}"
        JSON.parse(this.props.user.other_attributes).weight,
        this.props.user.start_date,
        this.props.user.expire_date,
        this.props.user.offset
      );
      if (this.props.statusVideoList !== "no_video") {
        this.addEventToVideo();
      }
      this.props.getDailyWeighChallenge(user.user_id);
      this.setState({
        sex: JSON.parse(this.props.user.other_attributes).sex,
        age: JSON.parse(this.props.user.other_attributes).age,
        weight: JSON.parse(this.props.user.other_attributes).weight,
        height: JSON.parse(this.props.user.other_attributes).height,
        chest: JSON.parse(this.props.user.other_attributes).chest,
        waist: JSON.parse(this.props.user.other_attributes).waist,
        hip: JSON.parse(this.props.user.other_attributes).hip
      })
    }
    if (user === null) {
      this.props.history.push('/login');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { user, exerciseVideo, statusVideoList, statusPostDailyWeighChallenge } = this.props;
    if (prevProps.statusPostDailyWeighChallenge !== statusPostDailyWeighChallenge && statusPostDailyWeighChallenge === "success") {
      this.props.history.push('/challenges');
    }
    if (user && prevProps.user && user.other_attributes !== prevProps.user.other_attributes) {
      this.setState({
        other_attributes: user.other_attributes
      })
      this.props.videoListForUser(
        this.props.user.user_id,
        user.other_attributes.weight, //ไม่ต้อง JSON.parse เพราะผ่านการ UPDATE_PROFILE_SUCCESS
        this.props.user.start_date,
        this.props.user.expire_date,
        this.props.user.offset
      );
      this.props.videoListForUserLastWeek(
        this.props.user.user_id,
        user.other_attributes.weight, //ไม่ต้อง JSON.parse เพราะผ่านการ UPDATE_PROFILE_SUCCESS
        this.props.user.start_date,
        this.props.user.expire_date,
        this.props.user.offset
      );
      if (this.props.user.other_attributes && this.props.statusVideoList !== "no_video") {
        this.addEventToVideo();
      }
    }
    if (prevProps.user !== user && user === null) {
      this.props.history.push('/login');
    }
    if (prevProps.video.video_id !== this.props.video.video_id) {
      const { indexPlaylist } = this.state;
      // playlist เป็น Array ที่เก็บ Object ของ video หลายๆอันไว้ข้างใน
      let playlist = [...this.state.tempPlaylist];
      // ...playlist[indexPlaylist] เพื่อเอาAttribute (order, play_time) ซึ่งไม่มีใน database
      // ...this.props.video เพื่อเอาAttribute ต่างๆของ video ใหม่ที่สุ่มได้นั้น นำมา assigned ทับ ...playlist[indexPlaylist]
      // play_time: 0 เพื่อให้Attribute play_time เท่ากับ 0 เสมอเมื่อสุ่ม video มา
      playlist[indexPlaylist] = { ...playlist[indexPlaylist], ...this.props.video, play_time: 0 };
      this.setState({
        tempPlaylist: playlist
      })
    }
    if (prevProps.exerciseVideo !== exerciseVideo) { //เพื่อ update playtime ของ renderEditVDO 
      const { focusDay } = this.state;
      const todayExercise = this.exerciseDaySelection(focusDay);
      const tempPlaylist = [...todayExercise];
      this.setState({
        tempPlaylist: tempPlaylist
      })
    }
    if (prevProps.videos !== this.props.videos) {
      const videos = this.props.videos;
      this.setState({
        selectChangeVideoList: videos
      })
    }
    if (prevProps.status === "processing" && this.props.status === "success") {
      this.closeEditVDO();
    }
    if (prevState.editVDO_click === "show" && this.state.editVDO_click !== "show") {
      this.addEventToVideo();
    }
    if (prevState.editVDO_click !== "show" && this.state.editVDO_click === "show") {
      this.addEventToVideo();
    }
    if (user && prevProps.user && (prevProps.user.other_attributes !== user.other_attributes)) {
      /* this.setState({
        other_attributes: user.other_attributes
      }) */
      this.props.createCustomWeekForUser(
        this.props.user.user_id,
        user.other_attributes.weight, //ไม่ต้อง JSON.parse เพราะผ่านการ UPDATE_PROFILE_SUCCESS
        this.props.user.start_date,
        this.props.user.expire_date,
        this.props.user.offset
      );
    }
    if (prevProps.statusVideoList === "no_video" && statusVideoList !== "no_video") {
      this.props.updateBodyInfo(
        this.props.user.user_id,
        this.props.user.start_date,
        this.props.user.expire_date,
        this.state.other_attributes
      );
      this.props.videoListForUser(
        this.props.user.user_id,
        user.other_attributes.weight, //ไม่ต้อง JSON.parse เพราะผ่านการ UPDATE_PROFILE_SUCCESS
        this.props.user.start_date,
        this.props.user.expire_date,
        this.props.user.offset
      );
      this.props.videoListForUserLastWeek(
        this.props.user.user_id,
        user.other_attributes.weight, //ไม่ต้อง JSON.parse เพราะผ่านการ UPDATE_PROFILE_SUCCESS
        this.props.user.start_date,
        this.props.user.expire_date,
        this.props.user.offset
      );
      this.addEventToVideo();
    }
  }

  addEventToVideo() {
    var video = this.refs.videoPlayer;
    var videoList = this.refs.videoPlayerList;
    video.ontimeupdate = () => this.onVideoTimeUpdate("video");
    videoList.ontimeupdate = () => this.onVideoTimeUpdate("videoList");
    videoList.onended = () => this.onVideoEnd();
  }

  togglePopupSelectEditVideo(video_id, category, type, index) {
    document.getElementById("popupSelectEditVideo").classList.toggle("active");
    this.setState({
      indexPlaylist: index
    });
    this.props.selectChangeVideo(video_id, category, type);
    this.props.resetStatus();
  }

  closeTogglePopupSelectEditVideo() {
    document.getElementById("popupSelectEditVideo").classList.toggle("active");
    this.setState({
      selectChangeVideoList: [],
      indexPlaylist: 0
    })
  }

  selectEditVideo(video) {
    const { indexPlaylist } = this.state;
    let playlist = [...this.state.tempPlaylist];
    playlist[indexPlaylist] = { ...playlist[indexPlaylist], ...video, play_time: 0 };
    this.setState({
      tempPlaylist: playlist,
      selectChangeVideoList: []
    })
    document.getElementById("popupSelectEditVideo").classList.toggle("active");
  }

  exerciseDaySelection(focusDay) {
    if (this.props.exerciseVideo) {
      return this.props.exerciseVideo[focusDay];
    }
  }

  exerciseDaySelectionLastWeek(focusDay) {
    if (this.props.exerciseVideoLastWeek) {
      return this.props.exerciseVideoLastWeek[focusDay];
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    })
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onDayChange = (day) => {
    this.setState({
      focusDay: day
    });
  }

  onUserLogout(event) {
    this.props.logoutUser();
    this.props.clearVideoList();
  }

  closeEditVDO() {
    this.setState({
      editVDO_click: "default"
    })
  }

  randomVideo(video_id, category, type, index) {
    this.setState({
      indexPlaylist: index,
      spinnerRandomVideo: "loading"
    });
    this.props.randomVideo(video_id, category, type);
    var delayInMilliseconds = 500; //0.5 second
    setTimeout(() => { // แสดง Spinner 0.5 วินาที 
      this.setState({
        spinnerRandomVideo: "default"
      })
    }, delayInMilliseconds);
  }

  editVDO() {
    const { focusDay } = this.state;
    const todayExercise = this.exerciseDaySelection(focusDay);
    const tempPlaylist = [...todayExercise];
    this.setState({
      editVDO_click: "show",
      tempPlaylist: tempPlaylist
    })
  }

  toggleList() {
    const { focusDay } = this.state;
    const todayExercise = this.exerciseDaySelection(focusDay);
    const selectedVDO = todayExercise.find(element => (element.duration !== element.play_time));
    if (selectedVDO) {
      this.setState({
        selectedVDO
      }, () => {
        var trailer = document.getElementById(`popupVDOList`);
        var video = document.getElementById(`videoPlayerList`);
        trailer.classList.add("active_list");
        video.play();
      })
    }
  }

  toggleListLastWeek() {
    const { focusDay } = this.state;
    const todayExercise = this.exerciseDaySelectionLastWeek(focusDay);
    const selectedVDO = todayExercise.find(element => (element.duration !== element.play_time));
    if (selectedVDO) {
      this.setState({
        selectedVDO
      }, () => {
        var trailer = document.getElementById(`popupVDOList`);
        var video = document.getElementById(`videoPlayerList`);
        trailer.classList.add("active_list");
        video.play();
      })
    }
  }

  closeList() {
    var trailer = document.getElementById(`popupVDOList`);
    var video = document.getElementById(`videoPlayerList`);
    trailer.classList.remove("active_list");
    video.pause();
    video.currentTime = 0;

  }

  toggle(selectedVDO) {
    var trailer = document.getElementById(`popupVDO`);
    var video = document.getElementById(`videoPlayer`);
    if (selectedVDO) {
      this.setState({
        selectedVDO: selectedVDO
      })
    }
    trailer.classList.toggle("active");
    video.pause();
    video.currentTime = 0;
  }

  close() {
    var trailer = document.getElementById(`popupVDO`);
    trailer.classList.toggle("active");
  }

  onVideoEnd() {
    const { focusDay, selectedVDO, lastWeekVDO_click } = this.state;
    var todayExercise;
    if (lastWeekVDO_click === "show") {
      todayExercise = this.exerciseDaySelectionLastWeek(focusDay);
    } else {
      todayExercise = this.exerciseDaySelection(focusDay);
    }

    const nextVDO = todayExercise.find(
      element => (element.duration !== element.play_time) && (element.order > selectedVDO.order)
    );
    if (nextVDO) {
      this.setState({
        selectedVDO: nextVDO
      }, () => {
        var trailer = document.getElementById(`popupVDOList`);
        var video = document.getElementById(`videoPlayerList`);
        trailer.classList.add("active_list");
        video.play();
      })
    }
  }

  onVideoListUpdate() {
    const { focusDay, tempPlaylist } = this.state;
    const user_id = this.props.user.user_id;
    const start_date = this.props.user.start_date;
    const day_number = focusDay;
    const playlist = [...tempPlaylist];
    const tempExerciseVideo = [...this.props.exerciseVideo];
    tempExerciseVideo[focusDay] = tempPlaylist;
    this.props.updatePlaylist(
      user_id, start_date, day_number, playlist, tempExerciseVideo
    );
  }

  onVideoTimeUpdate(compName = "video") {
    var video = compName === "video" ? this.refs.videoPlayer : this.refs.videoPlayerList;
    const { selectedVDO, focusDay, lastWeekVDO_click } = this.state;
    if (video.currentTime >= (video.duration * 0.99) && (selectedVDO.duration !== selectedVDO.play_time)) {
      const user_id = this.props.user.user_id;
      const start_date = this.props.user.start_date;
      const expire_date = this.props.user.expire_date;
      const day_number = focusDay;
      const video_number = selectedVDO.order;
      const play_time = selectedVDO.duration;
      const tempExerciseVideoLastWeek = [...this.props.exerciseVideoLastWeek];
      const tempExerciseVideo = [...this.props.exerciseVideo];
      if (lastWeekVDO_click === "show") {
        tempExerciseVideoLastWeek[day_number][video_number] = { ...tempExerciseVideoLastWeek[day_number][video_number], play_time: play_time };
      } else {
        tempExerciseVideo[day_number][video_number] = { ...tempExerciseVideo[day_number][video_number], play_time: play_time };
      }
      const newVideo = { ...selectedVDO, play_time };
      this.setState({
        selectedVDO: newVideo
      });
      if (lastWeekVDO_click === "show") {
        this.props.updatePlaytimeLastWeek(user_id, start_date, expire_date, day_number, video_number, play_time, tempExerciseVideoLastWeek);
      } else {
        this.props.updatePlaytime(user_id, start_date, expire_date, day_number, video_number, play_time, tempExerciseVideo);
      }
    }
  }

  onUpdateBasicInfo(event) {
    const {
      sex,
      age,
      weight,
      height
    } = this.state;

    if (sex !== "" && age !== "" && weight !== "" && height !== "") {
      if (age % 1 === 0) {
        this.setState({
          otherAttributesPage: "bodyInfo",
          statusOtherAttributes: "default"
        })
      } else {
        this.setState({
          statusOtherAttributes: "ageNotUseDecimals"
        })
      }
    } else {
      this.setState({
        statusOtherAttributes: "fail"
      })
    }
  }

  onUpdateProfile(event) {
    const {
      sex,
      age,
      weight,
      height,
      chest,
      waist,
      hip
    } = this.state;

    this.setState({
      statusOtherAttributes: "default"
    })

    if (sex !== "" && age !== "" && weight !== "" && height !== "" && chest !== "" && waist !== "" && hip !== "") {
      const other_attributes = {
        sex,
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
        chest: Number(chest),
        waist: Number(waist),
        hip: Number(hip)
      }

      this.setState({
        other_attributes: other_attributes
      })

      if (this.props.user && this.props.user.other_attributes) {
        // ให้จัดตารางVDO และ updateBodyInfo (ที่ componentDidUpdate)
        this.props.createCustomWeekForUser(
          this.props.user.user_id,
          JSON.parse(this.props.user.other_attributes).weight,
          this.props.user.start_date,
          this.props.user.expire_date,
          this.props.user.offset
        );
      } else { //ถ้า other_attributes = NULL ให้ update ฟิลด์ other_attributes ของ member
        this.props.updateProfile(
          this.props.user.email,
          other_attributes
        );
      }

    } else {
      this.setState({
        statusOtherAttributes: "fail"
      })
    }
  };

  renderEditVDO() {
    const { focusDay, selectedVDO, tempPlaylist, selectChangeVideoList } = this.state;
    const videoUrl = selectedVDO ? `https://media.planforfit.com/bebe/video/${selectedVDO.video_id}_720.mp4` : "";
    let allMinute = [];
    let allSecond = [];
    tempPlaylist.map((item) => (allMinute.push(Number((item.duration.toFixed(2)).split(".")[0]))));
    tempPlaylist.map((item) => (allSecond.push(Number((item.duration.toFixed(2)).split(".")[1]))));
    let sumMinute = allMinute.reduce((acc, curr) => acc += curr, 0).toFixed(0);
    let sumSecond = allSecond.reduce((acc, curr) => acc += curr, 0).toFixed(0);
    let minute2 = Math.floor(sumSecond / 60);
    let totalMinute = Number(sumMinute) + Number(minute2);
    let totalSecond = sumSecond % 60;
    let timesExercise;
    if (totalSecond < 10) {
      timesExercise = `${totalMinute}:0${totalSecond}`;
    } else {
      timesExercise = `${totalMinute}:${totalSecond}`;
    }

    return (
      <div className="card-body d-flex justify-content-center">

        <form className="mt-3">
          <span className="mr-5" style={{ fontSize: "15px", color: "#F45197" }}> <h4> แก้ไขคลิปออกกำลังกาย</h4></span>

          <div className="popup" id="popupSelectEditVideo">
            <div className="overlay" onClick={() => this.closeTogglePopupSelectEditVideo()}>
              <div className="close-btn">X</div>
            </div>
            <div className="content">
              <div className="row mt-4">
                {
                  (this.props.videos[0]) &&
                  <img className="body_part ml-5" src={`../assets/img/body_part/${this.props.videos[0].type.toLowerCase().split(" ").join("")}.png`}></img>
                }
                {
                  (this.props.videos[0]) &&
                  (this.props.videos[0].type.toLowerCase().split(" ").join("") === "armfocus") && <img className="body_part ml-2" src={`../assets/img/body_part/shoulder.png`}></img>
                }
                {
                  (this.props.videos[0]) &&
                  (this.props.videos[0].type.toLowerCase().split(" ").join("") === "backfocus") && <img className="body_part ml-2" src={`../assets/img/body_part/core.png`}></img>
                }
                {
                  (this.props.videos[0]) &&
                  (this.props.videos[0].type.toLowerCase().split(" ").join("") === "warmup") &&
                  <h2 className="ml-2 mt-1" style={{ color: "#F45197" }}><b>Warm Up</b></h2>
                }
                {
                  (this.props.videos[0]) &&
                  (this.props.videos[0].type.toLowerCase().split(" ").join("") === "chestfocus") &&
                  <h2 className="ml-2 mt-1" style={{ color: "#F45197" }}><b>Chest</b></h2>
                }
                {
                  (this.props.videos[0]) &&
                  (this.props.videos[0].type.toLowerCase().split(" ").join("") === "backfocus") &&
                  <h2 className="ml-2 mt-1" style={{ color: "#F45197" }}><b>Back and Core</b></h2>
                }
                {
                  (this.props.videos[0]) &&
                  (this.props.videos[0].type.toLowerCase().split(" ").join("") === "legfocus") &&
                  <h2 className="ml-2 mt-1" style={{ color: "#F45197" }}><b>Leg</b></h2>
                }
                {
                  (this.props.videos[0]) &&
                  (this.props.videos[0].type.toLowerCase().split(" ").join("") === "armfocus") &&
                  <h2 className="ml-2 mt-1" style={{ color: "#F45197" }}><b>Arm and Shoulder</b></h2>
                }
                {
                  (this.props.videos[0]) &&
                  (this.props.videos[0].type.toLowerCase().split(" ").join("") === "subcircuit") &&
                  <h2 className="ml-2 mt-1" style={{ color: "#F45197" }}><b>Full Body</b></h2>
                }
                {
                  (this.props.videos[0]) &&
                  (this.props.videos[0].type.toLowerCase().split(" ").join("") === "cardio") &&
                  <h2 className="ml-2 mt-1" style={{ color: "#F45197" }}><b>Cardio</b></h2>
                }
              </div>
              <div className="selectEditPlaylist">
                {
                  selectChangeVideoList.map((item, index) => (

                    <div className="playlistWrapper border shadow" >
                      <div className="">
                        <video className="" width="100%" height="50%" controls muted style={{ borderRadius: "20px 20px 0px 0px", overflow: "hidden" }}>
                          <source src={`https://media.planforfit.com/bebe/video/${item.video_id}_720.mp4`} type="video/mp4"></source>
                        </video>
                      </div>
                      <div className="mt-1 ml-3 mb-4">
                        <h6><b> {item.name} </b></h6>
                      </div>
                      <button
                        className="btn btn-danger mb-3 mt-5"
                        type="button"
                        style={{ fontSize: "15px", cursor: "pointer", padding: "10px 24px", marginLeft: "auto", marginRight: "auto", display: "block", width: "85%", backgroundColor: "#F45197", borderRadius: "20px" }}
                        onClick={() => this.selectEditVideo(item)}
                      >
                        <b>เลือกวีดีโอนี้</b>
                      </button>
                    </div>
                  ))
                }
              </div>
              <div className="close-btn2 mt-3" style={{ cursor: "pointer", color: "#F45197" }} onClick={() => this.closeTogglePopupSelectEditVideo()}><b>CLOSE</b></div>
            </div>
          </div>

          <div className="tab-content mb-2" id="myTabContent">
            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
              <nav className="nav">
                {focusDay === 0 && <b>DAY1</b>}
                {focusDay === 1 && <b>DAY2</b>}
                {focusDay === 2 && <b>DAY3</b>}
                {focusDay === 3 && <b>DAY4</b>}
              </nav>
            </div>
            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">pppp</div>
            <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">kkkkk</div>
          </div>

          <div className="">
            <div className="trailer" id={`popupVDO`}>
              <video ref="videoPlayer" src={videoUrl} id="videoPlayer" controls controlsList="nodownload" disablePictureInPicture ></video>
              <img alt="" src="../assets/img/thumb/close.png" className="close" onClick={() => this.toggle()}></img>
            </div>
            <div className="trailer" id={`popupVDOList`}>
              <video ref="videoPlayerList" src={videoUrl} id="videoPlayerList" controls controlsList="nodownload" disablePictureInPicture></video>
              <img alt="" src="../assets/img/thumb/close.png" className="close" onClick={() => this.closeList()}></img>
            </div>
            <table className="table table-responsive">
              <thead>
                <tr>
                  <th className="tabletitle row">
                    {
                      <span className="col-lg-8 col-md-4 col-12" style={{ fontSize: "15px" }}> รวมเวลาฝึก {timesExercise} นาที</span>
                    }
                    <div className="col-lg-2 col-md-4 col-6">
                      <button
                        className="btn btn-light" type="button"
                        style={{ backgroundColor: "white", color: "#F45197", borderColor: "#F45197", fontSize: "17px", cursor: "pointer", borderRadius: "12px", width: "100%", padding: "10px" }}
                        onClick={() => this.closeEditVDO()}
                      >
                        <b>ยกเลิก</b>
                      </button>
                    </div>
                    <div className="col-lg-2 col-md-4 col-6">
                      <button
                        className="btn"
                        type="button"
                        style={{ backgroundColor: "#F45197", color: "white", fontSize: "17px", cursor: "pointer", borderRadius: "12px", float: "right", width: "100%", padding: "10px" }}
                        onClick={() => this.onVideoListUpdate()}
                      >
                        <b>ยืนยันการแก้ไข</b>
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  tempPlaylist.map((item, index) => (
                    <div className="row" key={index}>
                      <div className="checkCompleteVideo mt-3 col-lg-2 col-md-1 col-2">
                        {
                          (index === 0) && <h6 className="firstVideoStartText">เริ่มกันเลย!</h6>
                        }
                        {
                          (item.play_time === item.duration) ?
                            <span className="dot" style={{ backgroundColor: "#F45197" }}>
                              <h5 style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "white" }}><i className="fa fa-check fa-lg" ></i></h5>
                            </span>
                            :
                            <span className="dot">
                              <h3 style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>{index + 1}</h3>
                            </span>
                        }
                        {
                          (index === tempPlaylist.length - 1) ?
                            <div className="vl" style={{ height: "0%" }}></div>
                            :
                            <div className="vl"></div>
                        }
                        {
                          (index === tempPlaylist.length - 1) && <h6 className="lastVideoEndText">สำเร็จแล้ว!</h6>
                        }
                      </div>
                      <div className="mt-3 mb-1 col-lg-8 col-md-11 col-10">
                        <div className="videoItem border shadow">
                          <img className="" src="../assets/img/thumb/play_button.png" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: "1", cursor: "pointer" }} onClick={() => this.toggle(item)}></img>
                          <div className="videoThumb mr-5">
                            <div className="containerThumb">
                              <img className="img-fluid" onClick={() => this.toggle(item)} src={`../assets/img/thumb/${item.category.toLowerCase().split(" ").join("")}_g3.jpg`} alt="" />
                              {/* <div className="overlay" onClick={() => this.toggle(item)}>
                                <i className="fa fa-play fa-4x" aria-hidden="true"></i>
                                <div className="videoDuration" style={{ position: "absolute", right: "5%", bottom: "0", color: "white" }}>
                                  <h6>
                                    <b>{(item.duration + "").split(".")[0]}:{(item.duration + "").split(".")[1]} นาที</b>
                                  </h6>
                                </div>
                              </div> */}
                            </div>
                          </div>
                          <div className="videoDetail">
                            <div className="videoDuration mt-3" style={{ position: "absolute", right: "5%", top: "0", color: "grey" }}>
                              <h6>
                                <i className="fa fa-clock-o fa-1x mr-2" aria-hidden="true"></i>
                                {(item.duration + "").split(".")[0]}:
                                {
                                  ((item.duration + "").split(".")[1]) ?
                                    ((item.duration + "").split(".")[1].length < 2) ?
                                      ((item.duration + "").split(".")[1]) + "0"
                                      :
                                      ((item.duration + "").split(".")[1])
                                    : "00"
                                } นาที
                              </h6>
                            </div>
                            <hr className="" style={{ width: "100%", marginTop: "40px" }}></hr>
                            <div className="videoName">
                              <p style={{ color: "grey", marginBottom: "0px", marginTop: "0px" }}> {item.category} </p>
                              {(item.name.length < 17) ?
                                <h4 style={{ color: "#F45197" }}><b>{item.name}</b></h4>
                                :
                                <h6 style={{ color: "#F45197" }}><b>{item.name}</b></h6>
                              }
                            </div>
                            <img className="body_part" src={`../assets/img/body_part/${item.type.toLowerCase().split(" ").join("")}.png`}></img>
                            {
                              (item.type.toLowerCase().split(" ").join("") === "armfocus") && <img className="body_part ml-2" src={`../assets/img/body_part/shoulder.png`}></img>
                            }
                            {
                              (item.type.toLowerCase().split(" ").join("") === "backfocus") && <img className="body_part ml-2" src={`../assets/img/body_part/core.png`}></img>
                            }

                          </div>
                        </div>
                      </div>
                      {
                        (item.play_time !== item.duration) && (item.category !== "Warm Up" && item.category !== "Cool Down" && item.category !== "Challenge") &&
                        <div className="col col-lg-2 mt-3">
                          <div className="changeVideoBtn" onClick={() => this.togglePopupSelectEditVideo(item.video_id, item.category, item.type, index)} >
                            <i className="fa fa-circle fa-1x" aria-hidden="true" />
                            เปลี่ยนวีดีโอ
                          </div>
                          <div className="randomVideoBtn" onClick={() => this.randomVideo(item.video_id, item.category, item.type, index)} >
                            <i className="fa fa-circle fa-1x" aria-hidden="true" />
                            สุ่มวีดีโอ
                          </div>
                        </div>
                      }
                    </div>
                  ))
                }
              </tbody>
            </table>
          </div>
        </form>

      </div>
    )
  }

  renderBasicInfo() {
    const { statusOtherAttributes } = this.state;
    return (
      <div>
        <div className="card shadow mb-4 col-lg-6 offset-lg-3 col-md-12 col-12" style={{ borderRadius: "20px" }}>
          <div className="mb-3 col-lg-12  col-md-12 col-12">
            <center>
              <h2 className="mt-5 mb-4" style={{ color: "#F45197" }}><b>ยินดีต้อนรับสู่ Bebe Fit Routine</b></h2>
              <h5>กรุณากรอกข้อมูลด้านล่างเพื่อที่คุณจะได้รับประสบการณ์</h5>
              <h5>โปรแกรมออกกำลังกายสำหรับคุณโดยเฉพาะ</h5>
            </center>
          </div>
          <div className="col-lg-8 offset-lg-2 col-md-8 offset-md-2 col-12">
            <p style={{ color: "#F45197" }}>เพศ</p>
            <div className="form-check" onChange={this.onChangeValue}>
              <label className="form-check-label mb-3 mr-4">
                <input
                  className="form-check-input"
                  type="radio"
                  value="male"
                  name="sex"
                  checked={this.state.sex === "male"}
                  onChange={this.onChange}
                /> ชาย
                          <span className="circle">
                  <span className="check"></span>
                </span>
              </label>
              <label className="form-check-label" style={{ marginLeft: "20px" }}>
                <input
                  className="form-check-input"
                  type="radio"
                  value="female"
                  name="sex"
                  checked={this.state.sex === "female"}
                  onChange={this.onChange}
                /> หญิง
                          <span className="circle">
                  <span className="check"></span>
                </span>
              </label>
            </div>
          </div>

          <div className="col-lg-8 offset-lg-2 col-md-8 offset-md-2 col-12">
            <div className="form-group">
              <label for="age" className="bmd-label-floating" style={{ color: "#F45197" }}>อายุ</label>
              <input
                type="number"
                className="form-control"
                id="age"
                name="age"
                step="1"
                value={this.state.age}
                onChange={(event) => this.handleChange(event)}
              />
            </div>
            {
              (statusOtherAttributes === "ageNotUseDecimals") &&
              <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "red" }}>อายุ ห้ามเป็นเลขทศนิยม</h6></small>
            }
            {
              (statusOtherAttributes === "fail" && this.state.age === "") &&
              <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "red" }}>กรุณากรอกข้อมูล</h6></small>
            }
          </div>
          <div className="col-lg-8 offset-lg-2 col-md-8 offset-md-2 col-12">
            <div className="form-group">
              <label for="weight" className="bmd-label-floating" style={{ color: "#F45197" }}>น้ำหนัก (กก.)</label>
              <input
                type="number"
                className="form-control"
                id="weight"
                name="weight"
                step=".01"
                value={this.state.weight}
                onChange={(event) => this.handleChange(event)}
              />
            </div>
            {
              (statusOtherAttributes === "fail" && this.state.weight === "") &&
              <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "red" }}>กรุณากรอกข้อมูล</h6></small>
            }
          </div>
          <div className="col-lg-8 offset-lg-2 col-md-8 offset-md-2 col-12">
            <div className="form-group">
              <label for="height" className="bmd-label-floating" style={{ color: "#F45197" }}>ส่วนสูง (ซม.)</label>
              <input
                type="number"
                className="form-control"
                id="height"
                name="height"
                step=".01"
                value={this.state.height}
                onChange={(event) => this.handleChange(event)}
              />
            </div>
            {
              (statusOtherAttributes === "fail" && this.state.height === "") &&
              <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "red" }}>กรุณากรอกข้อมูล</h6></small>
            }
          </div>
          <div className="mb-5 mt-4 col-lg-8 offset-lg-2 col-md-8 offset-md-2 col-12">
            <div className="text-center">
              <Button
                color="danger"
                className="btn-shadow"
                size="lg"
                onClick={() => this.onUpdateBasicInfo()}
                block
                style={{ backgroundColor: "#F45197" }}
              >
                ถัดไป
            </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderBodyInfo() {
    const { statusOtherAttributes } = this.state;
    return (
      <div className="card shadow mb-4 col-lg-6 offset-lg-3 col-md-12 col-12" style={{ borderRadius: "20px" }}>
        <div className="mt-5 mb-5 col-lg-12  col-md-12 col-12">
          <center>
            <h5>กรุณาวัดสัดส่วนของคุณ</h5>
            <h5>โดยใช้รูปตัวอย่างเพื่อเป็นไกด์ในการวัดสัดส่วน</h5>
          </center>
        </div>
        <div className="row">
          <div className="col-md-3 offset-md-1">
            <div className="form-group">
              <label for="chest" className="bmd-label-floating" style={{ color: "#F45197" }}>รอบอก (นิ้ว)</label>
              <input
                type="number"
                className="form-control"
                id="chest"
                name="chest"
                step=".01"
                value={this.state.chest}
                onChange={(event) => this.handleChange(event)} />
            </div>
            {
              (statusOtherAttributes === "fail" && this.state.chest === "") &&
              <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "red" }}>กรุณากรอกข้อมูล</h6></small>
            }
            <div className="form-group">
              <label for="waist" className="bmd-label-floating" style={{ color: "#F45197" }}>รอบเอว (นิ้ว)</label>
              <input
                type="number"
                className="form-control"
                id="waist"
                name="waist"
                step=".01"
                value={this.state.waist}
                onChange={(event) => this.handleChange(event)}
              />
            </div>
            {
              (statusOtherAttributes === "fail" && this.state.waist === "") &&
              <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "red" }}>กรุณากรอกข้อมูล</h6></small>
            }
            <div className="form-group">
              <label for="hip" className="bmd-label-floating" style={{ color: "#F45197" }}>สะโพก (นิ้ว)</label>
              <input
                type="number"
                className="form-control"
                id="hip"
                name="hip"
                step=".01"
                value={this.state.hip} onChange={(event) => this.handleChange(event)}
              />
            </div>
            {
              (statusOtherAttributes === "fail" && this.state.hip === "") &&
              <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "red" }}>กรุณากรอกข้อมูล</h6></small>
            }
          </div>

          <div className="col-md-7">
            <div className="d-flex ">
              {
                (this.state.sex === "male") && <img src="../assets/img/man.png" width="100%" alt="" />
              }
              {
                (this.state.sex === "female") && <img src="../assets/img/woman.png" width="100%" alt="" />
              }
            </div>
          </div>

        </div>

        <div className="space-70 mb-5"></div>
        <div className="form-group mb-5">
          <div className="text-center">
            <div className="row">
              <div className="col-md-5 offset-md-1">
                <Button
                  color="danger"
                  className="btn-shadow"
                  size="lg"
                  onClick={() => this.setState({ otherAttributesPage: "basicInfo" })}
                  block
                  style={{ backgroundColor: "white", color: "#F45197", borderColor: "#F45197" }}
                >ย้อนกลับ</Button>
              </div>
              <div className="col-md-5">
                <Button
                  color="danger"
                  className="btn-shadow"
                  size="lg"
                  onClick={() => this.onUpdateProfile()}
                  block
                  style={{ backgroundColor: "#F45197" }}
                >ยืนยัน</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderOtherAttribute() {
    const { otherAttributesPage } = this.state;
    return (
      <div className="card-body">
        <form>
          {(otherAttributesPage === "basicInfo") && this.renderBasicInfo()}
          {(otherAttributesPage === "bodyInfo") && this.renderBodyInfo()}
        </form>
      </div>
    )
  }

  renderVideoList() {
    const { focusDay, selectedVDO } = this.state;
    const videoUrl = selectedVDO ? `https://media.planforfit.com/bebe/video/${selectedVDO.video_id}_720.mp4` : "";
    const todayExercise = this.exerciseDaySelection(focusDay);
    let allMinute = [];
    let allSecond = [];
    if (this.props.exerciseVideo) {
      todayExercise.map((item) => (allMinute.push(Number((item.duration.toFixed(2)).split(".")[0]))));
      todayExercise.map((item) => (allSecond.push(Number((item.duration.toFixed(2)).split(".")[1]))));
    }
    let sumMinute = allMinute.reduce((acc, curr) => acc += curr, 0).toFixed(0);
    let sumSecond = allSecond.reduce((acc, curr) => acc += curr, 0).toFixed(0);
    let minute2 = Math.floor(sumSecond / 60);
    let totalMinute = Number(sumMinute) + Number(minute2);
    let totalSecond = sumSecond % 60;
    let timesExercise;
    if (totalSecond < 10) {
      timesExercise = `${totalMinute}:0${totalSecond}`;
    } else {
      timesExercise = `${totalMinute}:${totalSecond}`;
    }

    return (
      <div className="card-body d-flex justify-content-center">
        <form>
          <div className="tab-content mt-3 mb-2" id="myTabContent">
            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
              <h4 className="ml-3" style={{ color: "#F45197" }}>โปรแกรมปัจจุบัน</h4>
              <nav className="nav">
                <a
                  className="nav-link"
                  style={{ color: `${focusDay === 0 ? "black" : "grey"}`, cursor: "pointer" }}
                  onClick={() => this.onDayChange(0)}
                >
                  <b>DAY1</b>
                </a>
                <a
                  className="nav-link"
                  style={{ color: `${focusDay === 1 ? "black" : "grey"}`, cursor: "pointer" }}
                  onClick={() => this.onDayChange(1)}
                >
                  <b>DAY2</b>
                </a>
                <a
                  className="nav-link"
                  style={{ color: `${focusDay === 2 ? "black" : "grey"}`, cursor: "pointer" }}
                  onClick={() => this.onDayChange(2)}
                >
                  <b>DAY3</b>
                </a>
                <a
                  className="nav-link"
                  style={{ color: `${focusDay === 3 ? "black" : "grey"}`, cursor: "pointer" }}
                  onClick={() => this.onDayChange(3)}
                >
                  <b>DAY4</b>
                </a>
                {
                  (!this.props.isFirstWeek) && // !isFirstWeek คือ ไม่ใช่ Week1
                  <a
                    className="nav-link ml-auto"
                    style={{ cursor: "pointer", color: "#F45197" }}
                    onClick={() => this.setState({ lastWeekVDO_click: "show" })}
                  >
                    <u>ดูวีดีโอออกกำลังกายสัปดาห์ที่ผ่านมา</u>
                  </a>
                }
              </nav>
            </div>
            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">pppp</div>
            <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">kkkkk</div>
          </div>

          <div className="">
            <div className="trailer" id={`popupVDO`}>
              <video ref="videoPlayer" src={videoUrl} id="videoPlayer" controls controlsList="nodownload" disablePictureInPicture></video>
              <img alt="" src="../assets/img/thumb/close.png" className="close" onClick={() => this.toggle()}></img>
            </div>
            <div className="trailer" id={`popupVDOList`}>
              <video ref="videoPlayerList" src={videoUrl} id="videoPlayerList" controls controlsList="nodownload" disablePictureInPicture></video>
              <img alt="" src="../assets/img/thumb/close.png" className="close" onClick={() => this.closeList()}></img>
            </div>
            <table className="table table-responsive">
              <thead>
                <tr>
                  <th className="tabletitle row">
                    {
                      <span className="col-lg-7 col-md-4 col-12 mb-3" style={{ fontSize: "15px", float: "left" }}> รวมเวลาฝึก {timesExercise} นาที</span>
                    }
                    <div className="col-lg-3 col-md-5 col-12">
                      <div
                        className="mb-3"
                        style={{ fontSize: "18px", cursor: "pointer", float: "right", color: "#F45197" }}
                        onClick={() => this.editVDO()} aria-hidden="true">
                        <i className="fa fa-pencil-square-o fa-1x mr-1" />
                        แก้ไขคลิปออกกำลังกาย
                      </div>
                    </div>
                    {
                      todayExercise && (todayExercise[todayExercise.length - 1] && todayExercise[todayExercise.length - 1].play_time) !== (todayExercise[todayExercise.length - 1] && todayExercise[todayExercise.length - 1].duration) &&
                      <div className="col-lg-2 col-md-3 col-12">
                        <div
                          className="mb-3"
                          style={{ fontSize: "18px", cursor: "pointer", float: "right", color: "#F45197" }}
                          onClick={() => this.toggleList()} aria-hidden="true">
                          <i className="fa fa-play-circle fa-1x mr-1" />
                        เล่นต่อเนื่อง
                      </div>
                      </div>
                    }
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  (this.props.exerciseVideo) &&
                  (todayExercise.map((item, index) => (
                    <div className="row" key={index}>
                      <div className="checkCompleteVideo mt-3 col-lg-2 col-md-1 col-2">
                        {
                          (index === 0) && <h6 className="firstVideoStartText">เริ่มกันเลย!</h6>
                        }
                        {
                          (item.play_time === item.duration) ?
                            <span className="dot" style={{ backgroundColor: "#F45197" }}>
                              <h5 style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "white" }}><i className="fa fa-check fa-lg" ></i></h5>
                            </span>
                            :
                            <span className="dot">
                              <h3 style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>{index + 1}</h3>
                            </span>
                        }
                        {
                          (index === todayExercise.length - 1) ?
                            <div className="vl" style={{ height: "0%" }}></div>
                            :
                            <div className="vl"></div>
                        }
                        {
                          (index === todayExercise.length - 1) && <h6 className="lastVideoEndText">สำเร็จแล้ว!</h6>
                        }
                      </div>
                      <div className="mt-3 mb-1 col-lg-8 col-md-11 col-10">
                        <div className="videoItem border shadow">
                          <img className="" src="../assets/img/thumb/play_button.png" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: "1", cursor: "pointer" }} onClick={() => this.toggle(item)}></img>
                          <div className="videoThumb mr-5">
                            <div className="containerThumb">
                              <img className="img-fluid" onClick={() => this.toggle(item)} src={`../assets/img/thumb/${item.category.toLowerCase().split(" ").join("")}_g3.jpg`} alt="" />
                              {/* <div className="overlay" onClick={() => this.toggle(item)}>
                                <i className="fa fa-play fa-4x" aria-hidden="true"></i>
                                <div className="videoDuration" style={{ position: "absolute", right: "5%", bottom: "0", color: "white" }}>
                                  <h6>
                                    <b>{(item.duration + "").split(".")[0]}:{(item.duration + "").split(".")[1]} นาที</b>
                                  </h6>
                                </div>
                              </div> */}
                            </div>
                          </div>
                          <div className="videoDetail">
                            <div className="videoDuration mt-3" style={{ position: "absolute", right: "5%", top: "0", color: "grey" }}>
                              <h6>
                                <i className="fa fa-clock-o fa-1x mr-2" aria-hidden="true"></i>
                                {(item.duration + "").split(".")[0]}:
                                {
                                  ((item.duration + "").split(".")[1]) ?
                                    ((item.duration + "").split(".")[1].length < 2) ?
                                      ((item.duration + "").split(".")[1]) + "0"
                                      :
                                      ((item.duration + "").split(".")[1])
                                    : "00"
                                } นาที
                              </h6>
                            </div>
                            <hr className="" style={{ width: "100%", marginTop: "40px" }}></hr>
                            <div className="videoName">
                              <p style={{ color: "grey", marginBottom: "0px", marginTop: "0px" }}> {item.category} </p>
                              {(item.name.length < 17) ?
                                <h4 style={{ color: "#F45197" }}><b>{item.name}</b></h4>
                                :
                                <h6 style={{ color: "#F45197" }}><b>{item.name}</b></h6>
                              }
                            </div>
                            <img className="body_part" src={`../assets/img/body_part/${item.type.toLowerCase().split(" ").join("")}.png`}></img>
                            {
                              (item.type.toLowerCase().split(" ").join("") === "armfocus") && <img className="body_part ml-2" src={`../assets/img/body_part/shoulder.png`}></img>
                            }
                            {
                              (item.type.toLowerCase().split(" ").join("") === "backfocus") && <img className="body_part ml-2" src={`../assets/img/body_part/core.png`}></img>
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                  )))
                }
              </tbody>
            </table>
          </div>
        </form>

      </div>
    )
  }

  renderVideoListLastWeek() {
    const { focusDay, selectedVDO } = this.state;
    const videoUrl = selectedVDO ? `https://media.planforfit.com/bebe/video/${selectedVDO.video_id}_720.mp4` : "";
    const todayExercise = this.exerciseDaySelectionLastWeek(focusDay);
    let allMinute = [];
    let allSecond = [];
    if (this.props.exerciseVideoLastWeek) {
      todayExercise.map((item) => (allMinute.push(Number((item.duration.toFixed(2)).split(".")[0]))));
      todayExercise.map((item) => (allSecond.push(Number((item.duration.toFixed(2)).split(".")[1]))));
    }
    let sumMinute = allMinute.reduce((acc, curr) => acc += curr, 0).toFixed(0);
    let sumSecond = allSecond.reduce((acc, curr) => acc += curr, 0).toFixed(0);
    let minute2 = Math.floor(sumSecond / 60);
    let totalMinute = Number(sumMinute) + Number(minute2);
    let totalSecond = sumSecond % 60;
    let timesExercise;
    if (totalSecond < 10) {
      timesExercise = `${totalMinute}:0${totalSecond}`;
    } else {
      timesExercise = `${totalMinute}:${totalSecond}`;
    }

    return (
      <div className="card-body d-flex justify-content-center">
        <form>
          <div className="tab-content mt-3 mb-2" id="myTabContent">
            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
              <h4 className="ml-3" style={{ color: "#F45197" }}>โปรแกรมสัปดาห์ที่ผ่านมา</h4>
              <nav className="nav">
                <a
                  className="nav-link"
                  style={{ color: `${focusDay === 0 ? "black" : "grey"}`, cursor: "pointer" }}
                  onClick={() => this.onDayChange(0)}
                >
                  <b>DAY1</b>
                </a>
                <a
                  className="nav-link"
                  style={{ color: `${focusDay === 1 ? "black" : "grey"}`, cursor: "pointer" }}
                  onClick={() => this.onDayChange(1)}
                >
                  <b>DAY2</b>
                </a>
                <a
                  className="nav-link"
                  style={{ color: `${focusDay === 2 ? "black" : "grey"}`, cursor: "pointer" }}
                  onClick={() => this.onDayChange(2)}
                >
                  <b>DAY3</b>
                </a>
                <a
                  className="nav-link"
                  style={{ color: `${focusDay === 3 ? "black" : "grey"}`, cursor: "pointer" }}
                  onClick={() => this.onDayChange(3)}
                >
                  <b>DAY4</b>
                </a>
                <a
                  className="nav-link ml-auto"
                  style={{ cursor: "pointer", color: "#F45197" }}
                  onClick={() => this.setState({ lastWeekVDO_click: "default" })}
                >
                  <u>ดูวีดีโอออกกำลังกายปัจจุบัน</u>
                </a>
              </nav>
            </div>
            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">pppp</div>
            <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">kkkkk</div>
          </div>

          <div className="">
            <div className="trailer" id={`popupVDO`}>
              <video ref="videoPlayer" src={videoUrl} id="videoPlayer" controls controlsList="nodownload" disablePictureInPicture></video>
              <img alt="" src="../assets/img/thumb/close.png" className="close" onClick={() => this.toggle()}></img>
            </div>
            <div className="trailer" id={`popupVDOList`}>
              <video ref="videoPlayerList" src={videoUrl} id="videoPlayerList" controls controlsList="nodownload" disablePictureInPicture></video>
              <img alt="" src="../assets/img/thumb/close.png" className="close" onClick={() => this.closeList()}></img>
            </div>
            <table className="table table-responsive">
              <thead>
                <tr>
                  <th className="tabletitle row">
                    {
                      <span className="col-lg-7 col-md-4 col-12 mb-3" style={{ fontSize: "15px", float: "left" }}> รวมเวลาฝึก {timesExercise} นาที</span>
                    }
                    <div className="col-lg-3 col-md-5 col-12">
                    </div>
                    {
                      ((todayExercise && todayExercise[todayExercise.length - 1].play_time)) !== (todayExercise && (todayExercise[todayExercise.length - 1].duration)) &&
                      <div className="col-lg-2 col-md-3 col-12">
                        <div
                          className="mb-3"
                          style={{ fontSize: "18px", cursor: "pointer", float: "right", color: "#F45197" }}
                          onClick={() => this.toggleListLastWeek()} aria-hidden="true">
                          <i className="fa fa-play-circle fa-1x mr-1" />
                        เล่นต่อเนื่อง
                      </div>
                      </div>
                    }
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  (this.props.exerciseVideoLastWeek) &&
                  (todayExercise.map((item, index) => (
                    <div className="row" key={index}>
                      <div className="checkCompleteVideo mt-3 col-lg-2 col-md-1 col-2">
                        {
                          (index === 0) && <h6 className="firstVideoStartText">เริ่มกันเลย!</h6>
                        }
                        {
                          (item.play_time === item.duration) ?
                            <span className="dot" style={{ backgroundColor: "#F45197" }}>
                              <h5 style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "white" }}><i className="fa fa-check fa-lg" ></i></h5>
                            </span>
                            :
                            <span className="dot">
                              <h3 style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>{index + 1}</h3>
                            </span>
                        }
                        {
                          (index === todayExercise.length - 1) ?
                            <div className="vl" style={{ height: "0%" }}></div>
                            :
                            <div className="vl"></div>
                        }
                        {
                          (index === todayExercise.length - 1) && <h6 className="lastVideoEndText">สำเร็จแล้ว!</h6>
                        }
                      </div>
                      <div className="mt-3 mb-1 col-lg-8 col-md-11 col-10">
                        <div className="videoItem border shadow">
                          <img className="" src="../assets/img/thumb/play_button.png" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: "1", cursor: "pointer" }} onClick={() => this.toggle(item)}></img>
                          <div className="videoThumb mr-5">
                            <div className="containerThumb">
                              <img className="img-fluid" onClick={() => this.toggle(item)} src={`../assets/img/thumb/${item.category.toLowerCase().split(" ").join("")}_g3.jpg`} alt="" />
                              {/* <div className="overlay" onClick={() => this.toggle(item)}>
                                <i className="fa fa-play fa-4x" aria-hidden="true"></i>
                                <div className="videoDuration" style={{ position: "absolute", right: "5%", bottom: "0", color: "white" }}>
                                  <h6>
                                    <b>{(item.duration + "").split(".")[0]}:{(item.duration + "").split(".")[1]} นาที</b>
                                  </h6>
                                </div>
                              </div> */}
                            </div>
                          </div>
                          <div className="videoDetail">
                            <div className="videoDuration mt-3" style={{ position: "absolute", right: "5%", top: "0", color: "grey" }}>
                              <h6>
                                <i className="fa fa-clock-o fa-1x mr-2" aria-hidden="true"></i>
                                {(item.duration + "").split(".")[0]}:
                                {
                                  ((item.duration + "").split(".")[1]) ?
                                    ((item.duration + "").split(".")[1].length < 2) ?
                                      ((item.duration + "").split(".")[1]) + "0"
                                      :
                                      ((item.duration + "").split(".")[1])
                                    : "00"
                                } นาที
                              </h6>
                            </div>
                            <hr className="" style={{ width: "100%", marginTop: "40px" }}></hr>
                            <div className="videoName">
                              <p style={{ color: "grey", marginBottom: "0px", marginTop: "0px" }}> {item.category} </p>
                              {(item.name.length < 17) ?
                                <h4 style={{ color: "#F45197" }}><b>{item.name}</b></h4>
                                :
                                <h6 style={{ color: "#F45197" }}><b>{item.name}</b></h6>
                              }
                            </div>
                            <img className="body_part" src={`../assets/img/body_part/${item.type.toLowerCase().split(" ").join("")}.png`}></img>
                            {
                              (item.type.toLowerCase().split(" ").join("") === "armfocus") && <img className="body_part ml-2" src={`../assets/img/body_part/shoulder.png`}></img>
                            }
                            {
                              (item.type.toLowerCase().split(" ").join("") === "backfocus") && <img className="body_part ml-2" src={`../assets/img/body_part/core.png`}></img>
                            }

                          </div>
                        </div>
                      </div>
                    </div>

                  )))
                }
              </tbody>
            </table>
          </div>
        </form>

      </div>
    )
  }

  renderPopupDailyWeighChallenge() {
    return (
      <div>
        <div
          className="overlayContainerPopupDailyWeighChallenge"
          id="overlayPopupDailyWeighChallenge"
          onClick={() => this.closePopupDailyWeighChallenge()}
        />
        <div className="popupDailyWeighChallenge" id="popupDailyWeighChallenge" style={{ borderRadius: "25px" }}>
          <br></br>
          <center><h5 className="mt-1 mb-3" style={{ color: "#F45197" }}><b>กรุณากรอกน้ำหนักปัจจุบันของคุณ</b></h5></center>
          <div class="input-group mb-4">
            <input
              type="number"
              className="form-control"
              style={{ textAlign: "right" }}
              id="weightInDailyWeighChallenge"
              value={this.state.weightInDailyWeighChallenge}
              onChange={(event) => this.handleChange(event)}
            />
            <span className="input-group-text" style={{ color: "#F45197" }}>KG</span>
          </div>
          {
            (this.props.statusPostDailyWeighChallenge !== "loading") ?
              <div className="row">
                <div className="col-1"></div>
                <button type="button" className="btn btn-secondary col-4" onClick={() => this.closePopupDailyWeighChallenge()}>ปิด</button>
                <div className="col-2"></div>
                <button type="button" className="btn btn-danger col-4" onClick={() => this.submitDailyWeighChallenge(this.state.weightInDailyWeighChallenge)} style={{ backgroundColor: "#F45197" }}>ยืนยัน</button>
                <div className="col-1"></div>
              </div>
              :
              <div />
          }
        </div>
      </div>
    )
  }

  closePopupDailyWeighChallenge() {
    document.getElementById("popupDailyWeighChallenge").classList.toggle("active");
    document.getElementById("overlayPopupDailyWeighChallenge").classList.toggle("active");
  }

  submitDailyWeighChallenge(weight) {
    const { user } = this.props;
    if (weight > 0 && weight < 300) {
      this.props.postDailyWeighChallenge(user.user_id, weight)
    }
  }

  render() {
    const { editVDO_click, lastWeekVDO_click } = this.state;
    const { dailyWeighChallenge } = this.props;
    return (
      < div >
        {
          (dailyWeighChallenge && (this.props.user && this.props.user.group_id)) &&
          this.renderPopupDailyWeighChallenge()
        }
        <div className="page-header header-small" data-parallax="true"
          style={{ backgroundImage: `url(${bghead})` }}>
          <div className="overlay">
            <video className="mt-4" width="100%" height="100%" controls controlsList="nodownload" disablePictureInPicture autoPlay muted >
              <source src="https://media.planforfit.com/bebe/video/INTRO%20PROGRAM.mp4" type="video/mp4"></source>
            </video>
          </div>
        </div>

        <ul className="nav nav-tabs mt-3" id="myTab" role="tablist">
          <li className="nav-item">
            <a className="nav-link active h5" id="home-tab" data-toggle="tab" href="/#/VideoList" role="tab" aria-controls="home" aria-selected="true" style={{ color: "#F45197" }}>Routine workout</a>
          </li>
          {/* <li className="nav-item">
              <a className="nav-link disabled" id="profile-tab" data-toggle="tab" href="/#/VideoList" role="tab" aria-controls="profile" aria-selected="false">รวมคลิปออกกำลังกาย</a>
            </li> */}
          <li className="nav-item">
            <a className="nav-link disabled" id="contact-tab" data-toggle="tab" href="/#/challenges" role="tab" aria-controls="contact" aria-selected="false">ชาเลนจ์</a>
          </li>
        </ul>
        <div className="main main-raised" style={{ backgroundColor: "#D8D6DF" }}>
          <div className="container">
            <div className="">
              {
                ((this.props.user && this.props.user.other_attributes) && (this.props.statusVideoList !== "no_video")) ?
                  (editVDO_click === "show") ?
                    this.renderEditVDO()
                    :
                    (lastWeekVDO_click === "show") ?
                      this.renderVideoListLastWeek()
                      :
                      this.renderVideoList()
                  :
                  this.renderOtherAttribute()
              }
            </div>
          </div>
        </div>
      </div >
    )
  }
}

const mapStateToProps = ({ authUser, exerciseVideos, challenges }) => {
  const { user } = authUser;
  const { dailyWeighChallenge, statusPostDailyWeighChallenge } = challenges;
  const { exerciseVideo, exerciseVideoLastWeek, isFirstWeek, status, video, videos, statusVideoList, statusUpdateBodyInfo, week, lastweek } = exerciseVideos;
  return { user, exerciseVideo, exerciseVideoLastWeek, isFirstWeek, status, video, videos, statusVideoList, statusUpdateBodyInfo, week, lastweek, dailyWeighChallenge, statusPostDailyWeighChallenge };
};

const mapActionsToProps = { updateProfile, createCustomWeekForUser, videoListForUser, logoutUser, updatePlaytime, updatePlaylist, randomVideo, selectChangeVideo, resetStatus, clearVideoList, videoListForUserLastWeek, updateBodyInfo, updatePlaytimeLastWeek, getDailyWeighChallenge, postDailyWeighChallenge };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(VideoList);