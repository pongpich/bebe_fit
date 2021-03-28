import React, { Component } from "react";
import Amplify from 'aws-amplify';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "./redux/auth";
import { clearVideoList } from "./redux/exerciseVideos";


import Login from "./views/login";
import Register from "./views/register";
import ForgotPassword from "./views/forgotPassword";
import VideoList from "./views/videoList";
import Platform from "./views/platform";
import Package from "./views/package";
import ImportMembers from "./views/importMembers";
import Challenges from "./views/challenges";

import { awsConfig } from "./constants/defaultValues";

Amplify.configure(awsConfig);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  onUserLogout(event) {
    this.props.logoutUser();
    this.props.clearVideoList();
    this.props.history.push('/platform');
  }

  renderNavbar() {
    return (
      <nav className="navbar navbar-expand navbar-dark bg-dark fixed-top">
        <a className="navbar-brand" href="/#" onClick={() => this.props.history.push('/')} style={{ color: "white", cursor: "pointer" }}>
          <img className="mr-3" src="/assets/img/logo.png" alt="" width="50" height="50" />
            BEBE FIT ROUTINE
        </a>
        <div className="collapse navbar-collapse justify-content-start" id="navbarNav">
          <ul className="navbar-nav">
            {/* <li className="nav-item">
              <a className="nav-link" href="#/" style={{ color: "white", cursor: "pointer" }}>บทความ</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#/" style={{ color: "white", cursor: "pointer" }}>อาหารเสริมและอุปกรณ์</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#/platform" onClick={() => this.props.history.push('/platform')} style={{ color: "white", cursor: "pointer" }}>
                Platform
              </a>
            </li> */}
            {
              (this.props.user !== null && this.props.user.authorization === "admin") &&
              <li className="nav-item">
                <a className="nav-link" href="#/videolist" onClick={() => this.props.history.push('/videolist')} style={{ color: "white", cursor: "pointer" }}>
                  Platform
                </a>
              </li>
            }
          </ul>
        </div>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            {/* <li className="nav-item">
              <a className="nav-link" href="#/" style={{ color: "white", cursor: "pointer" }}>ตะกร้าสินค้า</a>
            </li> */}
            {/* {
              (this.props.user === null) &&
              <li className="nav-item">
                <a className="nav-link" href="#/login" onClick={() => this.props.history.push('/login')} style={{ color: "white", cursor: "pointer" }}>
                  เข้าสู่ระบบ
                </a>
              </li>
            } */}
            {/* {
              (this.props.user === null || this.props.user.password === null) && //password === null คือกรณีผู้ใช้ทำการ ResetPassword
              <li className="nav-item">
                <a className="nav-link" href="#/register" onClick={() => this.props.history.push('/register')} style={{ color: "white", cursor: "pointer" }}>
                  สมัครสมาชิก
                </a>
              </li>
            } */}
            {
              (this.props.user !== null && this.props.user.authorization === "admin") &&
              <li className="nav-item">
                <a className="nav-link" href="#/import-members" onClick={() => this.props.history.push('/import-members')} style={{ color: "white", cursor: "pointer" }}>
                  เพิ่มสมาชิก
                </a>
              </li>
            }
            {
              (this.props.user !== null && this.props.user.password !== null) &&
              <li className="nav-item">
                <a className="nav-link" href="/#" onClick={() => this.onUserLogout()} style={{ color: "white", cursor: "pointer" }}>
                  ออกจากระบบ
                </a>
              </li>
            }
          </ul>
        </div>
      </nav>
    )
  }

  render() {
    return (
      <div className="App">
        {this.renderNavbar()}
        <Switch>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route path='/login' component={Login} />
          {/* <Route path='/register' component={Register} />
          <Route path='/forgot-password' component={ForgotPassword} /> */}
          <Route path='/import-Members' component={ImportMembers} />
          <Route path='/Challenges' component={Challenges} />
          <Route path='/VideoList' component={VideoList} />
          {/* <Route path='/platform' component={Platform} />
          <Route path='/package' component={Package} /> */}
          <Route path='*'>
            <Redirect to="/login" />
          </Route>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = ({ authUser, exerciseVideos }) => {
  const { user } = authUser;
  const { exerciseVideo, status, video, videos } = exerciseVideos;
  return { user, exerciseVideo, status, video, videos };
};

const mapActionsToProps = {
  logoutUser,
  clearVideoList
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(App);
