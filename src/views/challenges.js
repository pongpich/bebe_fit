import React, { Component } from "react";
import { connect } from "react-redux";
import { getRank, getLogWeight, getIsReducedWeight, getLogWeightTeam, getDailyTeamWeightBonus, getNumberOfTeamNotFull, assignGroupToMember, clearChallenges, createChallengeGroup, leaveTeam, getMembersAndRank, getGroupName, getScoreOfTeam, getLeaderboard, getChallengePeriod, getFriendList, getMaxFriends, sendFriendRequest, getFriendRequest, rejectFriend, acceptFriend, deleteFriend, getFriendsRank, sendTeamInvite, getTeamInvite, acceptTeamInvite, rejectTeamInvite } from "../redux/challenges";
import { getGroupID, checkUpdateMaxFriends } from "../redux/auth";
import "./challenges.scss";
import moment from "moment"


class Challenges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scoreInWeek: 0,
      teamName: "",
      selectedNavLink: "mission",
      selectedScoreBoard: "team",
      selectedAddFriend: false,
      emailAddFriend: "",
      emailDeleteFriend: "",
      emailTeamInvite: "",
      selectedTeamInvite: false,
    }
  }

  async componentDidMount() {
    if (this.props.user) {
      this.props.getGroupID(this.props.user.user_id);
      this.props.checkUpdateMaxFriends(this.props.user.user_id);
      this.props.getChallengePeriod();

      this.props.getTeamInvite(this.props.user.user_id);
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
        this.props.getFriendList(this.props.user.user_id);
        this.props.getFriendRequest(this.props.user.user_id);
        this.props.getMaxFriends(this.props.user.user_id);
        this.props.getFriendsRank(this.props.user.user_id)
      } else {
        this.props.clearChallenges()
      }
    } else {
      this.props.history.push('/login');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { user, statusGetNumberOfTeamNotFull, numberOfTeamNotFull, statusLeaveTeam, statusSendFriendRequest, friend_request, statusGetFriendRequest, statusAcceptFriend, statusRejectFriend, statusDeleteFriend, statusSendTeamInvite, statusGetTeamInvite, team_invite, statusRejectTeamInvite, statusAcceptTeamInvite } = this.props;

    if ((prevProps.statusRejectTeamInvite !== statusRejectTeamInvite) && (statusRejectTeamInvite === "success")) {
      this.openPopupTeamInvite(); //สั่งให้ซ่อน popup TeamInvite
      this.props.getTeamInvite(this.props.user.user_id)
    }

    if ((prevProps.statusAcceptTeamInvite !== statusAcceptTeamInvite) && (statusAcceptTeamInvite === "success")) {
      this.openPopupTeamInvite(); //สั่งให้ซ่อน popup TeamInvite
      this.props.getGroupID(user.user_id);
      this.props.getTeamInvite(this.props.user.user_id)
    }

    if ((prevProps.statusGetTeamInvite !== statusGetTeamInvite) && (statusGetTeamInvite === "success")) {
      if (team_invite && team_invite[0]) { //team_invite[0] คือ คำชวนเข้าทีมที่เก่าที่สุดที่ยังไม่ตอบรับ
        this.openPopupTeamInvite(); //สั่งให้โชว์ popup TeamInvite
      }
    }

    if ((prevProps.statusSendTeamInvite !== statusSendTeamInvite) && (statusSendTeamInvite === "success")) {
      this.setState({
        selectedTeamInvite: false
      })
    }

    if ((prevProps.statusDeleteFriend !== statusDeleteFriend) && (statusDeleteFriend === "success")) {
      this.closePopupDeleteFriend(); //สั่งให้ซ่อน popup DeleteFriend
      this.props.getFriendList(this.props.user.user_id);
    }

    if ((prevProps.statusRejectFriend !== statusRejectFriend) && (statusRejectFriend === "success")) {
      this.closePopupFriendRequest(); //สั่งให้ซ่อน popup FriendRequest
      this.props.getFriendRequest(this.props.user.user_id);
    }

    if ((prevProps.statusAcceptFriend !== statusAcceptFriend) && (statusAcceptFriend === "success" || statusAcceptFriend === "fail")) {
      this.closePopupFriendRequest(); //สั่งให้ซ่อน popup FriendRequest
      this.props.getFriendList(this.props.user.user_id);
      this.props.getFriendRequest(this.props.user.user_id);
    }

    if ((prevProps.statusGetFriendRequest !== statusGetFriendRequest) && statusGetFriendRequest === "success") {
      if (friend_request && friend_request[0]) { //friend_request[0] คือ คำขอเป็นเพื่อนที่เก่าที่สุดที่ยังไม่ตอบรับ
        this.openPopupFriendRequest(); //สั่งให้โชว์ popup FriendRequest
      }
    }

    if ((prevProps.statusSendFriendRequest !== statusSendFriendRequest) && (statusSendFriendRequest === "success")) {
      this.setState({ selectedAddFriend: false })
    }

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

  renderPopupTeamInvite() {
    return (
      <div>
        <div
          className="overlayContainerPopupTeamInvite"
          id="overlayPopupTeamInvite"
          onClick={() => this.closePopupTeamInvite()}
        />
        <div className="popupTeamInvite" id="popupTeamInvite">
          <div
            className="close-btn"
            onClick={() => this.closePopupTeamInvite()}
          >
            &times;
          </div>
          <br></br>
          <h5 style={{ color: "#F45197", textAlign: "center" }}><b>คำชวนเข้าร่วมทีมชาเลนจ์</b></h5>
          <br></br>
          <h6><b>{this.props.team_invite && this.props.team_invite[0] && this.props.team_invite[0].email}</b> ต้องการชวนคุณเข้าร่วมทีม</h6>
          <br></br>
          {
            ((this.props.statusAcceptFriend !== "loading" && this.props.statusRejectFriend !== "loading")) &&
            <div className="row mt-3">
              <div className="col-1"></div>
              <button
                type="button"
                className="btn btn-secondary col-4"
                style={{ backgroundColor: "white", color: "#F45197", borderColor: "#F45197" }}
                onClick={() => this.props.rejectTeamInvite(this.props.team_invite && this.props.team_invite[0] && this.props.team_invite[0].log_id)}
              >
                ปฎิเสธ
              </button>
              <div className="col-2"></div>
              <button
                type="button"
                className="btn btn-secondary col-4"
                style={{ backgroundColor: "#F45197", borderColor: "#F45197" }}
                onClick={() => this.props.acceptTeamInvite(
                  (this.props.user && this.props.user.user_id),
                  (this.props.team_invite && this.props.team_invite[0] && this.props.team_invite[0].group_id),
                  (this.props.team_invite && this.props.team_invite[0] && this.props.team_invite[0].log_id),
                )}
              >
                เข้าร่วมทีม
              </button>
              <div className="col-1"></div>
            </div>
          }
        </div>
      </div>
    )
  }

  openPopupTeamInvite() {
    document.getElementById("popupTeamInvite").classList.toggle("active");
    document.getElementById("overlayPopupTeamInvite").classList.toggle("active");
  }

  closePopupTeamInvite() {
    document.getElementById("popupTeamInvite").classList.toggle("active");
    document.getElementById("overlayPopupTeamInvite").classList.toggle("active");
  }

  renderTeamList() {
    const { numberOfMembers, membersOfTeam, group_name, totalScoreOfTeam, user, statusSendTeamInvite } = this.props;
    const { selectedTeamInvite, emailTeamInvite } = this.state;
    return (
      <div className="row">
        {this.renderPopupLeaveTeam()}
        {
          selectedTeamInvite ?
            <div className="card shadow col-lg-7 col-md-12" style={{ borderRadius: "25px" }}>
              <div className="card-body">
                <div className="row mt-4 justify-content-center">
                  <div className="col-lg-12 "  >
                    <h5 className="" style={{ textAlign: "center" }}> <img src={`../assets/img/challenges/vectorinvite.png`} />&nbsp; ชวนเข้าทีม</h5>
                  </div>
                  <div className="col-lg-6">
                    <input
                      type=""
                      className="form-control"
                      placeholder="อีเมล"
                      id="emailTeamInvite"
                      value={this.state.emailTeamInvite}
                      onChange={(event) => this.handleChange(event)}
                    />
                    {
                      statusSendTeamInvite !== "loading" &&
                      <button
                        type="button"
                        class="btn btn-danger mt-4 mb-4 col-12"
                        style={{ backgroundColor: "#F45197" }}
                        onClick={() => this.props.sendTeamInvite((user && user.user_id), emailTeamInvite)}
                      >
                        ส่งคำเชิญ
                      </button>
                    }
                  </div>
                </div>
                <br></br>
              </div>
            </div>
            :
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
                <div className="row justify-content-between">
                  <h5
                    className="underline-on-hover"
                    style={{ cursor: "pointer", color: "#F45197" }}
                    onClick={() => this.openPopupLeaveTeam()}>ออกจากทีม</h5>
                  {
                    (membersOfTeam) && (membersOfTeam.length < 10) &&
                    <h5
                      className="underline-on-hover"
                      style={{ cursor: "pointer", color: "#F45197" }}
                      onClick={() => this.setState({ selectedTeamInvite: true })}>+ ชวนเข้าทีม</h5>
                  }
                </div>
              </div>
            </div>
        }

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
            <h5>แล้วยังไม่เข้าร่วมทีมใหม่ ภายในวันอาทิตย์นี้ 23:30 น.</h5>
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
    const { teamRank, user } = this.props;
    const teamRankFilter = teamRank.filter(item => user.fb_group === item.fb_group);

    return (
      <div className="col-lg-12  mb-3" style={{ float: "left" }}>
        <div className="box-Individual">
          {
            
            (teamRankFilter) &&
            teamRankFilter.map((item, index) =>
              <>
                { 
                  user.group_id == item.group_id ?
                    <p className="card-text user-idLogin">{index + 1}. {item.group_name}
                      &nbsp;
                      {
                        console.log("index",index)
                      }
                      {
                        index + 1 == "1" ? 
                        <img  src="../assets/img/coin/gold.png" alt=""/>
                        : null
                      }
                      {
                        index+ 1 == "2" ? 
                        <img  src="../assets/img/coin/silver.png" alt=""/>
                        : null
                      }
                      {
                        index+ 1 == "3" ? 
                        <img  src="../assets/img/coin/copper.png" alt=""/>
                        : null
                      }
                      <span style={{ float: "right", color: "#F45197" }}>
                        {item.totalScoreOfTeam ? item.totalScoreOfTeam : 0} คะแนน
                      </span>
                    </p>
                    :
                    <p className="card-text">{index + 1}. {item.group_name}
                      &nbsp;
                      {
                        console.log("index",index)
                      }
                      {
                        index + 1 == "1" ? 
                        <img  src="../assets/img/coin/gold.png" alt=""/>
                        : null
                      }
                      {
                        index + 1 == "2" ? 
                        <img  src="../assets/img/coin/silver.png" alt=""/>
                        : null
                      }
                      {
                        index + 1 == "3" ? 
                        <img  src="../assets/img/coin/copper.png" alt=""/>
                        : null
                      }
                      <span style={{ float: "right", color: "#F45197" }}>
                        {item.totalScoreOfTeam ? item.totalScoreOfTeam : 0} คะแนน
                      </span>
                    </p>
                }
              </>

            )
          }
        </div>
        {
          (teamRankFilter) &&
          teamRankFilter.map((item, index) =>
            user.group_id == item.group_id ?
              <b className=" mb-4">
                <p className="card-text">{index + 1}. {item.group_name}
                  <span style={{ float: "right", color: "#F45197" }}>
                    {item.totalScoreOfTeam ? item.totalScoreOfTeam : 0} คะแนน
                  </span>
                </p>
              </b>
              : null

          )
        }
      </div>)
  }

  renderIndividualRank() {
    const { individualRank, user } = this.props;
    const individualRankFilter = individualRank.filter(item => Math.abs(moment(user.start_date).diff(moment(item.start_date), "days")) <= 1);

    var myRank = individualRank.filter(item => item.user_id === this.props.user.user_id);
    // myRank[0] === undefined คือกรณีผู้ใช้ไม่มีข้อมูลอยู่เลยใน member_event_log  (ทำให้เกิดบัค จึงต้องกำหนดค่าให้)
    if (myRank[0] === undefined) {
      myRank[0] = { "rank": 0, "facebook": user.facebook ? user.facebook : `${user.first_name} ${user.last_name}`, "total_score": 0 };
    }

    var myRankIndex = individualRankFilter.findIndex(item => item.user_id === this.props.user.user_id);

    return (
      <div className="col-lg-12  mb-3" style={{ float: "left" }}>
        <div className="box-Individual">
          {
            (individualRankFilter) &&
            individualRankFilter.map((item, index) => {
              const fullName = `${item.first_name} ${item.last_name}`;
              const rankDetail = `${index + 1}. ${item.facebook ? item.facebook : fullName}`;
              index = index + 1;
              return (
                <>
                  {
                    this.props.user.user_id === item.user_id ?
                      <p className="card-text user-idLogin">{rankDetail}
                       &nbsp;
                      {
                        console.log("index",index)
                      }
                      {
                        index == "1" ? 
                        <img  src="../assets/img/coin/gold.png" alt=""/>
                        : null
                      }
                      {
                        index == "2" ? 
                        <img  src="../assets/img/coin/silver.png" alt=""/>
                        : null
                      }
                      {
                        index == "3" ? 
                        <img  src="../assets/img/coin/copper.png" alt=""/>
                        : null
                      }
                        <span style={{ float: "right", color: "#F45197" }}>
                          {item.total_score ? item.total_score : 0} คะแนน
                        </span>
                      </p>
                      :
                      <p className="card-text">{rankDetail}
                       &nbsp;
                      {
                        console.log("index",index)
                      }
                      {
                        index == "1" ? 
                        <img  src="../assets/img/coin/gold.png" alt=""/>
                        : null
                      }
                      {
                        index == "2" ? 
                        <img  src="../assets/img/coin/silver.png" alt=""/>
                        : null
                      }
                      {
                        index == "3" ? 
                        <img  src="../assets/img/coin/copper.png" alt=""/>
                        : null
                      }
                        <span style={{ float: "right", color: "#F45197" }}>
                          {item.total_score ? item.total_score : 0} คะแนน
                        </span>
                      </p>
                  }
                </>

              )
            })
          }
        </div>
        {
          <b className="row mb-4">
            <p className="card-text col-12">{myRankIndex + 1}. {myRank[0].facebook ? myRank[0].facebook : `${myRank[0].first_name} ${myRank[0].last_name}`}
              <span style={{ float: "right", color: "#F45197" }}>
                {myRank[0].total_score ? myRank[0].total_score : 0} คะแนน
              </span>
            </p>
          </b>
        }
      </div>)
  }

  renderFriendsRank() {
    const { user, friendsRank } = this.props;

    var myRank = friendsRank.filter(item => item.user_id === this.props.user.user_id);
    // myRank[0] === undefined คือกรณีผู้ใช้ไม่มีข้อมูลอยู่เลยใน member_event_log  (ทำให้เกิดบัค จึงต้องกำหนดค่าให้)
    if (myRank[0] === undefined) {
      myRank[0] = { "rank": 0, "facebook": user.facebook ? user.facebook : `${user.first_name} ${user.last_name}`, "total_score": 0 };
    }

    var myRankIndex = friendsRank.findIndex(item => item.user_id === this.props.user.user_id);

    return (
      <div className="col-lg-12  mb-3" style={{ float: "left" }}>

        <div className="box-Individual">
          {
            (friendsRank && (friendsRank.length > 0)) &&
            friendsRank.map((item, index) => {
              const fullName = `${item.first_name} ${item.last_name}`;
              const rankDetail = `${index + 1}. ${item.facebook ? item.facebook : fullName}`;
               index = index+1;
              return (
                <>
                  {
                    user.user_id === item.user_id ? 
                      <p className="card-text user-idLogin">{rankDetail} &nbsp;
                      {
                        console.log("index",index)
                      }
                      {
                        index == "1" ? 
                        <img  src="../assets/img/coin/gold.png" alt=""/>
                        : null
                      }
                      {
                        index == "2" ? 
                        <img  src="../assets/img/coin/silver.png" alt=""/>
                        : null
                      }
                      {
                        index == "3" ? 
                        <img  src="../assets/img/coin/copper.png" alt=""/>
                        : null
                      }
                        <span style={{ float: "right", color: "#F45197" }}>
                          {item.total_score ? item.total_score : 0} คะแนน
                        </span>
                        
                      </p>
                      :
                      <p className="card-text">{rankDetail}&nbsp;
                      {
                        index == 1 ? 
                        <img  src="../assets/img/coin/gold.png" alt=""/>
                        : null
                      }
                      {
                        index == 2 ? 
                        <img  src="../assets/img/coin/silver.png" alt=""/>
                        : null
                      }
                      {
                        index == 3 ? 
                        <img  src="../assets/img/coin/copper.png" alt=""/>
                        : null
                      }
                        <span style={{ float: "right", color: "#F45197" }}>
                          {item.total_score ? item.total_score : 0} คะแนน
                        </span>
                      </p> 
                  }
                </>

              )
            })
          }
        </div>
        {
          <b className="row mb-6">
            <p className="card-text col-12">{myRankIndex + 1}. {myRank[0].facebook ? myRank[0].facebook : `${myRank[0].first_name} ${myRank[0].last_name}`}
              <span style={{ float: "right", color: "#F45197" }}>
                {myRank[0].total_score ? myRank[0].total_score : 0} คะแนน
              </span>
            </p>
          </b>
        }
      </div>)
  }

  renderScoreBoard() {
    const { friendsRank } = this.props;
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
                className="mr-4"
                style={{ color: `${selectedScoreBoard === "individual" ? "#F45197" : "grey"}`, cursor: "pointer" }}
                onClick={() => this.setState({ selectedScoreBoard: "individual" })}>
                คะแนนเดี่ยว
              </h5>
              {
                (friendsRank && (friendsRank.length > 0)) &&
                <h5
                  className=""
                  style={{ color: `${selectedScoreBoard === "friendsRank" ? "#F45197" : "grey"}`, cursor: "pointer" }}
                  onClick={() => this.setState({ selectedScoreBoard: "friendsRank" })}>
                  คะแนนเพื่อน
                </h5>
              }
              <hr className="w-100"></hr>
              {(selectedScoreBoard === "team") && this.renderTeamRank()}
              {(selectedScoreBoard === "individual") && this.renderIndividualRank()}
              {(selectedScoreBoard === "friendsRank") && this.renderFriendsRank()}
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderPopupMaxFriendsDetail() {
    return (
      <div>
        <div
          className="overlayContainerPopupMaxFriendsDetail"
          id="overlayPopupMaxFriendsDetail"
          onClick={() => this.closePopupMaxFriendsDetail()}
        />
        <div className="popupMaxFriendsDetail" id="popupMaxFriendsDetail">
          <div
            className="close-btn"
            onClick={() => this.closePopupMaxFriendsDetail()}
          >
            &times;
          </div>
          <br></br>
          <h5 style={{ color: "#F45197" }}><b>วิธีการเพิ่มจำนวนเพื่อน</b></h5>
          <h6><b>•</b> เริ่มต้นสามารถ add เพื่อนได้ 1 คน</h6>
          <h6><b>•</b> ทำ 1 active week (ออกกำลังกายครบอย่างน้อย 1 วัน) จะสามารถเพิ่มเพื่อนได้อีก 2 คน</h6>
          <h6><b>•</b> จำนวนเพื่อนมีสูงสุดได้ 15 คน</h6>
          <br></br>
          {
            (this.props.statusGetNumberOfTeamNotFull !== "loading") ?
              <div className="row mt-3">
                <div className="col-3"></div>
                <button
                  type="button"
                  className="btn btn-secondary col-6"
                  style={{ backgroundColor: "#F45197" }}
                  onClick={() => this.closePopupMaxFriendsDetail()}>ปิด</button>
                <div className="col-3"></div>
              </div>
              :
              <div />
          }
        </div>
      </div>
    )
  }

  openPopupMaxFriendsDetail() {
    document.getElementById("popupMaxFriendsDetail").classList.toggle("active");
    document.getElementById("overlayPopupMaxFriendsDetail").classList.toggle("active");
  }

  closePopupMaxFriendsDetail() {
    document.getElementById("popupMaxFriendsDetail").classList.toggle("active");
    document.getElementById("overlayPopupMaxFriendsDetail").classList.toggle("active");
  }

  renderPopupFriendRequest() {
    return (
      <div>
        <div
          className="overlayContainerPopupFriendRequest"
          id="overlayPopupFriendRequest"
          onClick={() => this.closePopupFriendRequest()}
        />
        <div className="popupFriendRequest" id="popupFriendRequest">
          <div
            className="close-btn"
            onClick={() => this.closePopupFriendRequest()}
          >
            &times;
          </div>
          <br></br>
          <h5 style={{ color: "#F45197", textAlign: "center" }}><b>คำขอเป็นเพื่อน</b></h5>
          <br></br>
          <h6><b>{this.props.friend_request && this.props.friend_request[0] && this.props.friend_request[0].email}</b> ต้องการเป็นเพื่อนกับคุณ</h6>
          <br></br>
          {
            ((this.props.statusAcceptFriend !== "loading" && this.props.statusRejectFriend !== "loading")) &&
            <div className="row mt-3">
              <div className="col-1"></div>
              <button
                type="button"
                className="btn btn-secondary col-4"
                style={{ backgroundColor: "white", color: "#F45197", borderColor: "#F45197" }}
                onClick={() => this.props.rejectFriend(this.props.friend_request && this.props.friend_request[0] && this.props.friend_request[0].log_id)}
              >
                ปฎิเสธ
              </button>
              <div className="col-2"></div>
              <button
                type="button"
                className="btn btn-secondary col-4"
                style={{ backgroundColor: "#F45197", borderColor: "#F45197" }}
                onClick={() => this.props.acceptFriend((this.props.user && this.props.user.user_id), (this.props.friend_request && this.props.friend_request[0] && this.props.friend_request[0].sender_id), (this.props.friend_request && this.props.friend_request[0] && this.props.friend_request[0].log_id))}
              >
                ยอมรับ
              </button>
              <div className="col-1"></div>
            </div>
          }
        </div>
      </div>
    )
  }

  openPopupFriendRequest() {
    document.getElementById("popupFriendRequest").classList.toggle("active");
    document.getElementById("overlayPopupFriendRequest").classList.toggle("active");
  }

  closePopupFriendRequest() {
    document.getElementById("popupFriendRequest").classList.toggle("active");
    document.getElementById("overlayPopupFriendRequest").classList.toggle("active");
  }

  renderPopupDeleteFriend() {
    return (
      <div>
        <div
          className="overlayContainerPopupDeleteFriend"
          id="overlayPopupDeleteFriend"
          onClick={() => this.closePopupDeleteFriend()}
        />
        <div className="popupDeleteFriend" id="popupDeleteFriend">
          <div
            className="close-btn"
            onClick={() => this.closePopupDeleteFriend()}
          >
            &times;
          </div>
          <br></br>
          <h5 style={{ color: "#F45197", textAlign: "center" }}><b>ยืนยันการลบเพื่อน</b></h5>
          <br></br>
          <h6 style={{ textAlign: "center" }}>คุณต้องการลบ <b>{this.props.friend_request && this.props.friend_request[0] && this.props.friend_request[0].email}</b></h6>
          <h6 style={{ textAlign: "center" }}>ออกจากรายชื่อเพื่อนหรือไม่</h6>
          <br></br>
          {
            (this.props.statusDeleteFriend !== "loading") &&
            <div className="row mt-3">
              <div className="col-1"></div>
              <button
                type="button"
                className="btn btn-secondary col-4"
                style={{ backgroundColor: "white", color: "#F45197", borderColor: "#F45197" }}
                onClick={() => this.closePopupDeleteFriend()}
              >
                ยกเลิก
              </button>
              <div className="col-2"></div>
              <button
                type="button"
                className="btn btn-secondary col-4"
                style={{ backgroundColor: "#F45197", borderColor: "#F45197" }}
                onClick={() => this.props.deleteFriend((this.props.user && this.props.user.user_id), (this.state.emailDeleteFriend))}
              >
                ลบเพื่อน
              </button>
              <div className="col-1"></div>
            </div>
          }
        </div>
      </div>
    )
  }

  openPopupDeleteFriend() {
    document.getElementById("popupDeleteFriend").classList.toggle("active");
    document.getElementById("overlayPopupDeleteFriend").classList.toggle("active");
  }

  closePopupDeleteFriend() {
    document.getElementById("popupDeleteFriend").classList.toggle("active");
    document.getElementById("overlayPopupDeleteFriend").classList.toggle("active");
  }

  onDeleteFriendModal(friend_email) {
    this.setState({
      emailDeleteFriend: friend_email
    })
    this.openPopupDeleteFriend();
  }

  renderFriendList() {
    const { friend_list, max_friends, user, statusSendFriendRequest } = this.props;
    const { emailAddFriend } = this.state;
    return (
      <div className="row">
        {this.renderPopupDeleteFriend()}
        {this.renderPopupMaxFriendsDetail()}
        {
          this.state.selectedAddFriend ?
            <div className="card shadow col-lg-7 col-md-12" style={{ borderRadius: "25px" }}>
              <div className="card-body">
                <div className="row mt-4 justify-content-center">
                  <div className="col-lg-12 "  >
                    <h5 className="" style={{ textAlign: "center" }}> <img src={`../assets/img/challenges/vectorinvite.png`} />&nbsp; ขอเป็นเพื่อน</h5>
                  </div>
                  <div className="col-lg-6">
                    <input
                      type=""
                      className="form-control"
                      placeholder="อีเมล"
                      id="emailAddFriend"
                      value={this.state.emailAddFriend}
                      onChange={(event) => this.handleChange(event)}
                    />
                    {
                      (statusSendFriendRequest === "fail") &&
                      <h6 style={{ color: "red" }}>ไม่พบผู้ใช้ที่ต้้องการเพิ่มเพื่อนอยู่ในระบบ</h6>
                    }
                    <button
                      type="button"
                      class="btn btn-danger mt-4 mb-4 col-12"
                      style={{ backgroundColor: "#F45197" }}
                      onClick={() => this.props.sendFriendRequest(user.user_id, emailAddFriend)}
                    >
                      ส่งคำขอ
                    </button>
                  </div>
                </div>
                <br></br>
              </div>
            </div>
            :
            <div className="card shadow col-lg-7 col-md-12" style={{ borderRadius: "25px" }}>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12">
                    <h5 className="card-title"><b style={{ color: "#F45197" }}>รายชื่อเพื่อน</b> <span style={{ float: "right" }}>เพื่อน {friend_list && friend_list.length}/{max_friends} คน</span></h5>
                  </div>
                  <div className="col-lg-10">
                    {
                      (friend_list && friend_list.length > 0) &&
                      friend_list.map((item, index) =>
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
                                } <img className="ml-4" style={{ cursor: "pointer" }} src={`../assets/img/challenges/icon_x.png`} onClick={() => this.onDeleteFriendModal(item.email)} />
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
                <div className="row justify-content-between">
                  <h5
                    className="underline-on-hover"
                    style={{ cursor: "pointer", color: "#F45197" }}
                    onClick={() => this.openPopupMaxFriendsDetail()}>วิธีการเพิ่มจำนวนเพื่อน</h5>
                  {
                    (friend_list.length < max_friends) &&
                    <h5
                      className="underline-on-hover"
                      style={{ cursor: "pointer", color: "#F45197" }}
                      onClick={() => this.setState({ selectedAddFriend: true })}>+ เพิ่มเพื่อน</h5>
                  }
                </div>
              </div>
            </div>
        }
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
                    onClick={() => this.setState({ selectedNavLink: "teamList", selectedTeamInvite: false })}
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
                  <a
                    className="nav-link"
                    style={{ color: `${selectedNavLink === "friendList" ? "#F45197" : ""}`, cursor: "pointer" }}
                    onClick={() => this.setState({ selectedNavLink: "friendList", selectedAddFriend: false })}
                  >
                    <b>รายชื่อเพื่อน</b>
                  </a>
                </nav>
                {(selectedNavLink === "mission") && this.renderMission()}
                {(selectedNavLink === "teamList") && this.renderTeamList()}
                {(selectedNavLink === "scoreBoard") && this.renderScoreBoard()}
                {(selectedNavLink === "friendList") && this.renderFriendList()}
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
          {/*  <h5 style={{ color: "#F45197" }}><b>• ระยะเวลาชาเลนจ์</b></h5>
          <h6>เริ่มตั้งแต่วันที่ 4 ตุลาคม 2561 สิ้นสุดวันที่ 28 พฤศจิกายน 2561</h6> */}
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
        {this.renderPopupFriendRequest()}
        {this.renderPopupTeamInvite()}
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
  const { rank, logWeightCount, isReducedWeight, logWeightTeamCount, numberOfMembers, dailyTeamWeightBonusCount, numberOfTeamNotFull, statusGetNumberOfTeamNotFull, statusLeaveTeam, membersOfTeam, group_name, totalScoreOfTeam, teamRank, individualRank, statusCreateTeam, challengePeriod, friend_list, statusGetFriendList, max_friends, statusGetMaxFriends, statusSendFriendRequest, friend_request, statusGetFriendRequest, statusAcceptFriend, statusRejectFriend, statusDeleteFriend, friendsRank, statusGetFriendsRank, statusSendTeamInvite, statusGetTeamInvite, team_invite, statusAcceptTeamInvite, statusRejectTeamInvite } = challenges;
  return { user, rank, logWeightCount, exerciseVideo, statusVideoList, isReducedWeight, logWeightTeamCount, numberOfMembers, dailyTeamWeightBonusCount, numberOfTeamNotFull, statusGetNumberOfTeamNotFull, statusLeaveTeam, membersOfTeam, group_name, totalScoreOfTeam, teamRank, individualRank, statusCreateTeam, challengePeriod, friend_list, statusGetFriendList, max_friends, statusGetMaxFriends, statusSendFriendRequest, friend_request, statusGetFriendRequest, statusAcceptFriend, statusRejectFriend, statusDeleteFriend, friendsRank, statusGetFriendsRank, statusSendTeamInvite, statusGetTeamInvite, team_invite, statusAcceptTeamInvite, statusRejectTeamInvite };
};

const mapActionsToProps = { getRank, getLogWeight, getIsReducedWeight, getLogWeightTeam, getDailyTeamWeightBonus, getNumberOfTeamNotFull, assignGroupToMember, getGroupID, clearChallenges, createChallengeGroup, leaveTeam, getMembersAndRank, getGroupName, getScoreOfTeam, getLeaderboard, getChallengePeriod, getFriendList, getMaxFriends, checkUpdateMaxFriends, sendFriendRequest, getFriendRequest, acceptFriend, rejectFriend, deleteFriend, getFriendsRank, sendTeamInvite, getTeamInvite, acceptTeamInvite, rejectTeamInvite };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Challenges);