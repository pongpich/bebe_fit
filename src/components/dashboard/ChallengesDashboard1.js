import React, { Component } from "react";

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
    return (
      <div>
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
        <h1>บันทึกน้ำหนักครบ 2 ครั้ง : {percentCompleteOfWeightResult}%</h1>
        <h1>ออกกำลังกายครบ 4 วันต่อสัปดาห์ : {percentCompleteOfExerciseComplete}%</h1>
        <h1>ทีมชั่งน้ำหนักครบ 7 วัน : {percentCompleteOfWeightBonusResult}%</h1>
        <h1>สมาชิกชั่งครบ 2 ครั้ง : {percentCompleteOfWeightTeamComplete}%</h1>
        <h1>น้ำหนักลดลงจากสัปดาห์ที่แล้ว : {percentCompleteOfReducedWeight}%</h1>
        <h1>จำนวนคนที่เล่น Gamification ใน season นี้ : {numberOfMembersInSeason} คน</h1>
        <h1>จำนวนคนที่อยู่ในทีมจนจบ season : {numberOfMembersInEndSeason} คน</h1>
        <h1>จำนวนคนที่ไม่มีทีมจนจบ season : {numberOfMembersNotInGamification} คน</h1>
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