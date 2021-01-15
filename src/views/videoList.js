import React, { Component } from "react";
import {
  Button
} from "reactstrap";
import { connect } from "react-redux";



import { updateProfile, logoutUser } from "../redux/auth";
import { createCustomWeekForUser, videoListForUser, updatePlaytime, updatePlaylist, randomVideo, selectChangeVideo, resetStatus, clearVideoList } from "../redux/exerciseVideos";


import bghead from "../assets/img/bghead.jpg";
import "./videoList.scss";

class VideoList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      sex: "male",
      age: "",
      weight: "",
      height: "",
      chest: "",
      waist: "",
      hip: "",
      focusDay: 0,
      other_attributes: "",
      selectedVDO: null,
      editVDO_click: "default",
      tempPlaylist: [],
      indexPlaylist: 0,
      selectChangeVideoList: []
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
        this.props.user.other_attributes.weight,
        this.props.user.start_date,
        this.props.user.offset
      );
      this.addEventToVideo();
    }
    if (user === null) {
      this.props.history.push('/login');
    }
    if (user.expire_date === null) {
      this.props.history.push('/platform');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { user } = this.props;
    if (user && prevProps.user && user.other_attributes !== prevProps.user.other_attributes) {
      this.setState({
        other_attributes: user.other_attributes
      })
      this.props.videoListForUser(
        this.props.user.user_id,
        this.props.user.other_attributes.weight,
        this.props.user.start_date,
        this.props.user.offset
      );
      if (this.props.user.other_attributes) {
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
    if (prevProps.videos !== this.props.videos) {
      const videos = this.props.videos;
      this.setState({
        selectChangeVideoList: videos
      })
    }
    if (prevProps.status === "processing" && this.props.status === "success") {
      this.closeEditVDO();
    }
    if(prevState.editVDO_click === "show" && this.state.editVDO_click !== "show") {
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

  togglePopupSelectEditVideo(video_id, category, index) {
    document.getElementById("popupSelectEditVideo").classList.toggle("active");
    this.setState({
      indexPlaylist: index
    });
    this.props.selectChangeVideo(video_id, category);
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

  randomVideo(video_id, category, index) {
    this.setState({
      indexPlaylist: index
    });
    this.props.randomVideo(video_id, category);
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
    const { focusDay, selectedVDO } = this.state;
    var todayExercise = this.exerciseDaySelection(focusDay)
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
    const { selectedVDO, focusDay } = this.state;
    if (video.currentTime >= (video.duration * 0.99) && (selectedVDO.duration !== selectedVDO.play_time)) {
      const user_id = this.props.user.user_id;
      const start_date = this.props.user.start_date;
      const day_number = focusDay;
      const video_number = selectedVDO.order;
      const play_time = selectedVDO.duration;
      const tempExerciseVideo = [...this.props.exerciseVideo];
      tempExerciseVideo[day_number][video_number] = { ...tempExerciseVideo[day_number][video_number], play_time: play_time };
      const newVideo = { ...selectedVDO, play_time };
      this.setState({
        selectedVDO: newVideo
      });
      this.props.updatePlaytime(user_id, start_date, day_number, video_number, play_time, tempExerciseVideo);
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

    const other_attributes = {
      sex,
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      chest: Number(chest),
      waist: Number(waist),
      hip: Number(hip)
    }

    this.props.updateProfile(
      this.props.user.email,
      other_attributes
    );

    this.setState({
      other_attributes: other_attributes
    })

    this.props.createCustomWeekForUser(
      this.props.user.user_id,
      other_attributes.weight,
      this.props.user.start_date,
      this.props.user.offset
    );
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
      timesExercise = `${totalMinute}.0${totalSecond}`;
    } else {
      timesExercise = `${totalMinute}.${totalSecond}`;
    }

    return (
      <div className="card-body d-flex justify-content-center">

        <form>
          <span className="mr-5" style={{ fontSize: "15px" }}> <h4> แก้ไขคลิปออกกำลังกาย</h4></span>

          <div className="popup" id="popupSelectEditVideo">
            <div className="overlay"></div>
            <div className="content">
              <div className="close-btn" onClick={() => this.closeTogglePopupSelectEditVideo()}>&times;</div>
              <h4 className="mb-5"><b>เลือกคลิปวีดีโอ</b></h4>
              <div className="selectEditPlaylist">
                {
                  selectChangeVideoList.map((item, index) => (

                    <div className="playlistWrapper shadow-lg">
                      <div className="">
                        <video className="" width="100%" height="50%" controls muted >
                          <source src={`https://media.planforfit.com/bebe/video/${item.video_id}_720.mp4`} type="video/mp4"></source>
                        </video>
                      </div>
                      <div className="mt-1 ml-3 mb-4">
                        <h6><b> {item.name} </b></h6>
                      </div>
                      <button
                        className="btn btn-danger border-secondary mb-3 mt-5"
                        type="button"
                        style={{ fontSize: "15px", cursor: "pointer", padding: "10px 24px", marginLeft: "auto", marginRight: "auto", display: "block", width: "85%" }}
                        onClick={() => this.selectEditVideo(item)}
                      >
                        <b>เลือกวีดีโอนี้</b>
                      </button>
                    </div>
                  ))
                }
              </div>
              <div className="close-btn2 mt-3" style={{ cursor: "pointer" }} onClick={() => this.closeTogglePopupSelectEditVideo()}><b>&times; CLOSE</b></div>
            </div>
          </div>

          <div className="tab-content mt-3 mb-2" id="myTabContent">
            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
              <nav className="nav">
                <a className={`nav-link ${focusDay === 0 ? "active" : "disabled"}`} href="#" onClick={() => this.onDayChange(0)}><b>DAY1</b></a>
                <a className={`nav-link ${focusDay === 1 ? "active" : "disabled"}`} href="#" onClick={() => this.onDayChange(1)}><b>DAY2</b></a>
                <a className={`nav-link ${focusDay === 2 ? "active" : "disabled"}`} href="#" onClick={() => this.onDayChange(2)}><b>DAY3</b></a>
                <a className={`nav-link ${focusDay === 3 ? "active" : "disabled"}`} href="#" onClick={() => this.onDayChange(3)}><b>DAY4</b></a>
              </nav>
            </div>
            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">pppp</div>
            <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">kkkkk</div>
          </div>

          <div className="">
            <div className="trailer" id={`popupVDO`}>
              <video ref="videoPlayer" src={videoUrl} id="videoPlayer" controls></video>
              <img src="../assets/img/thumb/close.png" className="close" onClick={() => this.toggle()}></img>
            </div>
            <div className="trailer" id={`popupVDOList`}>
              <video ref="videoPlayerList" src={videoUrl} id="videoPlayerList" controls></video>
              <img src="../assets/img/thumb/close.png" className="close" onClick={() => this.closeList()}></img>
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
                        className="btn btn-light border-dark " type="button"
                        style={{ fontSize: "17px", cursor: "pointer", borderRadius: "12px", width: "100%", padding: "10px" }}
                        onClick={() => this.closeEditVDO()}
                      >
                        <b>ยกเลิก</b>
                      </button>
                    </div>
                    <div className="col-lg-2 col-md-4 col-6">
                      <button
                        className="btn btn-primary border-secondary "
                        type="button"
                        style={{ fontSize: "17px", cursor: "pointer", borderRadius: "12px", float: "right", width: "100%", padding: "10px" }}
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
                    <div className="row ml-1" key={index}>
                      <div className="videoItem mt-3 mb-1 col col-lg-8 col-md-9 border shadow">
                        <div className="videoThumb mr-2">
                          <div className="containerThumb">
                            <img className="img-fluid" onClick={() => this.toggle(item)} src={`../assets/img/thumb/${item.category.split(" ").join("")}.jpg`} alt="Responsive image" />
                            <div className="overlay" onClick={() => this.toggle(item)}>
                              <i className="fa fa-play fa-4x" aria-hidden="true"></i>
                              <div className="videoDuration" style={{ position: "absolute", right: "5%", bottom: "0", color: "white" }}>
                                <h6> <b>{item.duration} นาที</b> </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="videoName mt-3">
                          <h5> {item.name} </h5>
                          <p> {item.category} </p>
                          <br></br>
                        </div>
                        {(item.play_time === item.duration) &&
                          <div className="videoEnd">
                            <h6 style={{ color: "green" }}><i className="fa fa-check fa-lg" > เล่นสำเร็จ</i></h6>
                          </div>
                        }
                      </div>
                      <div className="col col-lg-4 d-flex align-items-center mt-3">
                        <i
                          className="changeVideoBtn fa fa-circle fa-1x"
                          onClick={() => this.togglePopupSelectEditVideo(item.video_id, item.category, index)} aria-hidden="true">
                          เปลี่ยนวีดีโอ
                        </i>
                        <i
                          className="randomVideoBtn fa fa-circle fa-1x"
                          onClick={() => this.randomVideo(item.video_id, item.category, index)} aria-hidden="true">
                          สุ่มวีดีโอ
                        </i>
                      </div>
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

  renderOtherAttribute() {
    return (
      <div className="card-body">

        <form>
          <h2>ข้อมูลพื้นฐาน</h2>
          <div className="row">
            <div className="col-md-3" style={{ paddingTop: "20px" }}>
              <div className="form-check" onChange={this.onChangeValue}>
                <span>เพศ : </span>
                <label className="form-check-label" style={{ marginLeft: "20px" }}>
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

            <div className="col-md-3">
              <div className="form-group">
                <label for="age" className="bmd-label-floating">อายุ</label>
                <input
                  type="number"
                  className="form-control"
                  id="age"
                  name="age"
                  step=".01"
                  value={this.state.age}
                  onChange={(event) => this.handleChange(event)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label for="weight" className="bmd-label-floating">น้ำหนัก (กก.)</label>
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
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label for="height" className="bmd-label-floating">ส่วนสูง (ซม.)</label>
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
            </div>
          </div>

          <div className="space-70"></div>
          <h2>สัดส่วน</h2>
          <div className="row">
            <div className="col-md-4">
              <h6>กรุณาวัดสัดส่วนของท่าน <br></br> โดยใช้รูปตัวอย่างเพื่อเป็นไกด์ในการวัดสัดส่วน</h6>
              <div className="form-group">
                <label for="chest" className="bmd-label-floating">รอบอก (นิ้ว)</label>
                <input
                  type="number"
                  className="form-control"
                  id="chest"
                  name="chest"
                  step=".01"
                  value={this.state.chest}
                  onChange={(event) => this.handleChange(event)} />
              </div>
              <div className="form-group">
                <label for="waist" className="bmd-label-floating">รอบเอว (นิ้ว)</label>
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
              <div className="form-group">
                <label for="hip" className="bmd-label-floating">สะโพก (นิ้ว)</label>
                <input
                  type="number"
                  className="form-control"
                  id="hip"
                  name="hip"
                  step=".01"
                  value={this.state.hip} onChange={(event) => this.handleChange(event)}
                />
              </div>
            </div>

            <div className="col-md-4" style={{ marginTop: "15px" }}>
              <div className="card-header card-header-image">
                <img src="../assets/img/man.png" width="375px" alt="" />
              </div>
            </div>
            <div className="col-md-4" style={{ marginTop: "15px" }}>
              <div className="card-header card-header-image">
                <img src="../assets/img/woman.png" width="375px" alt="" />
              </div>
            </div>
          </div>

          <div className="space-70 mb-5"></div>
          <div className="form-group mb-5">
            <div className="text-center">
              <Button
                color="danger"
                className="btn-shadow"
                size="lg"
                onClick={() => this.onUpdateProfile()}
                block
              >
                ลงทะเบียน
                      </Button>
            </div>
          </div>
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
      timesExercise = `${totalMinute}.0${totalSecond}`;
    } else {
      timesExercise = `${totalMinute}.${totalSecond}`;
    }

    return (
      <div className="card-body d-flex justify-content-center">
        <form>
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item">
              <a className="nav-link active h5" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Routine workout</a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="fale">รวมคลิปออกกำลังกาย</a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">เข้าร่วมชาเลนจ์</a>
            </li>
          </ul>
          <div className="tab-content mt-3 mb-2" id="myTabContent">
            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
              <nav className="nav">
                <a className={`nav-link ${focusDay === 0 ? "active" : "disabled"}`} href="#" onClick={() => this.onDayChange(0)}><b>DAY1</b></a>
                <a className={`nav-link ${focusDay === 1 ? "active" : "disabled"}`} href="#" onClick={() => this.onDayChange(1)}><b>DAY2</b></a>
                <a className={`nav-link ${focusDay === 2 ? "active" : "disabled"}`} href="#" onClick={() => this.onDayChange(2)}><b>DAY3</b></a>
                <a className={`nav-link ${focusDay === 3 ? "active" : "disabled"}`} href="#" onClick={() => this.onDayChange(3)}><b>DAY4</b></a>
              </nav>
            </div>
            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">pppp</div>
            <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">kkkkk</div>
          </div>

          <div className="">
            <div className="trailer" id={`popupVDO`}>
              <video ref="videoPlayer" src={videoUrl} id="videoPlayer" controls></video>
              <img src="../assets/img/thumb/close.png" className="close" onClick={() => this.toggle()}></img>
            </div>
            <div className="trailer" id={`popupVDOList`}>
              <video ref="videoPlayerList" src={videoUrl} id="videoPlayerList" controls></video>
              <img src="../assets/img/thumb/close.png" className="close" onClick={() => this.closeList()}></img>
            </div>
            <table className="table table-responsive">
              <thead>
                <tr>
                  <th className="tabletitle row">
                    {
                      <span className="col-lg-7 col-md-4 col-12 mb-3" style={{ fontSize: "15px", float: "left" }}> รวมเวลาฝึก {timesExercise} นาที</span>
                    }
                    <div className="col-lg-3 col-md-5 col-12">
                      <i
                        className="fa fa-pencil-square-o fa-1x mb-3"
                        style={{ fontSize: "20px", cursor: "pointer", float: "right" }}
                        onClick={() => this.editVDO()} aria-hidden="true">
                        แก้ไขคลิปออกกำลังกาย
                      </i>
                    </div>
                    <div className="col-lg-2 col-md-3 col-12">
                      <i
                        className="fa fa-play-circle fa-1x"
                        style={{ fontSize: "20px", cursor: "pointer", float: "right" }}
                        onClick={() => this.toggleList()} aria-hidden="true">
                        เล่นต่อเนื่อง
                      </i>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  (this.props.exerciseVideo) &&
                  (todayExercise.map((item, index) => (
                    <div className="row ml-1" key={index}>
                      <div className="videoItem mt-3 mb-1 col col-lg-8 col-md-9 col-11 border shadow">
                        <div className="videoThumb mr-2">
                          <div className="containerThumb">
                            <img className="img-fluid" onClick={() => this.toggle(item)} src={`../assets/img/thumb/${item.category.split(" ").join("")}.jpg`} alt="" />
                            <div className="overlay" onClick={() => this.toggle(item)}>
                              <i className="fa fa-play fa-4x" aria-hidden="true"></i>
                              <div className="videoDuration" style={{ position: "absolute", right: "5%", bottom: "0", color: "white" }}>
                                <h6> <b>{item.duration} นาที</b> </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="videoName mt-3">
                          <h5> {item.name} </h5>
                          <p> {item.category} </p>
                        </div>
                        {(item.play_time === item.duration) &&
                          <div className="videoEnd">
                            <h6 style={{ color: "green" }}><i className="fa fa-check fa-lg" > เล่นสำเร็จ</i></h6>
                          </div>
                        }
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

  render() {
    const { editVDO_click } = this.state;
    return (
      < div >
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
          <a className="navbar-brand" href="/">
            <img className="mr-3" src="/assets/img/logo.png" alt="" width="50" height="50" />
          BEBE FIT ROUTINE
          </a>
          <div className="collapse navbar-collapse justify-content-start" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" onClick={() => this.onUserLogout()}>บทความ</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/signup">อุปกรณ์ออกกำลังกาย</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/platform">Platform</a>
              </li>
            </ul>
          </div>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/signup">ตะกร้าสินค้า</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={() => this.onUserLogout()}>ออกจากระบบ</a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="page-header header-small mt-5" data-parallax="true"
          style={{ backgroundImage: `url(${bghead})` }}>
          <div className="overlay">
            <video className="mt-4" width="100%" height="100%" controls autoPlay muted >
              <source src="https://media.planforfit.com/bebe/video/414644989_720.mp4" type="video/mp4"></source>
            </video>
          </div>

          <div className="container" >
            <div className="row mt-5" style={{ color: "black" }} >
              <div className="col-md-8 ml-auto mr-auto text-center mt-5">
                <h1> BEBE FIT ROUTINE </h1>
                <span style={{ color: "#DB5077", fontSize: "20px", fontWeight: "bold", lineHeight: "1.6" }}>
                  BEBE FIT ROUTINE<br></br>
                WORKOUT PROGRAM<br></br>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="main main-raised" style={{ backgroundColor: "white" }}>
          <div className="container">
            <div className="card card-plain">
              {
                (this.props.user && this.props.user.other_attributes)
                  ?
                  (editVDO_click === "show")
                    ? this.renderEditVDO()
                    : (this.renderVideoList())
                  : this.renderOtherAttribute()
              }

            </div>
          </div>
        </div>
      </div >
    )
  }
}

const mapStateToProps = ({ authUser, exerciseVideos }) => {
  const { user } = authUser;
  const { exerciseVideo, status, video, videos } = exerciseVideos;
  return { user, exerciseVideo, status, video, videos };
};

const mapActionsToProps = { updateProfile, createCustomWeekForUser, videoListForUser, logoutUser, updatePlaytime, updatePlaylist, randomVideo, selectChangeVideo, resetStatus, clearVideoList };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(VideoList);