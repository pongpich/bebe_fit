import React, { Component } from "react";
import {
  Button
} from "reactstrap";
import { connect } from "react-redux";

import { updateProfile } from "../redux/auth";

import bghead from "../assets/img/bghead.jpg";
import "./register_sub.scss";

class Register_Sub extends Component {
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
      hip: ""
    };

    this.onUpdateProfile = this.onUpdateProfile.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    })
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
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
  }

  render() {
    return (
      <div>
        <div class="page-header header-small" data-parallax="true"
          style={{ backgroundImage: `url(${bghead})` }}>
          <div class="container" >
            <div class="row mt-5" style={{ color: "black" }} >
              <div class="col-md-8 ml-auto mr-auto text-center mt-5">
                <h1> กรุณากรอกข้อมูลของคุณ </h1>
                <span style={{ color: "#DB5077", fontSize: "20px", fontWeight: "bold", lineHeight: "1.6" }}>
                  โปรแกรมเวทเทรนนิ่งที่คุณจะได้รับสำหรับในคอร์สนี้<br></br>
                จะถูกคิดจากข้อมูลส่วนตัวและเป้าหมายรูปร่างของคุณ<br></br>
                กรุณาระบุข้อมูลให้ครบถ้วนค่ะ
					    </span>
              </div>
            </div>
          </div>
        </div>

        <div class="main main-raised">
          <div class="container">
            <div class="card card-plain">
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
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user } = authUser;
  return {user};
};

const mapActionsToProps = { updateProfile };

export default connect(
  mapStateToProps, 
  mapActionsToProps 
)(Register_Sub);