import React, { Component } from "react";
import {
  Button
} from "reactstrap";
import { connect } from "react-redux";



import { updateProfile, createCustomWeekForUser, videoListForUser, logoutUser, updatePlaytime } from "../redux/auth";

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
      selectedVDO: null
    };
    this.onUpdateProfile = this.onUpdateProfile.bind(this);
    this.onDayChange = this.onDayChange.bind(this);
    this.onVideoTimeUpdate = this.onVideoTimeUpdate.bind(this);
    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
    this.exerciseDaySelection = this.exerciseDaySelection.bind(this);
    this.closeList = this.closeList.bind(this);
  }

  async componentDidMount() {
    if (this.props.user && this.props.user.other_attributes) {
      this.props.videoListForUser(
        this.props.user.user_id,
        this.props.user.other_attributes.weight,
        this.props.user.start_date,
        this.props.user.offset
      );

      var video = this.refs.videoPlayer;
      var videoList = this.refs.videoPlayerList;
      video.ontimeupdate = () => this.onVideoTimeUpdate("video");
      videoList.ontimeupdate = () => this.onVideoTimeUpdate("videoList");
      videoList.onended = () => this.onVideoEnd();
    }
  }

  componentDidUpdate(prevProps) {
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
        console.log("if active!!!");
        var video = this.refs.videoPlayer;
        var videoList = this.refs.videoPlayerList;
        video.ontimeupdate = () => this.onVideoTimeUpdate("video");
        videoList.ontimeupdate = () => this.onVideoTimeUpdate("videoList");
        videoList.onended = () => this.onVideoEnd();
      }
    }
    if (prevProps.user !== user && user === null) {
      this.props.history.push('/login_test');
    }
  }

  exerciseDaySelection(focusDay) {
    let todayExercise;
    switch (focusDay) {
      case 0:
        todayExercise = this.props.exerciseVideo.day1;
        break;
      case 1:
        todayExercise = this.props.exerciseVideo.day2;
        break;
      case 2:
        todayExercise = this.props.exerciseVideo.day3;
        break;
      case 3:
        todayExercise = this.props.exerciseVideo.day4;
        break;
      default:
        todayExercise = this.props.exerciseVideo.day1;
        break;
    }
    return todayExercise;
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
    console.log("todayExercise : ", todayExercise)
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

  onVideoTimeUpdate(compName = "video") {
    var video = compName === "video" ? this.refs.videoPlayer : this.refs.videoPlayerList;
    const { selectedVDO, focusDay } = this.state;
    if (video.currentTime >= (video.duration * 0.99) && (selectedVDO.duration !== selectedVDO.play_time)) {
      const user_id = this.props.user.user_id;
      const start_date = this.props.user.start_date;
      const day_number = focusDay;
      const video_number = selectedVDO.order;
      const play_time = selectedVDO.duration;
      const newVideo = { ...selectedVDO, play_time }
      this.setState({
        selectedVDO: newVideo
      });

      this.props.updatePlaytime(user_id, start_date, day_number, video_number, play_time, newVideo);
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
    todayExercise.map((item) => (allMinute.push(Number((item.duration.toFixed(2)).split(".")[0]))));
    todayExercise.map((item) => (allSecond.push(Number((item.duration.toFixed(2)).split(".")[1]))));
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
      <div className="card-body">

        <form>
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item">
              <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Routine workout</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="true">รวมคลิปออกกำลังกาย</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">เข้าร่วมชาเลนจ์</a>
            </li>
          </ul>
          <div className="tab-content mt-3 mb-2" id="myTabContent">
            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
              <nav className="nav">
                <a className={`nav-link ${focusDay === 0 ? "active" : "disabled"}`} href="#" onClick={() => this.onDayChange(0)}>DAY1</a>
                <a className={`nav-link ${focusDay === 1 ? "active" : "disabled"}`} href="#" onClick={() => this.onDayChange(1)}>DAY2</a>
                <a className={`nav-link ${focusDay === 2 ? "active" : "disabled"}`} href="#" onClick={() => this.onDayChange(2)}>DAY3</a>
                <a className={`nav-link ${focusDay === 3 ? "active" : "disabled"}`} href="#" onClick={() => this.onDayChange(3)}>DAY4</a>
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
            <table className="table">
              <thead>
                <tr>
                  <th className="tabletitle">
                    <span className="mr-5" style={{ fontSize: "15px" }}> รายการออกกำลังกาย </span>
                    {
                      <span className="mr-5" style={{ fontSize: "15px" }}> รวมเวลาฝึก {timesExercise} นาที</span>
                    }
                    <i className="fa fa-play-circle fa-1x" style={{ fontSize: "20px", cursor: "pointer", float: "right" }} onClick={() => this.toggleList()} aria-hidden="true"> เล่นต่อเนื่อง</i>
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  todayExercise.map((item, index) => (
                    <tr key={index}>
                      <td className="videoItem mt-5">
                        <div className="videoThumb mr-3">
                          <div className="containerThumb">
                            <img onClick={() => this.toggle(item)} src={`../assets/img/thumb/${item.category.split(" ").join("")}.jpg`} width="375px" alt="" />
                            <div className="overlay" onClick={() => this.toggle(item)}>
                              <i className="fa fa-play fa-4x" aria-hidden="true"></i>
                            </div>
                          </div>
                        </div>
                        <div className="videoName">
                          <h3> {item.name} </h3>
                          <h6> {item.category} </h6>
                        </div>
                        <div className="videoDuration">
                          <h6> {item.duration} นาที </h6>
                        </div>
                        {(item.play_time === item.duration) &&
                          <div className="videoEnd">
                            <h6 style={{ color: "green" }}><i className="fa fa-check fa-lg" > เล่นสำเร็จ</i></h6>
                          </div>
                        }
                      </td>
                    </tr>

                  ))
                }
              </tbody>
            </table>
          </div>
        </form>

      </div>
    )
  }

  render() {
    return (
      < div >
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
          <a className="navbar-brand" href="/">
            <img className="mr-3" src="/assets/img/logo.png" alt="" width="50" height="50" />
          BEBE FIT ROUTINE
        </a>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" onClick={() => this.onUserLogout()}>ออกจากระบบ</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/signup">สมัครสมาชิก</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/trial_register">ทดลองใช้ฟรี</a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="page-header header-small" data-parallax="true"
          style={{ backgroundImage: `url(${bghead})` }}>
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

        <div className="main main-raised">
          <div className="container">
            <div className="card card-plain">
              {
                (this.props.user && this.props.user.other_attributes)
                  ? this.renderVideoList()
                  : this.renderOtherAttribute()
              }
            </div>
          </div>
        </div>
      </div >
    )
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user, exerciseVideo, status } = authUser;
  return { user, exerciseVideo, status };
};

const mapActionsToProps = { updateProfile, createCustomWeekForUser, videoListForUser, logoutUser, updatePlaytime };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(VideoList);