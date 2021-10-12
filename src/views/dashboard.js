import React, { Component } from "react";
import {
  CardTitle,
  Form,
  Label,
  Input,
  Button
} from "reactstrap";
import { connect } from "react-redux";

import { getGamification, clearGamification } from "../redux/dashboard";
//import "./login.scss";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      season: "season 2"
    };
  }

  componentDidMount() {
    const { season } = this.state;
    this.props.clearGamification();
    this.props.getGamification(season);
  }

  componentDidUpdate(prevProps) {

  }


  render() {
    const { season } = this.state;
    const {
      percentCompleteOfWeightResult,
      percentCompleteOfExerciseComplete,
      percentCompleteOfWeightBonusResult,
      percentCompleteOfWeightTeamComplete,
      percentCompleteOfReducedWeight,
      numberOfMembersInSeason,
      numberOfMembersInEndSeason,
      numberOfMembersNotInGamification
    } = this.props;
    return (
      <div>
        <h1>{season}</h1>
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
    numberOfMembersNotInGamification
  } = dashboard;
  return {
    percentCompleteOfWeightResult,
    percentCompleteOfExerciseComplete,
    percentCompleteOfWeightBonusResult,
    percentCompleteOfWeightTeamComplete,
    percentCompleteOfReducedWeight,
    numberOfMembersInSeason,
    numberOfMembersInEndSeason,
    numberOfMembersNotInGamification
  };
};

const mapActionsToProps = { getGamification, clearGamification };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Dashboard);
