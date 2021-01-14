import React from 'react';
import Amplify from 'aws-amplify';
import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import Login from "./views/login";
import TrialRegister from "./views/trial_register";
import Signup from "./views/signup";
import VideoList from "./views/videoList";
import Platform from "./views/platform";

import backgroundImg from "./assets/img/mainbg.jpg";

import { awsConfig } from "./constants/defaultValues";

Amplify.configure(awsConfig);
function App() {
  return (
    <div className="App" style={{ backgroundImage: `url(${backgroundImg})` }}>
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
                <a className="nav-link" onClick={() => this.onUserLogout()}>ตะกร้าสินค้า</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/login">เข้าสู่ระบบ</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/trial_register">สมัครสมาชิก</a>
              </li>
            </ul>
          </div>
        </nav>
      <Switch>
        <Route exact path="/">
          <Redirect to="/platform" />
        </Route>
        <Route exact path='/login_test'>
          <Redirect to="/platform" />
        </Route>
        <Route path='/login' component={Login} />
        <Route path='/trial_register' component={TrialRegister} />
        <Route path='/signup' component={Signup} />
        <Route path='/VideoList' component={VideoList} />
        <Route path='/platform' component={Platform} />
      </Switch>
    </div>
  );
}

export default App;
