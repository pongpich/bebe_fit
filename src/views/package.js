import React, { Component } from "react";
import { connect } from "react-redux";
import "./package.scss";

class Package extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    const { user } = this.props;
    if (user === null) {
      this.props.history.push('/platform');
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

  render() {
    return (
      <div className="center">
        {this.renderNavbarLogoutMenu()}
        <div className="row mt-5">
          <div className="col-lg-4 mt-5">
            <div className="container" style={{ backgroundColor: "grey", height: "100%", width: "90%", marginTop: "15%" }}>
            </div>
          </div>
          <div className="col-lg-8 mt-5">
            <h1 className="mt-5 ml-2">แพ็คเกจ</h1>
            <div className="card col-lg-11 mt-3">
              <div className="card-body">
                <h5 class="card-title mb-4">Platform</h5>
                <p class="card-text">- Benefit 1</p>
                <p class="card-text">- Benefit 2</p>
                <p class="card-text">- Benefit 3</p>
                <h5 class="card-title" style={{ float: "right" }}>ใช้ฟรี 14 วัน</h5>
              </div>
            </div>
            <div className="col-lg-11 mt-3">
              <div style={{ float: "right" }}>
                <button type="button" class="btn btn-light border mr-4">ยกเลิก</button>
                <button type="button" class="btn btn-danger">ทดลองใช้</button>
              </div>
            </div>
            <h1 className="mt-5 text-light">.</h1>
            <h1 className="mt-5 text-light">.</h1>
            <h1 className="mt-5 text-light">.</h1>
            <h1 className="mt-5 text-light">.</h1>
            <h1 className="mt-5 text-light">.</h1>
            <h1 className="mt-5 text-light">.</h1>
            <h1 className="mt-5 text-light">.</h1>

          </div>
        </div>
      </div>
    )
  }

}

const mapStateToProps = ({ authUser }) => {
  const { user } = authUser;
  return { user };
};

export default connect(
  mapStateToProps
)(Package);
