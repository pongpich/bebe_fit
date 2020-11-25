import React, { Component } from "react";
import {
  CardTitle,
  Form,
  Label,
  Input,
  Button
} from "reactstrap";
import { connect } from "react-redux";

import { loginUser, loginTest, signupUser } from "../redux/auth";
//import IntlMessages from "../helpers/IntlMessages";
//import "./login.scss";





class LoginTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      comfirmPassword: "",
      statusRegister: "default"
    };
  }


  onLoginTest() {
    if (this.state.email !== "") {
      this.props.loginTest(this.state.email);
    }
  }

  onUserLogin() {
    if (this.state.email !== "") {
      this.props.loginUser(this.state.email, this.state.password);
    }
  }

  /* onUserAddPassword(event) {
    const { email, password } = this.state;
    this.props.signupUser(password);
    this.props.loginUser(this.state.email, this.state.password);
  } */

  onUserRegister(event) {
    const { email, password, comfirmPassword } = this.state;
    if ((password === comfirmPassword) && ((password.length >= 8) || (comfirmPassword.length >= 8))) {
      this.props.signupUser(email, password);
      /* this.props.loginUser(this.state.email, this.state.password); */
      this.setState({
        statusRegister: "success"
      })
    } else if (((password.length < 8) || (comfirmPassword.length < 8)) && (password === comfirmPassword)) {
      this.setState({
        statusRegister: "fail2"
      })
    } else if ((password !== comfirmPassword)) {
      this.setState({
        statusRegister: "fail"
      })
    }
  }

  componentDidUpdate(prevProps) {
    const { status } = this.props;
    if (prevProps.status !== status && status === "success") {
      this.props.history.push('/VideoList');
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  renderEmailInput() {
    return (
      <Form>
        <Label className="form-group2 has-float-label mb-4">
          {"Email"}
          <Input
            type="email"
            id="email"
            value={this.state.email} onChange={(event) => this.handleChange(event)}
          />
        </Label>
        <div className="d-flex justify-content-between align-items-center mb-3 btn-login">
          <Button
            color="danger"
            className="btn-shadow"
            size="lg"
            onClick={() => this.onLoginTest()}
            block
          >
            <span className="h6 text-one">
              {"LOGIN"}
            </span>
          </Button>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button
            className="btn-link"
            href="/forgot-password"
            color="empty"
            block
          >
            <span className="text-one">
              {"ลืมรหัสผ่าน?"}
            </span>
          </Button>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button
            color="light"
            className="btn-shadow"
            size="lg"
            href="/register"
            block
          >
            {"สมัครสมาชิก"}
          </Button>
        </div>
      </Form>
    )
  }

  renderPasswordInput() {
    return (
      <Form>
        <Label className="form-group2 has-float-label mb-4">
          {"Password"}
          <Input
            type="password"
            id="password"
            value={this.state.password} onChange={(event) => this.handleChange(event)}
          />
        </Label>
        <div className="d-flex justify-content-between align-items-center mb-3 btn-login">
          <Button
            color="danger"
            className="btn-shadow"
            size="lg"
            onClick={() => this.onUserLogin()}
            block
          >
            <span className="h6 text-one">
              {"LOGIN"}
            </span>
          </Button>
        </div>
      </Form>
    )
  }

  renderRegister() {
    const { statusRegister } = this.state;
    return (
      <Form>
        <Label className="form-group2 has-float-label mb-2">
          {"Password"}
          <Input
            type="password"
            id="password"
            value={this.state.password} onChange={(event) => this.handleChange(event)}
          />
        </Label>
        <Label className="form-group2 has-float-label mb-1">
          {"ยืนยัน Password"}
          <Input
            type="password"
            name="comfirmPassword" required
            id="comfirmPassword"
            value={this.state.comfirmPassword} onChange={(event) => this.handleChange(event)}
          />
        </Label>
        {(statusRegister === "fail") && <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "red" }}>รหัสผ่านไม่ตรงกัน</h6></small>}
        {(statusRegister === "fail2") && <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "red" }}>รหัสผ่านต้องมากกว่า 8 ตัวขึ้นไป</h6></small>}
        <div className="d-flex justify-content-between align-items-center mb-3 btn-login">
          <Button
            color="danger"
            className="btn-shadow"
            size="lg"
            onClick={() => this.onUserRegister()}
            block
          >
            <span className="h6 text-one">
              {"ตั้งรหัสผ่าน"}
            </span>
          </Button>
        </div>
      </Form>
    )
  }

  renderRegisterSuccess() {
    return (
      <Form>
        <Label className="form-group2 has-float-label mb-2">
          <h6 style={{ color: "green" }}><i className="fa fa-check fa-lg" > สร้างรหัสผ่านสำเร็จ</i></h6>
        </Label>
        <div className="d-flex justify-content-between align-items-center mb-3 btn-login">
          <Button
            color="danger"
            className="btn-shadow"
            size="lg"
            onClick={() => this.onUserLogin()}
            block
          >
            <span className="h6 text-one">
              {"LOGIN"}
            </span>
          </Button>
        </div>
      </Form>
    )
  }

  /* renderAddPassword() {
    return (
      <Form>
        <Label className="form-group2 has-float-label mb-2">
          {"Password"}
          <Input
            type="password"
            id="password"
            value={this.state.password} onChange={(event) => this.handleChange(event)}
          />
        </Label>
        <Label className="form-group2 has-float-label mb-3">
          {"ยืนยัน Password"}
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
        <div className="d-flex justify-content-between align-items-center mb-3 btn-login">
          <Button
            color="danger"
            className="btn-shadow"
            size="lg"
            onClick={() => this.onUserAddPassword()}
            block
          >
            <span className="h6 text-one">
              {"LOGIN"}
            </span>
          </Button>
        </div>
      </Form>
    )
  } */

  render() {
    const { statusRegister } = this.state;
    return (
      <div className="h-100 all-row">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
          <a className="navbar-brand" href="/">
            <img className="mr-3" src="/assets/img/logo.png" alt="" width="50" height="50" />
          BEBE FIT ROUTINE
        </a>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/login_test">Test-เข้าสู่ระบบ</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/login">เข้าสู่ระบบ</a>
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
        <div className="mx-auto my-auto">
          <div className="auth-card">
            <div className="position-relative image-side-login">
              <img className="mb-4 mt-3" src="/assets/img/loginprofile.jpg" alt="" width="410" height="410" />
              <div className="description">
                <h3 className="mb-3"><center>BEBE FIT ROUTINE</center></h3>
                <h6><center>คอร์สออกกำลังกายสนุกๆ ที่สามารถฝึกได้</center></h6>
                <h6><center>จากที่บ้าน ไม่ต้องมีอุปกรณ์ก็เสียเหงื่อได้</center></h6>
              </div>
            </div>

            <div className="form-side">
              <CardTitle className="h3 mb-4">
                {"TEST-เข้าสู่ระบบ"}
              </CardTitle>
              {(this.props.statusTest === "default") && (this.renderEmailInput())}
              {(this.props.statusTest === "no_user" && (statusRegister === "default" || statusRegister === "fail" || statusRegister === "fail2")) && (this.renderRegister())}
              {(statusRegister === "success") && (this.renderRegisterSuccess())}
              {/* { (this.props.statusTest === "have_user_no_password") && (this.renderAddPassword()) } */}
              {(this.props.statusTest === "have_user_have_password") && (this.renderPasswordInput())}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({ authUser }) => {
  const { user, status, statusTest } = authUser;
  return { user, status, statusTest };
};

const mapActionsToProps = { loginUser, loginTest, signupUser };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(LoginTest);
