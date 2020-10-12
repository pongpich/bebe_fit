import React from 'react';
import Amplify from 'aws-amplify';
import {
  Switch,
  Route
} from "react-router-dom";

import Login from "./views/login";
import Register from "./views/register";

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
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/login">เข้าสู่ระบบ</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/register">สมัครสมาชิก</a>
            </li>
          </ul>
        </div>
      </nav>
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
      </Switch>
    </div>
  );
}

export default App;
