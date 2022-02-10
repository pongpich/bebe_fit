import React, { Component } from "react";
import './ChallengesDashboard5.css';


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

class ChallengesDashboard5 extends Component {
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
      width: { percentCompleteOfWeightResult }
    };

    return (
      <div className="background">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
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
                <br />
              <div className="table-responsive">
                <table className="table">
                    <thead>
                      <tr>
                        <th scope="col" className="text-center">ชื่อ-สกุล <i class='fas fa-angle-down' ></i></th>
                        <th scope="col" className="text-center" >เบอร์โทรศัพท์</th>
                        <th scope="col" className="text-center" >อีเมล</th>
                        <th scope="col" className="text-center" >รอบที่ต่ออายุ <i class='fas fa-angle-down'></i></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row" className="text-center color-primary">บพิตร์ เตชะวัฒนานันท์</th>
                        <td  className="text-center">0812122222</td>
                        <td  className="text-center">vsdfknj@mail.com</td>
                        <td className="text-centerColor">Season 11</td>
                      </tr>
                      <tr>
                        <th scope="row" className="text-center color-primary">อนุพงศ์ อรุณ</th>
                        <td  className="text-center">0812122222</td>
                        <td  className="text-center">vsdfknj@mail.com</td>
                        <td className="text-center">Season 8</td>
                      </tr>
                      <tr>
                        <th scope="row" className="text-center color-primary">ไกำพอ_ภำพะ้เดก</th>
                        <td  className="text-center">0812122222</td>
                        <td  className="text-center">vsdfknj@mail.com</td>
                        <td className="text-centerColor">Season11</td>
                      </tr>
                      <tr>
                        <th scope="row" className="text-center color-primary">บพิตร์ เตชะวัฒนานันท์</th>
                        <td  className="text-center">0812122222</td>
                        <td  className="text-center">vsdfknj@mail.com</td>
                        <td className="text-center">Season 9</td>
                      </tr>
                    </tbody>
                  </table>
                  </div>
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
)(ChallengesDashboard5);