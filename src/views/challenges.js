import React, { Component } from "react";
import bghead from "../assets/img/bghead.jpg";


class Challenges extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
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
              <li className="nav-item">
                <a className="nav-link disabled" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">รวมคลิปออกกำลังกาย</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active h5" id="contact-tab" data-toggle="tab" href="/#/challenges" role="tab" aria-controls="contact" aria-selected="false">เข้าร่วมชาเลนจ์</a>
              </li>
            </ul>

            <div className="row">
              <div className="card mt-3 col-lg-7 col-md-12" >
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-6  mb-3" style={{ float: "left" }}>
                      <h5 className="card-title">รายการชาเรนจ์แบบทีม</h5>
                      <p className="card-text">ทีมชั่งน้ำหนักครบ 7 วัน <span style={{ float: "right" }}>0/7</span></p>
                    </div>
                    <div className="col-lg-6 mb-3" style={{ float: "right" }}>
                      <h5 className="card-title">รายการชาเรนจ์แบบเดี่ยว</h5>
                      <p className="card-text">ชั่งน้ำหนัก 2ครั้ง <span style={{ float: "right" }}>0/2</span></p>
                      <p className="card-text">ส่งรูปถ่าย<span style={{ float: "right" }}>0/1</span></p>
                      <p className="card-text">ออกกำลังกายครบทั้งวีค<span style={{ float: "right" }}>0/4</span></p>
                    </div>
                  </div>
                  <p className="card-text" style={{ float: "right", fontSize: "12px" }}>*คะแนนจะถูก Reset ทุกๆวันอาทิตย์</p>
                  <hr className="w-100"></hr>
                  <u className="nav-link" style={{ cursor: "pointer" }}>กฏกติกาและของรางวัลการแข่งขัน</u>
                  <u className="nav-link" style={{ cursor: "pointer" }}>ระยะเวลาร่วมกิจกรรม</u>
                </div>
              </div>

              <div className="card mt-3  col-lg-4 col-md-12  offset-lg-1" >
                <div className="card-body">
                  <center>
                    <img src="https://homepages.cae.wisc.edu/~ece533/images/cat.png" className="rounded-circle" alt="Cinque Terre" width="45%" height="45%" />
                    <h5 className="card-title mt-3">Gold rank</h5>
                    <progress id="expRank" value="10" max="100"> 10% </progress>
                    <p className="card-text">10/100 point</p>
                  </center>
                </div>
              </div>
            </div>
          </form>
        </div>

        <h1 style={{color: "white"}}>.</h1>
        <h1 style={{color: "white"}}>.</h1>
        <h1 style={{color: "white"}}>.</h1>
        <h1 style={{color: "white"}}>.</h1>


      </div>
    )
  }
}

export default Challenges;