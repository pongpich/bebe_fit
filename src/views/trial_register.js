import React, { Component } from "react";
import {
  CardTitle,
  Form,
  Label,
  Input,
  Button
} from "reactstrap";

import { connect } from "react-redux";

import { trialRegister, checkUser } from "../redux/auth";
import "./trial_register.scss";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      phone: ""
    };

    this.onUserRegister = this.onUserRegister.bind(this);
  }

  onUserRegister(event) {
    const { email, password, firstname, lastname, phone } = this.state;
    this.props.trialRegister(email, password, firstname, lastname, phone);
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
    return (
      <div className="auth-card">
        <div className="position-relative image-side-register"></div>
        <div className="form-side">
          <Form>
            {/* <Label className="form-group1 has-float-label mb-2 mr-4">
                  {"ชื่อ"}
                  <Input
                    name="firstname"
                    id="firstname"
                    value={this.state.firstname}
                    onChange={(event) => this.handleChange(event)}
                    validate={{
                      required: { value: true, errorMessage: 'อย่าลืมกรอกชื่อ' }
                    }}
                  />
                </Label>
                <Label className="form-group1 has-float-label mb-2">
                  {"นามสกุล"}
                  <Input
                    name="lastname"
                    id="lastname"
                    value={this.state.lastname}
                    onChange={(event) => this.handleChange(event)}
                    validate={{
                      required: { value: true, errorMessage: 'อย่าลืมกรอกนามสกุล' }
                    }}
                  />
                </Label>
                <Label className="form-group1 has-float-label mb-2">
                  {"เบอร์โทรศัพท์"}
                  <Input
                    name="phone"
                    id="phone"
                    value={this.state.phone}
                    onChange={(event) => this.handleChange(event)}
                    validate={{
                      required: { value: true, errorMessage: 'อย่าลืมกรอกเบอร์โทรศัพท์' }
                    }}
                  />
                </Label> */}
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
                className="btn-shadow"
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
      </div>
    )
  }

  render() {
    return (
      <div className="h-100 all-row">
        <div className="mx-auto my-auto">
          {this.renderRegister()}
        </div>
      </div>
    );
  }
}
const mapStateToProps = ({ authUser }) => {
  const { user } = authUser;
  return { user };
};

const mapActionsToProps = {
  trialRegister,
  checkUser
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Register);
