import React, { Component } from "react";
import { connect } from "react-redux";
import "./platform.scss";
import {
  Form,
  Label,
  Input,
  Button
} from "reactstrap";

class Platform extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    const { user } = this.props;
    if (user !== null) {
      this.props.history.push('/VideoList');
    }
  }

  renderRegister() {
    return (
      <div className="auth-card">
        <div className="position-relative image-side-register"></div>
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
      <div>
        <h1>Platform Page</h1>
        <h1>Platform Page</h1>
        <h1>Platform Page</h1>
        <h1>Platform Page</h1>
        <h1>Platform Page</h1>
        <h1>Platform Page</h1>
        <h1>Platform Page</h1>
        <h1>Platform Page</h1>
        <h1>Platform Page</h1>
        <h1>Platform Page</h1>
        <div style={{ float: "right" }}>
          <button type="button" className="btn btn-light mr-4"> สมัคร Platform </button>
          <a href="/trial_register">
            <button className="btn btn-dark mr-5" > ใช้ฟรี 14วัน </button>
          </a>
        </div>
        <h1>Platform Page</h1>
        <h1>Platform Page</h1>
        <h1>Platform Page</h1>
      </div>
    )
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user } = authUser;
  return { user };
};

const mapActionsToProps = {};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Platform);

