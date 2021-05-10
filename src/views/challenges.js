import React, { Component } from "react";
import bghead from "../assets/img/bghead.jpg";
import { connect } from "react-redux";
import { getRank, getLogWeight, getIsReducedWeight, getLogWeightTeam, getDailyTeamWeightBonus, getNumberOfTeamNotFull, assignGroupToMember, clearChallenges, createChallengeGroup, leaveTeam, getMembersAndRank, getGroupName, getScoreOfTeam, getLeaderboard } from "../redux/challenges";
import { getGroupID } from "../redux/auth";
import "./challenges.scss";


class Challenges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scoreInWeek: 0,
      teamName: "",
      selectedNavLink: "mission"
    }
  }

  async componentDidMount() {
    if (this.props.user && this.props.user.group_id) {
      this.props.getRank(this.props.user.user_id, this.props.user.start_date);
      this.props.getLogWeight(this.props.user.user_id);
      this.props.getLogWeightTeam(this.props.user.group_id);
      this.props.getIsReducedWeight(this.props.user.user_id);
      this.props.getDailyTeamWeightBonus(this.props.user.user_id);
      this.props.getMembersAndRank(this.props.user.group_id);
      this.props.getGroupName(this.props.user.group_id);
      this.props.getScoreOfTeam(this.props.user.group_id);
      this.props.getLeaderboard();
    } else {
      this.props.clearChallenges()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { user, statusGetNumberOfTeamNotFull, numberOfTeamNotFull, statusLeaveTeam } = this.props;
    if (prevProps.statusGetNumberOfTeamNotFull !== statusGetNumberOfTeamNotFull && statusGetNumberOfTeamNotFull === "success") {
      if (numberOfTeamNotFull > 0) {
        this.props.assignGroupToMember(this.props.user.user_id, this.props.user.start_date);
      }
    }
    //หลังจาก assignGroupToMember หรือ createChallengeGroup  จะมีการ getNumberOfTeamNotFull ให้ทำการ getGroupID
    //หรือ หลังจาก leaveTeam ให้ getGroupID (group_id ที่ได้ จะเป็น null)
    if ((prevProps.statusGetNumberOfTeamNotFull !== statusGetNumberOfTeamNotFull && statusGetNumberOfTeamNotFull === "default")
      || (prevProps.statusLeaveTeam === "default" && statusLeaveTeam === "success")) {
      this.props.getGroupID(this.props.user.user_id);
    }
    //หลังจาก getGroupID จะมีการแก้ไขค่า user.group_id ที่ Reducer authUser
    if (user && user.group_id !== prevProps.user.group_id) {
      this.props.getRank(this.props.user.user_id, this.props.user.start_date);
      this.props.getLogWeight(this.props.user.user_id);
      this.props.getLogWeightTeam(this.props.user.group_id);
      this.props.getIsReducedWeight(this.props.user.user_id);
      this.props.getDailyTeamWeightBonus(this.props.user.user_id);
      this.props.getMembersAndRank(this.props.user.group_id);
      this.props.getGroupName(this.props.user.group_id);
      this.props.getScoreOfTeam(this.props.user.group_id);
      this.props.getLeaderboard();
    }
  }

  isExerciseCompleted(activites) {
    //let isCompleted = true;
    let count = 4;

    //if (activites.length <= 0) isCompleted = false;

    for (let dayIndex = 0; dayIndex < activites.length; dayIndex++) {
      const dailyExercises = activites[dayIndex];
      for (let exIndex = 0; exIndex < dailyExercises.length; exIndex++) {
        const exercise = dailyExercises[exIndex];
        if (parseFloat(exercise.play_time) !== parseFloat(exercise.duration)) {
          //isCompleted = false;
          count = count - 1;
          break;
        }
      }
    }
    return count;
  }

  renderMission() {
    const rank = (this.props.rank && this.props.rank.charAt(0).toUpperCase() + this.props.rank.substr(1).toLowerCase()); //ตัวแรกพิมพ์ใหญ่ ตัวที่เหลือพิมพ์เล็ก
    const { logWeightCount, isReducedWeight, logWeightTeamCount, numberOfMembers, dailyTeamWeightBonusCount } = this.props;
    const isExerciseCompleted = this.isExerciseCompleted(this.props.exerciseVideo);
    var { scoreInWeek } = this.state;
    if (logWeightCount >= 2) { scoreInWeek += 10 }; //ชั่งน้ำหนักครบ 2 ครั้ง
    if (isReducedWeight) { scoreInWeek += 10 }; //น้ำหนักลดลงจากสัปดาห์ก่อน
    if (isExerciseCompleted === 4) { scoreInWeek += 10 }; //ออกกำลังกายครบทั้งสัปดาห์
    if (logWeightTeamCount >= numberOfMembers * 2) { scoreInWeek += 10 }; //ทีมชั่งน้ำหนักครบ คนละ2ครั้ง
    if (dailyTeamWeightBonusCount > 0) { scoreInWeek += dailyTeamWeightBonusCount * 10 }; //ในแต่ละวันมีสมาชิกชั่งน้ำหนัก
    if (scoreInWeek > 41) { scoreInWeek = 41 }; //เพื่อไม่ให้เกินหลอด
    return (
      <div className="row">
        {this.renderPopupRulesAndPrizes()}
        <div className="card shadow col-lg-7 col-md-12" style={{ borderRadius: "25px" }}>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6  mb-3" style={{ float: "left" }}>
                <h5 className="card-title mb-4" style={{ color: "#F45197" }}><b>รายการชาเลนจ์แบบทีม</b></h5>
                <p className="card-text">ทีมชั่งน้ำหนักครบ {numberOfMembers * 2} ครั้ง <span style={{ float: "right", color: "#F45197" }}>{logWeightTeamCount}/{numberOfMembers * 2}</span></p>
                <p className="card-text">ทีมชั่งน้ำหนักครบ 7 วัน<span style={{ float: "right", color: "#F45197" }}>{dailyTeamWeightBonusCount}/7</span></p>
              </div>
              <div className="col-lg-6 mb-3" style={{ float: "right" }}>
                <h5 className="card-title mb-4" style={{ color: "#F45197" }}><b>รายการชาเลนจ์แบบเดี่ยว</b></h5>
                <p className="card-text">ชั่งน้ำหนักครบ 2 ครั้ง <span style={{ float: "right", color: "#F45197" }}>{logWeightCount}/2</span></p>
                <p className="card-text">น้ำหนักลดลงจากสัปดาห์ก่อน<span style={{ float: "right", color: "#F45197" }}>{isReducedWeight ? 1 : 0}/1</span></p>
                <p className="card-text">ออกกำลังกายครบ 4 วันต่อสัปดาห์<span style={{ float: "right", color: "#F45197" }}>{isExerciseCompleted}/4</span></p>
              </div>
            </div>
            <p className="card-text" style={{ float: "right", fontSize: "15px", color: "red" }}>*รายการจะถูก Reset และสรุปคะแนนทุกวันอาทิตย์ เพื่อคำนวณ Rank</p>
            <br></br>
            <hr className="w-100"></hr>
            <h5
              className="card-title underline-on-hover"
              style={{ cursor: "pointer", color: "#F45197" }}
              onClick={() => this.openPopupRulesAndPrizes()}>กฎกติกาและของรางวัล</h5>
          </div>
        </div>

        <div className="card shadow col-lg-4 col-md-12  offset-lg-1" style={{ borderRadius: "25px" }}>
          <div className="card-body">
            <center>
              <img src={rank && `../assets/img/rank/${rank.toLowerCase()}.png`} className="rounded-circle" alt="Cinque Terre" width="45%" height="45%" />
              <h3 className="card-title" style={{ color: "#F45197" }}><b>{rank}</b></h3>
              <div class="progress" style={{ width: "70%", borderRadius: "25px" }}>
                <div class="progress-bar" style={{ width: `${(scoreInWeek / 41) * 100}%`, backgroundColor: "#F45197" }}></div>
              </div>
              <h5 className="card-text mt-3 mb-3" style={{ color: "#F45197" }}>{scoreInWeek}/41 คะแนน</h5>
            </center>
          </div>
        </div>
      </div>
    )
  }

  renderTeamList() {
    const { numberOfMembers, membersOfTeam, group_name, totalScoreOfTeam } = this.props;
    return (
      <div className="row">
        {this.renderPopupLeaveTeam()}
        <div className="card shadow col-lg-7 col-md-12" style={{ borderRadius: "25px" }}>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-12">
                <h5 className="card-title"><b style={{ color: "#F45197" }}>{group_name}</b> <span style={{ float: "right" }}>สมาชิก {numberOfMembers}/10คน</span></h5>
              </div>
              <div className="col-lg-10">
                {
                  (membersOfTeam) &&
                  membersOfTeam.map((item, index) =>
                    <p className="card-text">{index + 1}. {item.first_name}
                      <span style={{ float: "right", color: "#F45197" }}>
                        {item.start_rank.charAt(0).toUpperCase() + item.start_rank.substr(1).toLowerCase()}
                      </span>
                    </p>
                  )
                }
              </div>
            </div>
            <br></br>
            <hr className="w-100"></hr>
            <h5
              className="underline-on-hover"
              style={{ cursor: "pointer", color: "#F45197" }}
              onClick={() => this.openPopupLeaveTeam()}>ออกจากทีม</h5>
          </div>
        </div>

        <div className="card shadow col-lg-4 col-md-12  offset-lg-1" style={{ borderRadius: "25px" }}>
          <div className="card-body">
            <center style={{ marginTop: "35%", marginBottom: "35%" }}>
              <h3 className="mb-4">คะแนนทีม</h3>
              <h1 style={{ color: "#F45197" }}>{totalScoreOfTeam ? totalScoreOfTeam : 0} คะแนน</h1>
            </center>
          </div>
        </div>
      </div>
    )
  }

  renderPopupLeaveTeam() {
    const { user } = this.props;
    return (
      <div>
        <div
          className="overlayContainerPopupLeaveTeam"
          id="overlayPopupLeaveTeam"
          onClick={() => this.closePopupLeaveTeam()}
        />
        <div className="popupLeaveTeam" id="popupLeaveTeam">
          <div
            className="close-btn"
            onClick={() => this.closePopupLeaveTeam()}
          >
            &times;
          </div>
          <br></br>
          <center>
            <h1 className="mt-1 mb-4" style={{ color: "red" }}>
              <i className="fa fa-exclamation-triangle fa-2x mr-2" aria-hidden="true"></i>
              Warning!</h1>
            <h5>หากออกจากทีม</h5>
            <h5 style={{ color: "red" }}>- Rank จะถูกปรับเป็น "Newbie"</h5>
            <h5><b>คุณแน่ใจหรือไม่ ?</b></h5>
          </center>
          <div className="row mt-5">
            <div className="col-1"></div>
            <button
              type="button"
              className="btn btn-secondary col-4"
              onClick={() => this.closePopupLeaveTeam()}>ยกเลิก</button>
            <div className="col-2"></div>
            <button
              type="button"
              className="btn btn-danger col-4"
              style={{ backgroundColor: "#F45197" }}
              onClick={() => this.props.leaveTeam(user.user_id)}>ยืนยัน</button>
            <div className="col-1"></div>
          </div>
        </div>
      </div>
    )
  }

  openPopupLeaveTeam() {
    document.getElementById("popupLeaveTeam").classList.toggle("active");
    document.getElementById("overlayPopupLeaveTeam").classList.toggle("active");
  }

  closePopupLeaveTeam() {
    document.getElementById("popupLeaveTeam").classList.toggle("active");
    document.getElementById("overlayPopupLeaveTeam").classList.toggle("active");
  }

  renderScoreBoard() {
    const { leaderBoard } = this.props;
    return (
      <div className="row">
        <div className="card shadow col-lg-5 col-md-12" style={{ borderRadius: "25px" }}>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-12  mb-3" style={{ float: "left" }}>
                {
                  (leaderBoard) &&
                  leaderBoard.map((item, index) =>
                    <p className="card-text">{index + 1}. {item.group_name}
                      <span style={{ float: "right", color: "#F45197" }}>
                        {item.totalScoreOfTeam ? item.totalScoreOfTeam : 0} คะแนน
                      </span>
                    </p>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderChallenge() {
    const { selectedNavLink } = this.state;
    return (
      <div>
        <ul className="nav nav-tabs mt-3" id="myTab" role="tablist">
          <li className="nav-item">
            <a className="nav-link disabled" id="home-tab" data-toggle="tab" href="/#/VideoList" role="tab" aria-controls="home" aria-selected="true">Routine workout</a>
          </li>
          {/*  <li className="nav-item">
                <a className="nav-link disabled" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">รวมคลิปออกกำลังกาย</a>
              </li> */}
          <li className="nav-item">
            <a className="nav-link active h5" id="contact-tab" data-toggle="tab" href="/#/challenges" role="tab" aria-controls="contact" aria-selected="false" style={{ color: "#F45197" }}>ชาเลนจ์</a>
          </li>
        </ul>
        <div className="card-body d-flex justify-content-center" style={{ backgroundColor: "#D8D6DF" }}>
          <form className="col-lg-12 col-md-12">
            <div className="row mb-5 mt-3">
              <div className="col-lg-12 mb-5">
                <nav className="nav">
                  <a
                    className="nav-link"
                    style={{ color: `${selectedNavLink === "mission" ? "#F45197" : ""}`, cursor: "pointer" }}
                    onClick={() => this.setState({ selectedNavLink: "mission" })}
                  >
                    <b>ภารกิจ</b>
                  </a>
                  <a
                    className="nav-link"
                    style={{ color: `${selectedNavLink === "teamList" ? "#F45197" : ""}`, cursor: "pointer" }}
                    onClick={() => this.setState({ selectedNavLink: "teamList" })}
                  >
                    <b>สมาชิกในทีม</b>
                  </a>
                  <a
                    className="nav-link"
                    style={{ color: `${selectedNavLink === "scoreBoard" ? "#F45197" : ""}`, cursor: "pointer" }}
                    onClick={() => this.setState({ selectedNavLink: "scoreBoard" })}
                  >
                    <b>กระดานคะแนน</b>
                  </a>
                </nav>
                {(selectedNavLink === "mission") && this.renderMission()}
                {(selectedNavLink === "teamList") && this.renderTeamList()}
                {(selectedNavLink === "scoreBoard") && this.renderScoreBoard()}
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    })
  };

  createTeam(teamName) {
    const { user } = this.props;
    if (teamName.length > 6) {
      this.props.createChallengeGroup(user.user_id, teamName, user.start_date)
    } else {
      this.setState({
        teamName: ""
      })
    }
  }

  renderCreateTeam() {
    const { user } = this.props;
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
                <a className="nav-link active h5" id="contact-tab" data-toggle="tab" href="/#/challenges" role="tab" aria-controls="contact" aria-selected="false" style={{ color: "#F45197" }}>ชาเลนจ์</a>
              </li>
            </ul>

            <div className="row">
              <div className="card shadow mt-3  col-lg-12 col-md-12" >
                <center>
                  <h4 className="card-title mt-3 mb-4" style={{ color: "#F45197" }}><b>ตั้งชื่อทีมของคุณ</b></h4>
                  <input
                    type=""
                    className="form-control"
                    placeholder="ชื่อทีมต้องมากกว่า 6 ตัวอักษร"
                    id="teamName"
                    value={this.state.teamName}
                    onChange={(event) => this.handleChange(event)}
                  />
                  {
                    (this.props.statusCreateTeam !== "loading") ?
                      <button
                        type="button"
                        class="btn btn-danger mt-4 mb-4 col-12"
                        style={{ backgroundColor: "#F45197" }}
                        onClick={() =>
                          this.createTeam(this.state.teamName)
                        }>ยืนยัน</button>
                      :
                      <div />
                  }
                </center>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  renderJoinChallenge() {
    return (
      <div>
        {this.renderPopupJoinChallenge()}
        {this.renderPopupRulesAndPrizes()}
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
                <a className="nav-link active h5" id="contact-tab" data-toggle="tab" href="/#/challenges" role="tab" aria-controls="contact" aria-selected="false" style={{ color: "#F45197" }}>ชาเลนจ์</a>
              </li>
            </ul>

            <div className="row" style={{ backgroundColor: "#D8D6DF" }}>
              <div className="card shadow mt-5 mb-5  col-lg-10 col-md-12  offset-lg-1" style={{ borderRadius: "25px" }}>
                <div className="card-body">
                  <center>
                    <h2 className="card-title mt-3 "><b>ชาเลนจ์น้องใหม่ เอาใจสมาชิก <b style={{ color: "#F45197" }}>BEBE FIT ROUTINE</b></b></h2>
                    <h2 className="card-title mb-5"><b>สนุกไปกับภารกิจพร้อมรับสิทธิพิเศษมากมาย</b></h2>
                    <div className="row">
                      <div className="mb-4 col-lg-4">
                        <img src={`../assets/img/challenges/scale.png`} className="rounded-circle mb-3" />
                        <h5 className="card-title"><b>ภารกิจพิชิตตัวเลข</b></h5>
                        <h5 className="card-text">บันทึกการชั่งน้ำหนักเพื่อดูความเปลี่ยนแปลงของร่างกาย <span style={{ color: "#F45197" }}>รับ 10 คะแนน</span></h5>
                      </div>
                      <div className="mb-4 col-lg-4">
                        <img src={`../assets/img/challenges/exercise.png`} className="rounded-circle mb-3" />
                        <h5 className="card-title"><b>ภารกิจฟิตเฟิร์ม</b></h5>
                        <h5 className="card-text">ก้าวสู่เป้าหมายออกกำลังกายได้ครบทั้งสัปดาห์  <span style={{ color: "#F45197" }}>รับ 10 คะแนน</span></h5>
                      </div>
                      <div className="mb-4 col-lg-4">
                        <img src={`../assets/img/challenges/challenge.png`} className="rounded-circle mb-3" />
                        <h5 className="card-title"><b>ภารกิจก้าวสู่ทีมอันดับ 1</b></h5>
                        <h5 className="card-text mb-4">สะสมคะแนนกับเพื่อนร่วมทีม <span style={{ color: "#F45197" }}>อีกหนึ่งแรงผลักดันสู่เป้าหมายในการออกกำลังกาย</span></h5>
                      </div>
                    </div>
                    <button
                      type="button"
                      class="btn btn-danger col-6"
                      style={{ backgroundColor: "#F45197" }}
                      onClick={() => this.openPopupJoinChallenge()}>เข้าร่วมชาเลนจ์</button>
                  </center>
                  <div className="mt-4">
                    <center>
                      <h5
                        className="card-title underline-on-hover col-6"
                        style={{ cursor: "pointer", color: "#F45197" }}
                        onClick={() => this.openPopupRulesAndPrizes()}>กฎกติกาและของรางวัล</h5>
                    </center>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }

  renderPopupJoinChallenge() {
    return (
      <div>
        <div
          className="overlayContainerPopupJoinChallenge"
          id="overlayPopupJoinChallenge"
          onClick={() => this.closePopupJoinChallenge()}
        />
        <div className="popupJoinChallenge" id="popupJoinChallenge" style={{ borderRadius: "25px" }}>
          <br></br>
          <center>
            <img src={`../assets/img/challenges/champ.png`} className="rounded-circle mb-3" />
            <h4 className="mt-1 mb-3" style={{ color: "#F45197" }}><b>คุณต้องการเข้าร่วมชาเลนจ์หรือไม่</b></h4>
          </center>
          {
            (this.props.statusGetNumberOfTeamNotFull !== "loading") ?
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
                  style={{ backgroundColor: "#F45197" }}
                  onClick={() => this.props.getNumberOfTeamNotFull()}>เข้าร่วม</button>
                <div className="col-1"></div>
              </div>
              :
              <div />
          }
        </div>
      </div>
    )
  }

  renderPopupRulesAndPrizes() {
    return (
      <div>
        <div
          className="overlayContainerPopupRulesAndPrizes"
          id="overlayPopupRulesAndPrizes"
          onClick={() => this.closePopupRulesAndPrizes()}
        />
        <div className="popupRulesAndPrizes" id="popupRulesAndPrizes">
          <div
            className="close-btn"
            onClick={() => this.closePopupRulesAndPrizes()}
          >
            &times;
          </div>
          <br></br>
          <h4 className="mt-1 mb-4"><b>กฎและกติการ</b></h4>
          <h5 style={{ color: "#F45197" }}><b>• สมาชิกในทีม</b></h5>
          <h6>1 ทีม จะมีสมาชิกจำนวน 10 ท่าน โดยระบบจะทำการจัดทีมให้อัตโนมัติ</h6>
          <h6>หากสมาชิกหมดอายุก่อนจบ Season ระบบจะตัดออกจากกลุ่มใน 7 วัน</h6>
          <br></br>
          <h5 style={{ color: "#F45197" }}><b>• การเลื่อนขั้น (Rank)</b></h5>
          <h6>ระดับขั้นจะแบ่งออกเป็น Newbie, Bronze, Silver, Gold และ Platinum</h6>
          <h6>ในแต่ละสัปดาห์ถ้ามีคะแนนรวมมากกว่า 40 คะแนนจะได้รับการเลื่อนขั้น</h6>
          <h6>แต่หากคะแนนน้อยกว่าหรือเท่ากับ 40 คะแนนจะถูดลดขั้นลงมา 1 ลำดับ </h6>
          <h6>โดยระบบจะทำการอัปเดตคะแนนทุกวันอาทิตย์เวลา 00.00 น.</h6>
          <br></br>
          <h5 style={{ color: "#F45197" }}><b>• การสะสมคะแนน</b></h5>
          <h6><b>คะแนนส่วนบุคคล</b> จะได้รับจากภารกิจ โดยจำนวนคะแนนที่ได้รับนั้น</h6>
          <h6>จะขึ้นอยู่กับ Rank ในแต่ละสัปดาห์ ยิ่ง Rank สูงจะได้คะแนนมากขึ้น</h6>
          <h6><b>คะแนนของทีม</b> จะเป็นคะแนนสะสมรวมของสมาชิก</h6>
          <h6>ถ้าคนในทีมทำภารกิจสำเร็จ ผู้ร่วมทีมจะได้รับคะแนนด้วยเช่นกัน</h6>
          <br></br>
          <h5 style={{ color: "#F45197" }}><b>• รายละเอียดของรางวัลประจำ Season</b></h5>
          <h6>สามารถติดตามของรางวัลได้ทาง Facebook Group</h6>
          <br></br>
          <h5 style={{ color: "#F45197" }}><b>• ระยะเวลาชาเลนจ์</b></h5>
          <h6>เริ่มตั้งแต่วันที่ 14 มิถุนายน 2561 สิ้นสุดวันที่ 1 สิงหาคม 2561</h6>
          {
            (this.props.statusGetNumberOfTeamNotFull !== "loading") ?
              <div className="row mt-3">
                <div className="col-3"></div>
                <button
                  type="button"
                  className="btn btn-secondary col-6"
                  style={{ backgroundColor: "#F45197" }}
                  onClick={() => this.closePopupRulesAndPrizes()}>ปิด</button>
                <div className="col-3"></div>
              </div>
              :
              <div />
          }
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

  openPopupRulesAndPrizes() {
    document.getElementById("popupRulesAndPrizes").classList.toggle("active");
    document.getElementById("overlayPopupRulesAndPrizes").classList.toggle("active");
  }

  closePopupRulesAndPrizes() {
    document.getElementById("popupRulesAndPrizes").classList.toggle("active");
    document.getElementById("overlayPopupRulesAndPrizes").classList.toggle("active");
  }

  render() {
    const { numberOfTeamNotFull, statusGetNumberOfTeamNotFull, user } = this.props;
    return (
      <div>
        <div className="page-header header-small" data-parallax="true"
          style={{ backgroundImage: `url(${bghead})` }}>
          <div className="overlay">
            <video className="mt-4" width="100%" height="100%" controls autoPlay muted >
              <source src="https://media.planforfit.com/bebe/video/INTRO%20PROGRAM.mp4" type="video/mp4"></source>
            </video>
          </div>
        </div>
        {
          (user && user.group_id) ?
            this.renderChallenge()
            :
            (statusGetNumberOfTeamNotFull === "default" || numberOfTeamNotFull > 0) ?
              this.renderJoinChallenge()
              :
              this.renderCreateTeam()
        }
      </div>
    )
  }
}

const mapStateToProps = ({ authUser, challenges, exerciseVideos }) => {
  const { user } = authUser;
  const { exerciseVideo } = exerciseVideos;
  const { rank, logWeightCount, isReducedWeight, logWeightTeamCount, numberOfMembers, dailyTeamWeightBonusCount, numberOfTeamNotFull, statusGetNumberOfTeamNotFull, statusLeaveTeam, membersOfTeam, group_name, totalScoreOfTeam, leaderBoard, statusCreateTeam } = challenges;
  return { user, rank, logWeightCount, exerciseVideo, isReducedWeight, logWeightTeamCount, numberOfMembers, dailyTeamWeightBonusCount, numberOfTeamNotFull, statusGetNumberOfTeamNotFull, statusLeaveTeam, membersOfTeam, group_name, totalScoreOfTeam, leaderBoard, statusCreateTeam };
};

const mapActionsToProps = { getRank, getLogWeight, getIsReducedWeight, getLogWeightTeam, getDailyTeamWeightBonus, getNumberOfTeamNotFull, assignGroupToMember, getGroupID, clearChallenges, createChallengeGroup, leaveTeam, getMembersAndRank, getGroupName, getScoreOfTeam, getLeaderboard };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Challenges);