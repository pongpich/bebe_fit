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
      program_id: "",
      email: "",
      password: "",
      confirmPassword: "",
      statusRegister_email: "default",
      statusRegister_password: "default"
    };
  }

  componentDidMount() {
    const { user } = this.props;
    this.props.clearProgram();
    if (user !== null && user.expire_date !== null) {
      var curr = new Date().getTime();
      var expire_date = new Date(user.expire_date).getTime();
      if (curr < expire_date) { //curr < expire_date คือ ยังไม่หมดอายุ
        this.props.history.push('/VideoList');
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { email, password } = this.state;
    const { status, program, statusRegister } = this.props;
    if (prevProps.statusRegister !== statusRegister && statusRegister === "success") {
      this.props.loginUser(email, password);
    }
    if (prevProps.status !== status && status === "success") {
      this.props.history.push('/package');
    }
    if (prevProps.program !== program && program !== null) {
      if (this.props.user === null) {
        document.getElementById("popupRegister").classList.toggle("active");
        document.getElementById("overlayPopupRegister").classList.toggle("active");
      } else {
        this.props.history.push('/package');
      }
    }
  }

  selectProgram(program_id) {
    this.props.selectProgram(program_id);
  }

  closePopupRegister() {
    document.getElementById("popupRegister").classList.toggle("active");
    document.getElementById("overlayPopupRegister").classList.toggle("active");
    this.props.clearProgram();
    this.setState({
      statusRegister_email: "default",
      statusRegister_password: "default",
      email: "",
      password: "",
      confirmPassword: ""
    })
  }

  onUserRegister(event) {
    const { email, password, confirmPassword } = this.state;
    const { statusRegister } = this.props;
    this.setState({
      statusRegister_email: "default",
      statusRegister_password: "default"
    })
    if (email !== "" && password !== "") {
      if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        if (statusRegister === "new") {
          if (password.length >= 8) {
            if (password === confirmPassword) {
              this.props.trialRegister(email, password);
            } else {
              this.setState({
                statusRegister_password: "passwordNotMatch"
              })
            }
          } else {
            this.setState({
              statusRegister_password: "password8plus"
            })
          }
        } else {
          this.setState({
            statusRegister_email: "emailExist"
          })
        }
      } else {
        this.setState({
          statusRegister_email: "emailFormat"
        })
      }
    } else {
      if (email === "") {
        this.setState({
          statusRegister_email: "emailFormat"
        })
      }
      if (password === "") {
        this.setState({
          statusRegister_password: "password8plus"
        })
      }
    }
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

  renderRegister() {
    const { statusRegister_email, statusRegister_password } = this.state;
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
          {
            (statusRegister_email === "emailFormat") &&
            <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "red" }}>กรุณากรอกรูปแบบอีเมลให้ถูกต้อง เช่น aa@example.com</h6></small>
          }
          {
            (statusRegister_email === "emailExist") &&
            <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "red" }}>อีเมลนี้ถูกใช้ในการสมัครแล้ว กรุณาเข้าสู่ระบบ</h6></small>
          }
          <Label className="form-group2 has-float-label mb-2">
            {"Password"}
            <Input
              type="password"
              id="password"
              value={this.state.password} onChange={(event) => this.handleChange(event)}
            />
          </Label>
          {
            (statusRegister_password === "password8plus") &&
            <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "red" }}>รหัสผ่านต้องมากกว่า 8 ตัวขึ้นไป</h6></small>
          }
          <Label className="form-group2 has-float-label mb-3">
            {"Confirm password"}
            <Input
              type="password"
              id="confirmPassword"
              value={this.state.confirmPassword} onChange={(event) => this.handleChange(event)}
            />
          </Label>
          {
            (statusRegister_password === "passwordNotMatch") &&
            <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "red" }}>รหัสผ่านไม่ตรงกัน</h6></small>
          }

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
              <button type="button" className="btn btn-light border mr-5" onClick={() => this.selectProgram("fit60days")}>
                ซื้อแพ็คเกจ
              </button>
              :
              <button type="button" className="btn btn-light border mr-5" onClick={() => this.selectProgram("fit60days")}>
                สมัคร Platform
              </button>
          }
          {
            ((this.props.user === null) || (this.props.user !== null && this.props.user.expire_date === null)) &&
            <button className="show-btn btn btn-dark mr-5" onClick={() => this.selectProgram("trial14")}>
              ใช้ฟรี 14วัน
            </button>
          }
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
              <a class="nav-link disabled" onClick={() => this.props.history.push('/login')}>เข้าสู่ระบบ</a>
            </li>
          </ul>
          {this.renderRegister()}
        </div>

        <h1>.</h1>
        <h1>.</h1>
        <h1>.</h1>
      </div>
    )
  }
}

const mapStateToProps = ({ authUser, exerciseProgram, payment }) => {
  const { user, status, statusRegister } = authUser;
  const { program } = exerciseProgram;
  return { user, status, program, statusRegister };
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

