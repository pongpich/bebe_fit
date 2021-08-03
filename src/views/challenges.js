import React, { Component } from "react";
import { connect } from "react-redux";
import { getRank, getLogWeight, getIsReducedWeight, getLogWeightTeam, getDailyTeamWeightBonus, getNumberOfTeamNotFull, assignGroupToMember, clearChallenges, createChallengeGroup, leaveTeam, getMembersAndRank, getGroupName, getScoreOfTeam, getLeaderboard, getChallengePeriod } from "../redux/challenges";
import { getGroupID } from "../redux/auth";
import "./challenges.scss";


class Challenges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scoreInWeek: 0,
      teamName: "",
      selectedNavLink: "mission",
      selectedScoreBoard: "team"
    }
  }

  async componentDidMount() {
    if (this.props.user) {
      this.props.getGroupID(this.props.user.user_id);
      this.props.getChallengePeriod();
      if (this.props.user && this.props.user.group_id) {
        this.props.getRank(this.props.user.user_id, this.props.user.start_date);
        this.props.getLogWeight(this.props.user.user_id);
        this.props.getLogWeightTeam(this.props.user.group_id);
        this.props.getIsReducedWeight(this.props.user.user_id);
        this.props.getDailyTeamWeightBonus(this.props.user.user_id);
        this.props.getMembersAndRank(this.props.user.group_id, this.props.user.start_date);
        this.props.getGroupName(this.props.user.group_id);
        this.props.getScoreOfTeam(this.props.user.group_id);
        this.props.getLeaderboard();
      } else {
        this.props.clearChallenges()
      }
    } else {
      this.props.history.push('/login');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { user, statusGetNumberOfTeamNotFull, numberOfTeamNotFull, statusLeaveTeam } = this.props;
    if (prevProps.statusGetNumberOfTeamNotFull !== statusGetNumberOfTeamNotFull && statusGetNumberOfTeamNotFull === "success") {
      if (numberOfTeamNotFull > 0) {
        this.props.assignGroupToMember(this.props.user.user_id, this.props.user.start_date, this.props.user.fb_group);
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
      this.props.getMembersAndRank(this.props.user.group_id, this.props.user.start_date);
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
        if (parseFloat(exercise.play_time) / parseFloat(exercise.duration) < 0.9) {
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
        {this.renderPopupScoreDetail()}
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
                <p className="card-text">ออกกำลังกายครบ 4 วันต่อสัปดาห์<span style={{ float: "right", color: "#F45197" }}>{(this.props.statusVideoList !== 'no_video') ? isExerciseCompleted : 0}/4</span></p>
              </div>
            </div>
            <p className="card-text" style={{ float: "right", fontSize: "15px", color: "red" }}>*รายการจะถูก Reset และสรุปคะแนนทุกวันอาทิตย์ เพื่อคำนวณ Rank</p>
            <br></br>
            <hr className="w-100"></hr>
            <div className="row">
              <div className="col-lg-3 col-md-6 col-12">
                <h5
                  className="card-title"
                  style={{ cursor: "pointer", color: "#F45197", textDecoration: "underline" }}
                  onClick={() => this.openPopupScoreDetail()}>รายละเอียดคะแนน</h5>
              </div>
              <div className="col-lg-4 col-md-6 col-12">
                <h5
                  className="card-title"
                  style={{ cursor: "pointer", color: "#F45197", textDecoration: "underline" }}
                  onClick={() => this.openPopupRulesAndPrizes()}>กฎกติกาและของรางวัล</h5>
              </div>
            </div>
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
                    <p className="card-text">
                      <div className="row">
                        <div className="col-lg-6 col-md-6 col-12">
                          {index + 1}. {item.facebook ? item.facebook : `${item.first_name} ${item.last_name}`}
                        </div>
                        <div className="col-lg-3 col-md-3 col-6">
                          <span style={{ color: "grey" }}>{item.total_score} คะแนน</span>
                        </div>
                        <div className="col-lg-3 col-md-3 col-6">
                          <span style={{ float: "right", color: "#F45197" }}>
                            {
                              item.end_rank ?
                                item.end_rank.charAt(0).toUpperCase() + item.end_rank.substr(1).toLowerCase()
                                :
                                item.start_rank.charAt(0).toUpperCase() + item.start_rank.substr(1).toLowerCase()
                            }

                          </span>
                        </div>
                      </div>
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
              style={{ backgroundColor: "white", color: "#F45197", borderColor: "#F45197" }}
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

  renderTeamRank() {
    const { teamRank } = this.props;
    return (
      <div className="col-lg-12  mb-3" style={{ float: "left" }}>
        {
          (teamRank) &&
          teamRank.map((item, index) =>
            <p className="card-text">{index + 1}. {item.group_name}
              <span style={{ float: "right", color: "#F45197" }}>
                {item.totalScoreOfTeam ? item.totalScoreOfTeam : 0} คะแนน
              </span>
            </p>
          )
        }
      </div>)
  }

  renderIndividualRank() {
    const { individualRank, user } = this.props;
    var myRank = individualRank.filter(item => item.user_id === this.props.user.user_id);
    // myRank[0] === undefined คือกรณีผู้ใช้ไม่มีข้อมูลอยู่เลยใน member_event_log  (ทำให้เกิดบัค จึงต้องกำหนดค่าให้)
    if (myRank[0] === undefined) {
      myRank[0] = { "rank": 0, "facebook": user.facebook ? user.facebook : `${user.first_name} ${user.last_name}`, "total_score": 0 };
    }
    return (
      <div className="col-lg-12  mb-3" style={{ float: "left" }}>
        {
          <b className="row mb-4">
            <p className="card-text col-12">{myRank[0].rank}. {myRank[0].facebook ? myRank[0].facebook : `${myRank[0].first_name} ${myRank[0].last_name}`}
              <span style={{ float: "right", color: "#F45197" }}>
                {myRank[0].total_score ? myRank[0].total_score : 0} คะแนน
              </span>
            </p>
          </b>
        }
        {
          (individualRank) &&
          individualRank.map((item, index) =>
            <p className="card-text">{index + 1}. {item.facebook ? item.facebook : `${item.first_name} ${item.last_name}`}
              <span style={{ float: "right", color: "#F45197" }}>
                {item.total_score ? item.total_score : 0} คะแนน
              </span>
            </p>
          )
        }
      </div>)
  }

  renderScoreBoard() {
    const { selectedScoreBoard } = this.state;
    return (
      <div className="row">
        <div className="card shadow col-lg-5 col-md-12 col-12" style={{ borderRadius: "25px" }}>
          <div className="card-body">
            <div className="row">
              <h5
                className="ml-3 mr-4"
                style={{ color: `${selectedScoreBoard === "team" ? "#F45197" : "grey"}`, cursor: "pointer" }}
                onClick={() => this.setState({ selectedScoreBoard: "team" })}>
                คะแนนทีม
              </h5>
              <h5
                className=""
                style={{ color: `${selectedScoreBoard === "individual" ? "#F45197" : "grey"}`, cursor: "pointer" }}
                onClick={() => this.setState({ selectedScoreBoard: "individual" })}>
                คะแนนเดี่ยว
              </h5>
              <hr className="w-100"></hr>
              {(selectedScoreBoard === "team") && this.renderTeamRank()}
              {(selectedScoreBoard === "individual") && this.renderIndividualRank()}
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
        <div className="nav mt-5 mb-4 ml-5" id="myTab" role="tablist">
          <div className="mr-4 mb-3">
            <a className="" id="home-tab" data-toggle="tab" href="/#/Videdivst" role="tab" aria-controls="home" aria-selected="true" style={{ color: "black", textDecorationColor: "white" }}>Routine workout</a>
          </div>
          <div className="">
            <a className="" id="contact-tab" data-toggle="tab" href="/#/challenges" role="tab" aria-controls="contact" aria-selected="false" style={{ color: "#F45197", borderBottom: "5px solid #F45197", paddingBottom: "2px", textDecorationColor: "white" }}>เข้าร่วมชาเลนจ์</a>
          </div>
        </div>
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
      this.props.createChallengeGroup(user.user_id, teamName, user.start_date, user.fb_group)
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
            <div className="nav mt-5 mb-4 ml-5" id="myTab" role="tablist">
              <div className="mr-4 mb-3">
                <a className="" id="home-tab" data-toggle="tab" href="/#/Videdivst" role="tab" aria-controls="home" aria-selected="true" style={{ color: "black", textDecorationColor: "white" }}>Routine workout</a>
              </div>
              <div className="">
                <a className="" id="contact-tab" data-toggle="tab" href="/#/challenges" role="tab" aria-controls="contact" aria-selected="false" style={{ color: "#F45197", borderBottom: "5px solid #F45197", paddingBottom: "2px", textDecorationColor: "white" }}>เข้าร่วมชาเลนจ์</a>
              </div>
            </div>

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
        <div className="">
          <form>
            <div className="nav mt-5 mb-4 ml-5" id="myTab" role="tablist">
              <div className="mr-4 mb-3">
                <a className="" id="home-tab" data-toggle="tab" href="/#/Videdivst" role="tab" aria-controls="home" aria-selected="true" style={{ color: "black", textDecorationColor: "white" }}>Routine workout</a>
              </div>
              <div className="">
                <a className="" id="contact-tab" data-toggle="tab" href="/#/challenges" role="tab" aria-controls="contact" aria-selected="false" style={{ color: "#F45197", borderBottom: "5px solid #F45197", paddingBottom: "2px", textDecorationColor: "white" }}>เข้าร่วมชาเลนจ์</a>
              </div>
            </div>

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
                    {
                      this.props.challengePeriod &&
                      <button
                        type="button"
                        class="btn btn-danger col-6"
                        style={{ backgroundColor: "#F45197" }}
                        onClick={() => this.openPopupJoinChallenge()}>
                        เข้าร่วมชาเลนจ์
                        </button>
                    }
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
                  style={{ backgroundColor: "white", color: "#F45197", borderColor: "#F45197" }}
                  onClick={() => this.closePopupJoinChallenge()}>ยกเลิก</button>
                <div className="col-2"></div>
                <button
                  type="button"
                  className="btn btn-danger col-4"
                  style={{ backgroundColor: "#F45197" }}
                  onClick={() => this.props.getNumberOfTeamNotFull(this.props.user.fb_group)}>เข้าร่วม</button>
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
          <h4 className="mt-1 mb-4"><b>กฎและกติกา</b></h4>
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

  renderPopupScoreDetail() {
    return (
      <div>
        <div
          className="overlayContainerPopupScoreDetail"
          id="overlayPopupScoreDetail"
          onClick={() => this.closePopupScoreDetail()}
        />
        <div className="popupScoreDetail" id="popupScoreDetail">
          <div
            className="close-btn"
            onClick={() => this.closePopupScoreDetail()}
          >
            &times;
          </div>
          <br></br>
          <h4 className="mt-1 mb-4"><b>รายละเอียดคะแนน</b></h4>
          <h5 style={{ color: "#F45197" }}><b>• รายการชาเลนจ์แบบเดี่ยว</b></h5>
          <h6><b>ชั่งน้ำหนักครบ 2 ครั้ง</b> จะได้รับ 10 คะแนน</h6>
          <h6><b>น้ำหนักลดลงจากสัปดาห์ก่อน</b> จะได้รับ 10 คะแนน</h6>
          <h6><b>ออกกำลังกายครบ 4 วันต่อสัปดาห์</b> จะได้รับ 10 คะแนน</h6>
          <br></br>
          <h5 style={{ color: "#F45197" }}><b>• รายการชาเลนจ์แบบทีม</b></h5>
          <h6><b>สมาชิกทุกคนชั่งน้ำหนักครบ 2 ครั้ง</b> ทั้งทีมจะได้รับ คนละ 10 คะแนน</h6>
          <h6><b>ในแต่ละวันมีสมาชิกอย่างน้อย 1คน ชั่งน้ำหนัก</b></h6>
          <h6><b> - ครบ 7 วัน</b> ทั้งทีมจะได้รับ คนละ 70 คะแนน</h6>
          <h6><b> - ครบ 6 วัน</b> ทั้งทีมจะได้รับ คนละ 60 คะแนน</h6>
          <h6><b> - ครบ 5 วัน</b> ทั้งทีมจะได้รับ คนละ 50 คะแนน</h6>
          <h6><b> - ครบ 4 วัน</b> ทั้งทีมจะได้รับ คนละ 40 คะแนน</h6>
          <h6><b> - ครบ 3 วัน</b> ทั้งทีมจะได้รับ คนละ 30 คะแนน</h6>
          <h6><b> - ครบ 2 วัน</b> ทั้งทีมจะได้รับ คนละ 20 คะแนน</h6>
          <h6><b> - ครบ 1 วัน</b> ทั้งทีมจะได้รับ คนละ 10 คะแนน</h6>
          <br></br>
          <h5 style={{ color: "#F45197" }}><b>• Bonus Rank</b></h5>
          <h6><b>หากสัปดาห์นั้นอยู่ใน Rank "Gold"</b> จะได้รับคะแนนพิเศษ 5 คะแนน</h6>
          <h6><b>หากสัปดาห์นั้นอยู่ใน Rank "Platinum"</b> จะได้รับคะแนนพิเศษ 10 คะแนน</h6>
          <br></br>
          <h6 style={{ color: "#F45197" }}><b>ระบบจะทำการอัปเดตคะแนนทุกวันอาทิตย์เวลา 00.00 น.</b></h6>
          {
            (this.props.statusGetNumberOfTeamNotFull !== "loading") ?
              <div className="row mt-3">
                <div className="col-3"></div>
                <button
                  type="button"
                  className="btn btn-secondary col-6"
                  style={{ backgroundColor: "#F45197" }}
                  onClick={() => this.closePopupScoreDetail()}>ปิด</button>
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

  openPopupScoreDetail() {
    document.getElementById("popupScoreDetail").classList.toggle("active");
    document.getElementById("overlayPopupScoreDetail").classList.toggle("active");
  }

  closePopupScoreDetail() {
    document.getElementById("popupScoreDetail").classList.toggle("active");
    document.getElementById("overlayPopupScoreDetail").classList.toggle("active");
  }

  render() {
    const { numberOfTeamNotFull, statusGetNumberOfTeamNotFull, user } = this.props;
    return (
      <div>
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
  const { exerciseVideo, statusVideoList } = exerciseVideos;
  const { rank, logWeightCount, isReducedWeight, logWeightTeamCount, numberOfMembers, dailyTeamWeightBonusCount, numberOfTeamNotFull, statusGetNumberOfTeamNotFull, statusLeaveTeam, membersOfTeam, group_name, totalScoreOfTeam, teamRank, individualRank, statusCreateTeam, challengePeriod } = challenges;
  return { user, rank, logWeightCount, exerciseVideo, statusVideoList, isReducedWeight, logWeightTeamCount, numberOfMembers, dailyTeamWeightBonusCount, numberOfTeamNotFull, statusGetNumberOfTeamNotFull, statusLeaveTeam, membersOfTeam, group_name, totalScoreOfTeam, teamRank, individualRank, statusCreateTeam, challengePeriod };
};

const mapActionsToProps = { getRank, getLogWeight, getIsReducedWeight, getLogWeightTeam, getDailyTeamWeightBonus, getNumberOfTeamNotFull, assignGroupToMember, getGroupID, clearChallenges, createChallengeGroup, leaveTeam, getMembersAndRank, getGroupName, getScoreOfTeam, getLeaderboard, getChallengePeriod };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Challenges);