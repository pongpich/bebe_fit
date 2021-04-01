import React, { Component } from "react";
import bghead from "../assets/img/bghead.jpg";
import { connect } from "react-redux";
import { getRank, getLogWeight, getIsReducedWeight, getLogWeightTeam, getDailyTeamWeightBonus, getNumberOfTeamNotFull, assignGroupToMember } from "../redux/challenges";
import { getGroupID } from "../redux/auth";
import "./challenges.scss";


class Challenges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scoreInWeek: 0
    }
  }

  async componentDidMount() {
    if (this.props.user && this.props.user.group_id) {
      this.props.getRank(this.props.user.user_id, this.props.user.start_date);
      this.props.getLogWeight(this.props.user.user_id);
      this.props.getLogWeightTeam(this.props.user.group_id);
      this.props.getIsReducedWeight(this.props.user.user_id);
      this.props.getDailyTeamWeightBonus(this.props.user.user_id);
    } else {
      //
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { user, statusGetNumberOfTeamNotFull, numberOfTeamNotFull } = this.props;
    if (prevProps.statusGetNumberOfTeamNotFull === "default" && statusGetNumberOfTeamNotFull === "success") {
      if (numberOfTeamNotFull > 0) {
        this.props.assignGroupToMember(this.props.user.user_id, this.props.user.start_date);
      } else {
        //โชว์หน้าสร้างทีม
      }
    }
    //หลัง assignGroupToMember เสร็จ ให้ทำการ getGroupID
    if (prevProps.statusGetNumberOfTeamNotFull === "success" && statusGetNumberOfTeamNotFull === "default") {
      this.props.getGroupID(this.props.user.user_id);
    }
    if (user && user.group_id !== prevProps.user.group_id) {
      this.props.getRank(this.props.user.user_id, this.props.user.start_date);
      this.props.getLogWeight(this.props.user.user_id);
      this.props.getLogWeightTeam(this.props.user.group_id);
      this.props.getIsReducedWeight(this.props.user.user_id);
      this.props.getDailyTeamWeightBonus(this.props.user.user_id);
    }
  }

  isExerciseCompleted(activites) {
    let isCompleted = true;

    if (activites.length <= 0) isCompleted = false;

    for (let dayIndex = 0; dayIndex < activites.length; dayIndex++) {
      const dailyExercises = activites[dayIndex];
      for (let exIndex = 0; exIndex < dailyExercises.length; exIndex++) {
        const exercise = dailyExercises[exIndex];
        if (parseFloat(exercise.play_time) !== parseFloat(exercise.duration)) {
          isCompleted = false;
          break;
        }
      }
    }
    return isCompleted;
  }

  renderChallenge() {
    const rank = (this.props.rank && this.props.rank.charAt(0).toUpperCase() + this.props.rank.substr(1).toLowerCase()); //ตัวแรกพิมพ์ใหญ่ ตัวที่เหลือพิมพ์เล็ก
    const { logWeightCount, isReducedWeight, logWeightTeamCount, numberOfMembers, dailyTeamWeightBonusCount } = this.props;
    const isExerciseCompleted = this.isExerciseCompleted(this.props.exerciseVideo);
    var { scoreInWeek } = this.state;
    if (logWeightCount >= 2) { scoreInWeek += 10 }; //ชั่งน้ำหนักครบ 2 ครั้ง
    if (isReducedWeight) { scoreInWeek += 10 }; //น้ำหนักลดลงจากสัปดาห์ก่อน
    if (isExerciseCompleted) { scoreInWeek += 10 }; //ออกกำลังกายครบทั้งสัปดาห์
    if (logWeightTeamCount >= numberOfMembers * 2) { scoreInWeek += 10 }; //ทีมชั่งน้ำหนักครบ คนละ2ครั้ง
    if (dailyTeamWeightBonusCount > 0) { scoreInWeek += dailyTeamWeightBonusCount * 10 }; //ในแต่ละวันมีสมาชิกชั่งน้ำหนัก
    if (scoreInWeek > 41) { scoreInWeek = 41 }; //เพื่อไม่ให้เกินหลอด
    return (
      <div>
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
                      <p className="card-text">ทีมชั่งน้ำหนักครบ {numberOfMembers * 2} ครั้ง <span style={{ float: "right" }}>{logWeightTeamCount}/{numberOfMembers * 2}</span></p>
                      <p className="card-text">ทีมชั่งน้ำหนักครบ 7 วัน<span style={{ float: "right" }}>{dailyTeamWeightBonusCount}/7</span></p>
                    </div>
                    <div className="col-lg-6 mb-3" style={{ float: "right" }}>
                      <h5 className="card-title"><b>รายการชาเลนจ์แบบเดี่ยว</b></h5>
                      <p className="card-text">ชั่งน้ำหนักครบ 2 ครั้ง <span style={{ float: "right" }}>{logWeightCount}/2</span></p>
                      <p className="card-text">น้ำหนักลดลงจากสัปดาห์ก่อน<span style={{ float: "right" }}>{isReducedWeight ? 1 : 0}/1</span></p>
                      <p className="card-text">ออกกำลังกายครบทั้งสัปดาห์<span style={{ float: "right" }}>{isExerciseCompleted ? 1 : 0}/1</span></p>
                    </div>
                  </div>
                  <p className="card-text" style={{ float: "right", fontSize: "13px" }}>*รายการจะถูก Reset และสรุปคะแนนทุกวันอาทิตย์ เพื่อคำนวณ Rank</p>
                  <br></br>
                  <hr className="w-100"></hr>
                  <u className="nav-link" style={{ cursor: "pointer" }}>กฏและกติกา</u>
                  <u className="nav-link" style={{ cursor: "pointer" }}>ของรางวัล</u>
                </div>
              </div>

              <div className="card mt-3  col-lg-4 col-md-12  offset-lg-1" >
                <div className="card-body">
                  <center>
                    <img src="https://homepages.cae.wisc.edu/~ece533/images/cat.png" className="rounded-circle" alt="Cinque Terre" width="45%" height="45%" />
                    <h5 className="card-title mt-3">{rank}</h5>
                    <progress id="expRank" value={scoreInWeek} max="41"> </progress>
                    <p className="card-text">{scoreInWeek}/41 point</p>
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

  renderJoinChallenge() {
    return (
      <div>
        {this.renderPopupDailyWeighChallenge()}
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
              <div className="card mt-3  col-lg-12 col-md-12  offset-lg-1" >
                <div className="card-body">
                  <center>
                    <h4 className="card-title mt-3 mb-4"><b>เข้าร่วมชาเลนจ์เพื่อรับสิทธิพิเศษมากมาย</b></h4>
                    <p className="card-text">Benefit list</p>
                    <p className="card-text">Benefit list</p>
                    <p className="card-text">Benefit list</p>
                    <p className="card-text">Benefit list</p>
                    <p className="card-text">Benefit list</p>
                    <button
                      type="button"
                      class="btn btn-danger mt-4 col-12"
                      onClick={() => this.openPopupJoinChallenge()}>เข้าร่วมชาเลนจ์</button>
                  </center>
                  <div className="col-5   mt-4" style={{ float: "left" }}>
                    <center><h5 className="card-title"><b>กฎกติกา</b></h5></center>
                  </div>
                  <div className="col-5 mt-4" style={{ float: "right" }}>
                    <center><h5 className="card-title"><b>ของรางวัล</b></h5></center>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  renderPopupDailyWeighChallenge() {
    return (
      <div>
        <div
          className="overlayContainerPopupJoinChallenge"
          id="overlayPopupJoinChallenge"
          onClick={() => this.closePopupJoinChallenge()}
        />
        <div className="popupJoinChallenge" id="popupJoinChallenge">
          <div
            className=""
            onClick={() => this.closePopupJoinChallenge()}
            style={{ cursor: "pointer", position: "fixed", top: "5px", right: "5px" }}
          >
            <i class="fa fa-times fa-lg"></i>
          </div>
          <br></br>
          <center><h5 className="mt-1 mb-3">คุณต้องการเข้าร่วมชาเลนจ์หรือไม่</h5></center>
          <div className="row mt-5">
            <div className="col-1"></div>
            <button
              type="button"
              className="btn btn-secondary col-4"
              onClick={() => this.closePopupJoinChallenge()}>ยกเลิก</button>
            <div className="col-2"></div>
            <button
              type="button"
              className="btn btn-danger col-4"
              onClick={() => this.props.getNumberOfTeamNotFull()}>เข้าร่วม</button>
            <div className="col-1"></div>
          </div>
        </div>
      </div>
    )
  }

  openPopupJoinChallenge() {
    document.getElementById("popupJoinChallenge").classList.toggle("active");
    document.getElementById("overlayPopupJoinChallenge").classList.toggle("active");
  }

  closePopupJoinChallenge() {
    document.getElementById("popupJoinChallenge").classList.toggle("active");
    document.getElementById("overlayPopupJoinChallenge").classList.toggle("active");
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
        {
          (this.props.user && this.props.user.group_id) ?
            this.renderChallenge()
            :
            this.renderJoinChallenge()
        }
      </div>
    )
  }
}

const mapStateToProps = ({ authUser, challenges, exerciseVideos }) => {
  const { user } = authUser;
  const { exerciseVideo } = exerciseVideos;
  const { rank, logWeightCount, isReducedWeight, logWeightTeamCount, numberOfMembers, dailyTeamWeightBonusCount, numberOfTeamNotFull, statusGetNumberOfTeamNotFull } = challenges;
  return { user, rank, logWeightCount, exerciseVideo, isReducedWeight, logWeightTeamCount, numberOfMembers, dailyTeamWeightBonusCount, numberOfTeamNotFull, statusGetNumberOfTeamNotFull };
};

const mapActionsToProps = { getRank, getLogWeight, getIsReducedWeight, getLogWeightTeam, getDailyTeamWeightBonus, getNumberOfTeamNotFull, assignGroupToMember, getGroupID };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Challenges);