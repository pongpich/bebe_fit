import React, { Component } from "react";
import bghead from "../assets/img/bghead.jpg";
import { connect } from "react-redux";
import { getRank } from "../redux/challenges";

class Challenges extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  async componentDidMount() {
    //เช็คว่า group_id ไม่เท่ากับ null
    this.props.getRank(this.props.user.user_id, this.props.user.start_date);
  }

  render() {
    const  rank  = this.props.rank.charAt(0).toUpperCase() + this.props.rank.substr(1).toLowerCase(); //ตัวแรกพิมพ์ใหญ่ ตัวที่เหลือพิมพ์เล็ก
    return (
      <div>
        <div className="page-header header-small mt-5" data-parallax="true"
          style={{ backgroundImage: `url(${bghead})` }}>
          <div className="overlay">
            <video className="mt-4" width="100%" height="100%" controls autoPlay muted >
              <source src="https://media.planforfit.com/bebe/video/414644989_720.mp4" type="video/mp4"></source>
            </video>
          </div>
        </div>

        <div className="card-body d-flex justify-content-center">
          <form>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item">
                <a className="nav-link disabled" id="home-tab" data-toggle="tab" href="/#/VideoList" role="tab" aria-controls="home" aria-selected="true">Routine workout</a>
              </li>
              {/*  <li className="nav-item">
                <a className="nav-link disabled" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">รวมคลิปออกกำลังกาย</a>
              </li> */}
              <li className="nav-item">
                <a className="nav-link active h5" id="contact-tab" data-toggle="tab" href="/#/challenges" role="tab" aria-controls="contact" aria-selected="false">ชาเลนจ์</a>
              </li>
            </ul>

            <div className="row">
              <div className="card mt-3 col-lg-7 col-md-12" >
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-6  mb-3" style={{ float: "left" }}>
                      <h5 className="card-title"><b>รายการชาเลนจ์แบบทีม</b></h5>
                      <p className="card-text">ทีมชั่งน้ำหนักครบ 20 ครั้ง <span style={{ float: "right" }}>0/20</span></p>
                      <p className="card-text">ในแต่ละวันมีสมาชิกชั่งน้ำหนัก <span style={{ float: "right" }}>0/7</span></p>
                    </div>
                    <div className="col-lg-6 mb-3" style={{ float: "right" }}>
                      <h5 className="card-title"><b>รายการชาเลนจ์แบบเดี่ยว</b></h5>
                      <p className="card-text">ชั่งน้ำหนักครบ 2 ครั้ง <span style={{ float: "right" }}>0/2</span></p>
                      <p className="card-text">น้ำหนักลดลงจากสัปดาห์ก่อน<span style={{ float: "right" }}>0/1</span></p>
                      <p className="card-text">ออกกำลังกายครบทั้งสัปดาห์<span style={{ float: "right" }}>0/1</span></p>
                    </div>
                  </div>
                  <p className="card-text" style={{ float: "right", fontSize: "13px" }}>*รายการจะถูก Reset และสรุปคะแนนทุกวันอาทิตย์ เพื่อคำนวณ Rank</p>
                  <br></br>
                  <hr className="w-100"></hr>
                  <u className="nav-link" style={{ cursor: "pointer" }}>กฏกติกาและของรางวัลการแข่งขัน</u>
                  <u className="nav-link" style={{ cursor: "pointer" }}>ระยะเวลาร่วมกิจกรรม</u>
                </div>
              </div>

              <div className="card mt-3  col-lg-4 col-md-12  offset-lg-1" >
                <div className="card-body">
                  <center>
                    <img src="https://homepages.cae.wisc.edu/~ece533/images/cat.png" className="rounded-circle" alt="Cinque Terre" width="45%" height="45%" />
                    <h5 className="card-title mt-3">{rank}</h5>
                    {/* <progress id="expRank" value="40" max="41"> </progress>
                    <p className="card-text">40/41 point</p> */}
                  </center>
                </div>
              </div>
            </div>
          </form>
        </div>

        <h1 style={{ color: "white" }}>.</h1>
        <h1 style={{ color: "white" }}>.</h1>
        <h1 style={{ color: "white" }}>.</h1>
        <h1 style={{ color: "white" }}>.</h1>


      </div>
    )
  }
}

const mapStateToProps = ({ authUser, challenges }) => {
  const { user } = authUser;
  const { rank } = challenges;
  return { user, rank };
};

const mapActionsToProps = { getRank };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Challenges);