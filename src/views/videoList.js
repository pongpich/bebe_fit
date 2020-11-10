import React, { Component } from "react";
import {
  CardTitle,
  Form,
  Label,
  Input,
  Button
} from "reactstrap";
import { connect } from "react-redux";

import { updateProfile, createCustomWeekForUser, videoListForUser } from "../redux/auth";

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
    this.props.videoListForUser(125);
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

  onUpdateProfile(event) {
    const {
      email,
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
      email,
      other_attributes
    );
    console.log(
      email,
      other_attributes
    )

    this.setState({
      other_attributes: other_attributes
    })
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
                      <div class="form-group">
                        <label for="email" class="bmd-label-floating">Email</label>
                        <input
                          type="email"
                          class="form-control"
                          id="email"
                          name="email"
                          step=".01"
                          value={this.state.email} onChange={(event) => this.handleChange(event)}
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
    let { focusDay, dayDuration} = this.state;
    let todayExercise;
    switch(focusDay){
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
      <div class="card-body">

                <form>
                  <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item">
                      <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Routine workout</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="true">รวมคลิปออกกำลังกาย</a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">เข้าร่วมชาเลนจ์</a>
                    </li>
                  </ul>
                  <div class="tab-content mt-3 mb-2" id="myTabContent">
                    <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                      <nav class="nav">
                        <a class={`nav-link ${focusDay === 1 ? "active" : "disabled"}`}  href="#" onClick={() => this.onDayChange(1)}>DAY1</a>
                        <a class={`nav-link ${focusDay === 2 ? "active" : "disabled"}`} href="#" onClick={() => this.onDayChange(2)}>DAY2</a>
                        <a class={`nav-link ${focusDay === 3 ? "active" : "disabled"}`} href="#" onClick={() => this.onDayChange(3)}>DAY3</a>
                        <a class={`nav-link ${focusDay === 4 ? "active" : "disabled"}`} href="#" onClick={() => this.onDayChange(4)}>DAY4</a>
                      </nav>
                    </div>
                    <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">pppp</div>
                    <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">kkkkk</div>
                  </div>



                  <div class="">
                    <table class="table">
                      <thead>
                        <tr>
                          <th class="tabletitle">
                            <span class="mr-5" style={{ fontSize: "15px" }}> รายการออกกำลังกาย </span>

                            {
                              todayExercise.map((item) => (dayDuration.push(item.duration))),
                              
                              <span class="mr-5" style={{ fontSize: "15px" }}> รวมเวลาฝึก {dayDuration.reduce((acc, curr) => acc += curr,0).toFixed(2)} นาที </span>
                            }

                          </th>
                        </tr>
                      </thead>
                      <br></br>
                      {
                        todayExercise.map((item) => (
                          <tbody>
                            <tr>
                              <td class="videoItem mt-5">
                                <div>
                                  <img class="videoThumb mr-3" src="../assets/img/thumb/warmup.jpg" width="375px" alt="" />
                                </div>
                                <div class="videoName">
                                  <h3> {item.name} </h3>
                                  <h6> {item.category} </h6>
                                </div>
                                <div class="videoDuration">
                                  <h6> {item.duration} นาที </h6>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        ))
                      }
                      {/* <h3> {videoForWeek} </h3> */}
                    </table>
                  </div>
                </form>

              </div>
    )
  }

  render() {
    let { focusDay, dayDuration, other_attributes} = this.state;
    let todayExercise;
    console.log("other_attributes :", other_attributes);
    switch(focusDay){
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
    console.log("exerciseVideo : ", this.props.exerciseVideo);
    return (
      < div >
        <div class="page-header header-small" data-parallax="true"
          style={{ backgroundImage: `url(${bghead})` }}>
          <div class="container" >
            <div class="row mt-5" style={{ color: "black" }} >
              <div class="col-md-8 ml-auto mr-auto text-center mt-5">
                <h1> BEBE FIT ROUTINE </h1>
                <span style={{ color: "#DB5077", fontSize: "20px", fontWeight: "bold", lineHeight: "1.6" }}>
                  BEBE FIT ROUTINE<br></br>
                WORKOUT PROGRAM<br></br>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="main main-raised">
          <div class="container">
            <div class="card card-plain">
              {
                (other_attributes) 
                ? this.renderVideoList()
                : this.renderVideoList()
              }
            </div>
          </div>
        </div>
      </div >
    )
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user, exerciseVideo } = authUser;
  return { user, exerciseVideo };
};

const mapActionsToProps = { updateProfile, createCustomWeekForUser, videoListForUser };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(VideoList);