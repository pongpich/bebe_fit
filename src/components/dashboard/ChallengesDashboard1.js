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

import ReactHTMLTableToExcel from 'react-html-table-to-excel';

class ChallengesDashboard1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      season: "ตลอดทั้ง season",
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

  activateLasers() {



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
      numberOfMembersActiveMoreThan1Week,
      challengeEvent
    } = this.props;
    const myStyle = {
      width: { percentCompleteOfWeightResult }
    };


    return (
      <div className="background">
        <div class="container">
          <div class="row">
            <div class="col-md-8">
              <div className="box-background">
                <div className="dropdown">
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
                </div>
                <div className="export-dashboard1" >
                  {/*  <Button style={{ backgroundColor: "white", color: "black" }} onClick={() => this.activateLasers()}>Export .csv  <i class="fas fa-download"></i></Button> */}
                  <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button"
                    table="table-to-xls"
                    filename="tablexls"
                    sheet="tablexls"
                    buttonText="Download as XLS" />
                </div>
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
                </div>
              </div>
              <div class="container">
                <div class="row">
                  <div class="col-md-6">
                    <div className="gamification">
                      <p>จำนวนคนที่เล่น Gamification ใน season นี้</p>
                      <p className="people"> {numberOfMembersInSeason} คน</p>
                    </div>
                  </div>
                  <div class="col-6 col-md-6">
                    <div className="active-season">
                      <p>จำนวนคนที่ Active อยู่ในทีมมากกว่า 1 อาทิตย์</p>
                      <p className="people"> {numberOfMembersActiveMoreThan1Week} คน</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-6 col-md-4">
              <div className="box-number-people">
                <p>จำนวนคนที่อยู่ในทีมจนจบ season</p>
                <p className="people"> {numberOfMembersInEndSeason} คน</p>
                <hr />
                <br />
                <p>จำนวนคนที่ไม่มีทีมจนจบ season</p>
                <p className="people"> {numberOfMembersNotInGamification} คน</p>
              </div>
            </div>
          </div>
        </div>
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
    numberOfMembersActiveMoreThan1Week,
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
    numberOfMembersActiveMoreThan1Week,
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