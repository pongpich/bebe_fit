import React, { Component } from "react";
import { connect } from "react-redux";
import "./package.scss";
import { trialPackage, logoutUser } from "../redux/auth";
import { clearVideoList } from "../redux/exerciseVideos";
import { getTreepayHash, clearPayment } from "../redux/payment";
import moment from 'moment';


class Package extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusTrial: "default",
      pay_type: "",
      order_no: ""
    }
  }

  componentDidMount() {
    const { user, program } = this.props;
    this.props.clearPayment();
    if (user === null || program === null) {
      this.props.history.push('/platform');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { user, hash_data } = this.props;
    if (prevProps.user !== user && user === null) {
      this.props.history.push('/login');
    }
    if (prevProps.hash_data !== hash_data && hash_data !== null) {
      var hash_input = document.createElement("input");
      hash_input.setAttribute("type", "hidden");
      hash_input.setAttribute("name", "hash_data");
      hash_input.setAttribute("value", hash_data);
      document.getElementById("treepay_form").appendChild(hash_input);
      console.log("hash_data :", hash_data);
    }
  }

  onSelectedPayTypeTreepay(pay_type) {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var date = today.getDate();
    var time = today.getTime();

    if (parseInt(month) < 10) {
      month = "0" + month;
    }

    var order_no = year + "" + month + "" + date + "" + time;
    var trade_mony = this.props.program.price;
    var user_id = this.props.user.user_id;
    this.props.getTreepayHash(pay_type, order_no, trade_mony, user_id)

    this.setState({
      pay_type: pay_type,
      order_no: order_no
    })
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
              <button type="button" class="btn btn-light border mr-4" onClick={() => this.props.history.push('/platform')}>
                ยกเลิก
              </button>
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
            <button type="button" class="btn btn-danger" style={{ width: "100%" }} onClick={() => this.props.history.push('/videolist')}>
              ใช้งาน Platform
            </button>
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
              <p>
                <a class="card-text" onClick={() => this.onSelectedPayTypeTreepay("PABK")} style={{ cursor: "pointer" }}>
                  Treepay (PABK)
                </a>
              </p>
              <p>
                <a class="card-text" onClick={() => this.onSelectedPayTypeTreepay("PACA")} style={{ cursor: "pointer" }}>
                  Treepay (PACA)
                </a>
              </p>
              <p>
                <a class="card-text" onClick={() => this.onSelectedPayTypeTreepay("PAIN")} style={{ cursor: "pointer" }}>
                  Treepay (PAIN)
                </a>
              </p>
            </div>
          </div>
          <div className="col-lg-11 mt-4">
            <form
              action="https://paytest.treepay.co.th/total/hubInit.tp"
              id="treepay_form"
              method="post"
            >
              Pay Type : <input type="text" name="pay_type" value={this.state.pay_type} /><br></br>
              Currency : <input type="text" name="currency" value="764" /><br></br>
              Lang : <input type="text" name="tp_langFlag" value="en" /><br></br>
              Site CD : <input type="text" name="site_cd" value={this.props.site_cd} /><br></br>
              Return URL :<input type="text" name="ret_url" value="http://localhost:3002/execute_paytree" /><br></br>
              User ID : <input type="text" name="user_id" value={this.props.user.user_id} /><br></br>
              Order No : <input type="text" name="order_no" value={this.state.order_no} /><br></br>
              Good Name : <input type="text" name="good_name" value={this.props.program.program_id} /><br></br>
              Trade Money : <input type="text" name="trade_mony" value={this.props.program.price} /><br></br>
              Order FName :<input type="text" name="order_first_name" value={this.props.user.first_name} /><br></br>
              Order LName :<input type="text" name="order_last_name" value={this.props.user.last_name} /><br></br>
              Order Addr :<input type="text" name="order_addr" value="" /><br></br>
              Order Email :<input type="text" name="order_email" value={this.props.user.email} /><br />
              <input type="hidden" name="res_cd" value="" />
              <input type="hidden" name="res_msg" value="" />
              <input type="submit" name="submit" value="CLICK PAYMENT" alt="" />
            </form>
            <div style={{ float: "right" }}>
              <button type="button" class="btn btn-light border mr-4" onClick={() => this.props.history.push('/platform')}>
                ยกเลิก
              </button>
              <button type="button" class="btn btn-danger">
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

const mapStateToProps = ({ authUser, exerciseProgram, payment }) => {
  const { user } = authUser;
  const { program } = exerciseProgram;
  const { hash_data, site_cd } = payment;
  return { user, program, hash_data, site_cd };
};

const mapActionsToProps = {
  trialPackage,
  logoutUser,
  clearVideoList,
  getTreepayHash,
  clearPayment
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Package);
