import React, { Component } from "react";
import {
  CardTitle,
  Form,
  Label,
  Input,
  Button
} from "reactstrap";
import { connect } from "react-redux";

import { loginUser } from "../redux/auth";
//import IntlMessages from "../helpers/IntlMessages";
//import "./login.scss";


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      statusLogin: "default"
    };
  }

  onUserLogin() {
    if (this.state.email !== "" && this.state.password !== "") {
      this.props.loginUser(this.state.email, this.state.password);
      if ((/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email)) && (this.props.status === "fail")) {
        this.setState({
          statusLogin: "fail"
        });
      } else if (!(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email))) {
        this.setState({
          statusLogin: "fail"
        });
      }
    } else if (this.state.email === "" || this.state.password === "") {
      this.setState({
        statusLogin: "fail"
      });
    }
  }

  componentDidMount() {
    const { user } = this.props;
    if (user !== null) {
      this.props.history.push('/VideoList');
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

  render() {
    const { statusLogin } = this.state;
    return (
      <div className="h-100 all-row">
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
                {"เข้าสู่ระบบ"}
              </CardTitle>
              <Form>
                <Label className="form-group2 has-float-label mb-4">
                  {"Email"}
                  <Input
                    type="email"
                    id="email"
                    value={this.state.email} onChange={(event) => this.handleChange(event)}
                  />
                </Label>
                <Label className="form-group2 has-float-label mb-4">
                  {"Password"}
                  <Input
                    type="password"
                    id="password"
                    value={this.state.password} onChange={(event) => this.handleChange(event)}
                  />
                </Label>
                {
                  (statusLogin === "fail" && !(this.props.status === "success")) &&
                  <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "red" }}>อีเมลหรือรหัสผ่านไม่ถูกต้อง</h6></small>
                }

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
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Button
                    className="btn-link"
                    href="/forgot-password"
                    color="empty"
                    block
                  >
                    <span className="text-one">
                      {"ลืมรหัสผ่าน"}
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({ authUser }) => {
  const { user, status } = authUser;
  return { user, status };
};

const mapActionsToProps = { loginUser };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Login);
