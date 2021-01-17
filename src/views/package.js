import React, { Component } from "react";
import { connect } from "react-redux";
import "./package.scss";
import { trialPackage, logoutUser } from "../redux/auth";
import { clearVideoList } from "../redux/exerciseVideos";
import moment from 'moment';


class Package extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusTrial: "default"
    }
  }

  componentDidMount() {
    const { user, program } = this.props;
    if (user === null || program === null) {
      this.props.history.push('/platform');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { user } = this.props;
    if (prevProps.user !== user && user === null) {
      this.props.history.push('/login');
    }
  }

  onSelectedTrialPackage(event) {
    const { user } = this.props;
    const period = 14;
    const expire_date = `${moment().add(period, 'days').format('YYYY/MM/DD')} 23:59:59`;
    this.props.trialPackage(user.email, expire_date);
    this.setState({
      statusTrial: "success"
    })
  }

  onUserLogout(event) {
    this.props.logoutUser();
    this.props.clearVideoList();
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

  renderTrialPackage() {
    return (
      <div className="row mt-5">
        <div className="col-lg-4 mt-5">
          <div className="container" style={{ backgroundColor: "grey", height: "100%", width: "90%", marginTop: "15%" }}>
          </div>
        </div>
        <div className="col-lg-8 mt-5">
          <h1 className="mt-5 ml-2">แพ็คเกจ</h1>
          <div className="card col-lg-11 mt-3 shadow-sm">
            <div className="card-body">
              <h5 class="card-title mb-4">Platform</h5>
              <p class="card-text">- Benefit 1</p>
              <p class="card-text">- Benefit 2</p>
              <p class="card-text">- Benefit 3</p>
              <h5 class="card-title" style={{ float: "right" }}>ใช้ฟรี 14 วัน</h5>
            </div>
          </div>
          <div className="col-lg-11 mt-4">
            <div style={{ float: "right" }}>
              <a href="/platform">
                <button type="button" class="btn btn-light border mr-4">ยกเลิก</button>
              </a>
              <button type="button" class="btn btn-danger" onClick={() => this.onSelectedTrialPackage()}>
                ทดลองใช้
              </button>
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
    )
  }

  renderTrialPackageSuccess() {
    return (
      <div className="row mt-5">
        <div className="col-lg-4 mt-5">
          <div className="container" style={{ backgroundColor: "grey", height: "100%", width: "90%", marginTop: "15%" }}>
          </div>
        </div>
        <div className="col-lg-8 mt-5">
          <h1 className="mt-5 ml-2">สำเร็จ</h1>
          <center><h4 className="mt-3">thank you</h4></center>
          <center><h4 className="">XXXXXXXXXXXXXXXXXX</h4></center>
          <div className="card col-lg-11 mt-3 shadow-sm">
            <div className="card-body">
              <h5 class="card-title mb-4">แพ็คเกจ</h5>
              <p class="card-text">Platform</p>
              <h5 class="card-title" style={{ float: "right" }}>ใช้ฟรี 14 วัน</h5>
            </div>
          </div>
          <div className="col-lg-11 mt-4">
            <a href="/videolist">
              <button type="button" class="btn btn-danger" style={{ width: "100%" }}>ใช้งาน Platform</button>
            </a>
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
    )
  }

  renderFit60DaysPackage() {
    return (
      <div className="row mt-5">
        <div className="col-lg-4 mt-5">
          <div className="container" style={{ backgroundColor: "grey", height: "100%", width: "90%", marginTop: "15%" }}>
          </div>
        </div>
        <div className="col-lg-8 mt-5">
          <h1 className="mt-5 ml-2">แพ็คเกจแบบเสียเงิน (ทดสอบ)</h1>
          <div className="card col-lg-11 mt-3 shadow-sm">
            <div className="card-body">
              <h5 class="card-title mb-4">Platform X เดือน</h5>
              <p class="card-text">- Benefit 1</p>
              <p class="card-text">- Benefit 2</p>
              <p class="card-text">- Benefit 3</p>
              <h5 class="card-title" style={{ float: "right" }}>ราคา XXX บาท</h5>
            </div>
            <div className="card-body">
              <h5 class="card-title mb-4">เลือกช่องทางการชำระเงิน</h5>
              <p class="card-text">โอนเงิน</p>
              <p class="card-text">Treepay</p>
            </div>
          </div>
          <div className="col-lg-11 mt-4">
            <div style={{ float: "right" }}>
              <a href="/platform">
                <button type="button" class="btn btn-light border mr-4">ยกเลิก</button>
              </a>
              <button type="button" class="btn btn-danger" onClick={() => this.onSelectedTrialPackage()}>
                ถัดไป
              </button>
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
    )
  }

  render() {
    const { statusTrial } = this.state;
    const { program } = this.props;
    return (
      <div className="center">
        {this.renderNavbarLogoutMenu()}
        {
          (program !== null && program.program_id === "trial14") && (
            (statusTrial === "success") ?
              this.renderTrialPackageSuccess()
              :
              this.renderTrialPackage()
          )
        }
        {
          (program !== null && program.program_id === "fit60days") && (
            this.renderFit60DaysPackage()
          )
        }
      </div>
    )
  }

}

const mapStateToProps = ({ authUser, exerciseProgram }) => {
  const { user } = authUser;
  const { program } = exerciseProgram;
  return { user, program };
};

const mapActionsToProps = {
  trialPackage,
  logoutUser,
  clearVideoList
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Package);
