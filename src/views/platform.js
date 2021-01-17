import React, { Component } from "react";
import { connect } from "react-redux";
import "./platform.scss";
import {
  Form,
  Label,
  Input,
  Button
} from "reactstrap";
import { trialRegister, checkUser, logoutUser, loginUser } from "../redux/auth";
import { clearVideoList } from "../redux/exerciseVideos";
import { selectProgram, clearProgram } from "../redux/exerciseProgram";
import backgroundImg from "../assets/img/mainbg.jpg";


class Platform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      program_id: ""
    };
  }

  componentDidMount() {
    const { user } = this.props;
    this.props.clearProgram();
    if (user !== null && user.expire_date !== null) {
      this.props.history.push('/VideoList');
    }
  }

  componentDidUpdate(prevProps) {
    const { status } = this.props;
    if (prevProps.status !== status && status === "success") {
      this.props.history.push('/package');
    }
  }

  selectProgram(program_id) {
    this.props.selectProgram(program_id);
    if(this.props.user === null){
      document.getElementById("popupRegister").classList.toggle("active");
      document.getElementById("overlayPopupRegister").classList.toggle("active");
    } else {
      this.props.history.push('/package');
    }
  }

  closePopupRegister() {
    document.getElementById("popupRegister").classList.toggle("active");
    document.getElementById("overlayPopupRegister").classList.toggle("active");
    this.props.clearProgram();
  }

  onUserRegister(event) {
    const { email, password } = this.state;
    this.props.trialRegister(email, password);
    this.props.loginUser(email, password);
  }

  onUserLogout(event) {
    this.props.logoutUser();
    this.props.clearVideoList();
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  async checkExistedEmail(event) {
    const { value } = event.target;
    this.setState({
      [event.target.id]: event.target.value
    })
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
      this.props.checkUser(value);
      console.log(value);
    }
  }

  renderNavbarLogoutMenu() {
    return (
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
    )
  }

  renderTrialRegister() {
    return (
      <div className="form-side">
        <Form>
          <Label className="form-group2 has-float-label mb-2">
            {"Email Address"}
            <Input
              type="email"
              id="email"
              value={this.state.email} onChange={(event) => this.checkExistedEmail(event)}
            />
          </Label>
          <Label className="form-group2 has-float-label mb-2">
            {"Password"}
            <Input
              type="password"
              id="password"
              value={this.state.password} onChange={(event) => this.handleChange(event)}
            />
          </Label>
          <Label className="form-group2 has-float-label mb-3">
            {"Confirm password"}
            <Input
              type="password"
              name="confirm-password" required
              id="comfirm-password"
              validate={{
                required: { value: true, errorMessage: 'อย่าลืมกรอกยืนยันพาสเวิร์ด' },
                match: { value: 'password', errorMessage: 'พาสเวิร์ดไม่ตรงกัน' }
              }}
            />
          </Label>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <Button
              color="danger"
              className="btn-shadow mt-3"
              size="lg"
              onClick={() => this.onUserRegister()}
              block
            >
              <span className="text-one">
                {"สมัครสมาชิก"}
              </span>
            </Button>
          </div>
        </Form>
      </div>
    )
  }

  render() {
    return (
      <div className="center" style={{ backgroundImage: `url(${backgroundImg})` }}>
        {this.props.user !== null && this.renderNavbarLogoutMenu()}
        <h1>.</h1>
        <h1>.</h1>
        <h1>.</h1>
        <h1>.</h1>
        <h1>.</h1>
        <h1>.</h1>
        <h1>.</h1>
        <h1>.</h1>
        <h1>.</h1>
        <h1>.</h1>

        <div style={{ float: "right" }}>
          {
            this.props.user !== null ?
              <button type="button" className="btn btn-light border mr-4" onClick={() => this.selectProgram("fit60days")}>
                ซื้อแพ็คเกจ
              </button>
              :
              <button type="button" className="btn btn-light border mr-4" onClick={() => this.selectProgram("fit60days")}>
                สมัคร Platform
              </button>
          }
          <button className="show-btn btn btn-dark mr-5" onClick={() => this.selectProgram("trial14")}>
            ใช้ฟรี 14วัน
          </button>
        </div>

        <div className="overlay overlayContainerPopup" id="overlayPopupRegister"></div>
        <div className="containerPopup popupTrialRegister" id="popupRegister" style={{ marginTop: "10%" }}>
          <label
            className="close-btn fa fa-times" style={{ float: "right" }}
            onClick={() => this.closePopupRegister()}
          >
          </label>
          <ul class="nav nav-tabs mb-4">
            <li class="nav-item">
              <a class="nav-link active" href="#"><b>สมัครสมาชิก</b></a>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" href="/login">เข้าสู่ระบบ</a>
            </li>
          </ul>
          {this.renderTrialRegister()}
        </div>

        <h1>.</h1>
        <h1>.</h1>
        <h1>.</h1>
      </div>
    )
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user, status, program } = authUser;
  return { user, status, program };
};

const mapActionsToProps = {
  trialRegister,
  checkUser,
  logoutUser,
  clearVideoList,
  loginUser,
  selectProgram,
  clearProgram
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Platform);

