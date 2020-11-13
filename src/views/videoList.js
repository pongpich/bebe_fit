import React, { Component } from "react";
import {
  Button
} from "reactstrap";
import { connect } from "react-redux";

import { updateProfile, createCustomWeekForUser, videoListForUser, logoutUser } from "../redux/auth";

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
      focusDay: 1,
      dayDuration: [],
      other_attributes: ""
    };
    this.onUpdateProfile = this.onUpdateProfile.bind(this);
    this.onDayChange = this.onDayChange.bind(this);
  }

  componentDidMount() {
    if (this.props.user && this.props.user.other_attributes) {
      this.props.videoListForUser(this.props.user.user_id);
    }
  }

  componentDidUpdate(prevProps) {
    const { user } = this.props;
    if (user && prevProps.user && user.other_attributes !== prevProps.user.other_attributes) {
      this.setState({
        other_attributes: user.other_attributes
      })
      this.props.videoListForUser(this.props.user.user_id);
    }
    if (prevProps.user !== user && user === null) {
      this.props.history.push('/Login');
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
    console.log(
      this.props.user.email,
      other_attributes
    )

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
      <div class="card-body">

        <form>
          <h2>ข้อมูลพื้นฐาน</h2>
          <div class="row">
            <div class="col-md-3" style={{ paddingTop: "20px" }}>
              <div class="form-check" onChange={this.onChangeValue}>
                <span>เพศ : </span>
                <label class="form-check-label" style={{ marginLeft: "20px" }}>
                  <input
                    class="form-check-input"
                    type="radio"
                    value="male"
                    name="sex"
                    checked={this.state.sex === "male"}
                    onChange={this.onChange}
                  /> ชาย
                          <span class="circle">
                    <span class="check"></span>
                  </span>
                </label>
                <label class="form-check-label" style={{ marginLeft: "20px" }}>
                  <input
                    class="form-check-input"
                    type="radio"
                    value="female"
                    name="sex"
                    checked={this.state.sex === "female"}
                    onChange={this.onChange}
                  /> หญิง
                          <span class="circle">
                    <span class="check"></span>
                  </span>
                </label>
              </div>
            </div>

            <div class="col-md-3">
              <div class="form-group">
                <label for="age" class="bmd-label-floating">อายุ</label>
                <input
                  type="number"
                  class="form-control"
                  id="age"
                  name="age"
                  step=".01"
                  value={this.state.age}
                  onChange={(event) => this.handleChange(event)}
                />
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label for="weight" class="bmd-label-floating">น้ำหนัก (กก.)</label>
                <input
                  type="number"
                  class="form-control"
                  id="weight"
                  name="weight"
                  step=".01"
                  value={this.state.weight}
                  onChange={(event) => this.handleChange(event)}
                />
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-group">
                <label for="height" class="bmd-label-floating">ส่วนสูง (ซม.)</label>
                <input
                  type="number"
                  class="form-control"
                  id="height"
                  name="height"
                  step=".01"
                  value={this.state.height}
                  onChange={(event) => this.handleChange(event)}
                />
              </div>
            </div>
          </div>

          <div class="space-70"></div>
          <h2>สัดส่วน</h2>
          <div class="row">
            <div class="col-md-4">
              <h6>กรุณาวัดสัดส่วนของท่าน <br></br> โดยใช้รูปตัวอย่างเพื่อเป็นไกด์ในการวัดสัดส่วน</h6>
              <div class="form-group">
                <label for="chest" class="bmd-label-floating">รอบอก (นิ้ว)</label>
                <input
                  type="number"
                  class="form-control"
                  id="chest"
                  name="chest"
                  step=".01"
                  value={this.state.chest}
                  onChange={(event) => this.handleChange(event)} />
              </div>
              <div class="form-group">
                <label for="waist" class="bmd-label-floating">รอบเอว (นิ้ว)</label>
                <input
                  type="number"
                  class="form-control"
                  id="waist"
                  name="waist"
                  step=".01"
                  value={this.state.waist}
                  onChange={(event) => this.handleChange(event)}
                />
              </div>
              <div class="form-group">
                <label for="hip" class="bmd-label-floating">สะโพก (นิ้ว)</label>
                <input
                  type="number"
                  class="form-control"
                  id="hip"
                  name="hip"
                  step=".01"
                  value={this.state.hip} onChange={(event) => this.handleChange(event)}
                />
              </div>
            </div>

            <div class="col-md-4" style={{ marginTop: "15px" }}>
              <div class="card-header card-header-image">
                <img src="../assets/img/man.png" width="375px" alt="" />
              </div>
            </div>
            <div class="col-md-4" style={{ marginTop: "15px" }}>
              <div class="card-header card-header-image">
                <img src="../assets/img/woman.png" width="375px" alt="" />
              </div>
            </div>
          </div>

          <div class="space-70 mb-5"></div>
          <div class="form-group mb-5">
            <div class="text-center">
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
    let { focusDay, dayDuration } = this.state;
    let todayExercise;
    switch (focusDay) {
      case 1:
        todayExercise = this.props.exerciseVideo.day1;
        dayDuration = [];
        break;
      case 2:
        todayExercise = this.props.exerciseVideo.day2;
        dayDuration = [];
        break;
      case 3:
        todayExercise = this.props.exerciseVideo.day3;
        dayDuration = [];
        break;
      case 4:
        todayExercise = this.props.exerciseVideo.day4;
        dayDuration = [];
        break;
      default:
        todayExercise = this.props.exerciseVideo.day1;
        dayDuration = [];
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
                <a className={`nav-link ${focusDay === 1 ? "active" : "disabled"}`} href="#" onClick={() => this.onDayChange(1)}>DAY1</a>
                <a className={`nav-link ${focusDay === 2 ? "active" : "disabled"}`} href="#" onClick={() => this.onDayChange(2)}>DAY2</a>
                <a className={`nav-link ${focusDay === 3 ? "active" : "disabled"}`} href="#" onClick={() => this.onDayChange(3)}>DAY3</a>
                <a className={`nav-link ${focusDay === 4 ? "active" : "disabled"}`} href="#" onClick={() => this.onDayChange(4)}>DAY4</a>
              </nav>
            </div>
            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">pppp</div>
            <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">kkkkk</div>
          </div>



          <div className="">
            <table className="table">
              <thead>
                <tr>
                  <th className="tabletitle">
                    <span className="mr-5" style={{ fontSize: "15px" }}> รายการออกกำลังกาย </span>

                    {
                      todayExercise.map((item) => (dayDuration.push(item.duration))),

                      <span className="mr-5" style={{ fontSize: "15px" }}> รวมเวลาฝึก {dayDuration.reduce((acc, curr) => acc += curr, 0).toFixed(2)} นาที </span>
                    }

                  </th>
                </tr>
              </thead>
              <br></br>
              {
                todayExercise.map((item) => (
                  <tbody>
                    <tr>
                      <td className="videoItem mt-5">
                        <div>
                          <img className="videoThumb mr-3" src="../assets/img/thumb/warmup.jpg" width="375px" alt="" />
                        </div>
                        <div className="videoName">
                          <h3> {item.name} </h3>
                          <h6> {item.category} </h6>
                        </div>
                        <div className="videoDuration">
                          <h6> {item.duration} นาที </h6>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ))
              }
            
            </table>
          </div>
        </form>

      </div>
    )
  }

  render() {
    let { focusDay, dayDuration } = this.state;
    let todayExercise;
    switch (focusDay) {
      case 1:
        todayExercise = this.props.exerciseVideo.day1;
        dayDuration = [];
        break;
      case 2:
        todayExercise = this.props.exerciseVideo.day2;
        dayDuration = [];
        break;
      case 3:
        todayExercise = this.props.exerciseVideo.day3;
        dayDuration = [];
        break;
      case 4:
        todayExercise = this.props.exerciseVideo.day4;
        dayDuration = [];
        break;
      default:
        todayExercise = this.props.exerciseVideo.day1;
        dayDuration = [];
    }

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

const mapActionsToProps = { updateProfile, createCustomWeekForUser, videoListForUser, logoutUser };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(VideoList);