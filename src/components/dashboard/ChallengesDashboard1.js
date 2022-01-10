import React, { Component } from "react";
import './ChallengesDashboard1.css';


import {
  CardTitle,
  Form,
  Label,
  Input,
  Button,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import { connect } from "react-redux";

import { getGamification, clearGamification, getChallengeEvent } from "../../redux/dashboard";

class ChallengesDashboard1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      season: "season",
      dropdownOpen: false
    };
  }

  componentDidMount() {
    const { season } = this.state;
    this.props.clearGamification();
    this.props.getChallengeEvent();
  }

  componentDidUpdate(prevProps) {

  }

  toggle() {
    const { dropdownOpen } = this.state;
    this.setState({ dropdownOpen: !dropdownOpen })
  }

  selectSeason(season) {
    this.props.getGamification(season);
    this.setState({ season: season });
  }

  render() {
    const { season, dropdownOpen } = this.state;
    const {
      percentCompleteOfWeightResult,
      percentCompleteOfExerciseComplete,
      percentCompleteOfWeightBonusResult,
      percentCompleteOfWeightTeamComplete,
      percentCompleteOfReducedWeight,
      numberOfMembersInSeason,
      numberOfMembersInEndSeason,
      numberOfMembersNotInGamification,
      challengeEvent
    } = this.props;
    const myStyle = {
      width: {percentCompleteOfWeightResult}
    };
    
    return (
      <div className="background">
        <Dropdown isOpen={dropdownOpen} toggle={() => this.toggle()}>
          <DropdownToggle style={{ backgroundColor: "white", color: "black" }} caret>{season}</DropdownToggle>
          <DropdownMenu>
            {
              challengeEvent && challengeEvent.map((item, index) => (
                <DropdownItem onClick={() => this.selectSeason(item.event_name)}>{item.event_name}</DropdownItem>
              ))
            }
          </DropdownMenu>
        </Dropdown>
        <div className="box-background">
          <br />
          <p className="text-progress">บันทึกน้ำหนักครบ 2 ครั้ง <span className="text-progressRight"> สำเร็จ {percentCompleteOfWeightResult}% </span></p>
          <div class="progress">
            <div class="progress-bar" role="progressbar" style={{ "width": `${percentCompleteOfWeightResult}%` }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          <br />
          <p className="text-progress">ออกกำลังกายครบ 4 วันต่อสัปดาห์ <span className="text-progressRight"> สำเร็จ {percentCompleteOfExerciseComplete}% </span></p>
          <div class="progress">
            <div class="progress-bar" role="progressbar" style={{ "width": `${percentCompleteOfExerciseComplete}%` }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          <br />
          <p className="text-progress">ทีมชั่งน้ำหนักครบ 7 วัน  <span className="text-progressRight"> สำเร็จ {percentCompleteOfWeightBonusResult}% </span></p>
          <div class="progress">
            <div class="progress-bar" role="progressbar" style={{ "width": `${percentCompleteOfWeightBonusResult}%` }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          <br />
          <p className="text-progress">สมาชิกชั่งครบ 2 ครั้ง <span className="text-progressRight"> สำเร็จ {percentCompleteOfWeightTeamComplete}% </span></p>
          <div class="progress">
            <div class="progress-bar" role="progressbar" style={{ "width": `${percentCompleteOfWeightTeamComplete}%` }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
          <br />
          <p className="text-progress">น้ำหนักลดลงจากสัปดาห์ที่แล้ว <span className="text-progressRight"> สำเร็จ {percentCompleteOfReducedWeight}% </span></p>
          <div class="progress">
            <div class="progress-bar" role="progressbar" style={{ "width": `${percentCompleteOfReducedWeight}%` }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
          </div>npm
        </div>

     {/*    <h1>บันทึกน้ำหนักครบ 2 ครั้ง : {percentCompleteOfWeightResult}%</h1>
        <h1>ออกกำลังกายครบ 4 วันต่อสัปดาห์ : {percentCompleteOfExerciseComplete}%</h1>
        <h1>ทีมชั่งน้ำหนักครบ 7 วัน : {percentCompleteOfWeightBonusResult}%</h1>
        <h1>สมาชิกชั่งครบ 2 ครั้ง : {percentCompleteOfWeightTeamComplete}%</h1>
        <h1>น้ำหนักลดลงจากสัปดาห์ที่แล้ว : {percentCompleteOfReducedWeight}%</h1>
        <h1>จำนวนคนที่เล่น Gamification ใน season นี้ : {numberOfMembersInSeason} คน</h1>
        <h1>จำนวนคนที่อยู่ในทีมจนจบ season : {numberOfMembersInEndSeason} คน</h1>
        <h1>จำนวนคนที่ไม่มีทีมจนจบ season : {numberOfMembersNotInGamification} คน</h1> */}
      </div>
    );
  }
}

const mapStateToProps = ({ dashboard }) => {
  const {
    percentCompleteOfWeightResult,
    percentCompleteOfExerciseComplete,
    percentCompleteOfWeightBonusResult,
    percentCompleteOfWeightTeamComplete,
    percentCompleteOfReducedWeight,
    numberOfMembersInSeason,
    numberOfMembersInEndSeason,
    numberOfMembersNotInGamification,
    challengeEvent
  } = dashboard;
  return {
    percentCompleteOfWeightResult,
    percentCompleteOfExerciseComplete,
    percentCompleteOfWeightBonusResult,
    percentCompleteOfWeightTeamComplete,
    percentCompleteOfReducedWeight,
    numberOfMembersInSeason,
    numberOfMembersInEndSeason,
    numberOfMembersNotInGamification,
    challengeEvent
  };
};

const mapActionsToProps = { getGamification, clearGamification, getChallengeEvent };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(ChallengesDashboard1);