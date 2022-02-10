import React, { Component } from "react";
import './ChallengesDashboard4.css';


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

class ChallengesDashboard4 extends Component {
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
                <br />
                <h5  className="text-center">คลิปที่คนสามารถลดน้ำหนักได้น้อยที่สุด</h5>
                <br/>
              <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col" className="text-center"></th>
                        <th scope="col " className="text-centerColor" >SEASON 10</th>
                        <th scope="col " className="text-centerColor" >SEASON 9</th>
                        <th scope="col " className="text-centerColor" >SEASON 8</th>
                        <th scope="col " className="text-centerColor" >SEASON 7</th>
                        <th scope="col " className="text-centerColor" >SEASON 6</th>
                        <th scope="col " className="text-centerColor" >SEASON 5</th>
                        <th scope="col " className="text-centerColor" >SEASON 4</th>
                        <th scope="col " className="text-centerColor" >SEASON 3</th>
                        <th scope="col " className="text-centerColor" >SEASON 2</th>
                        <th scope="col " className="text-centerColor" >SEASON 1</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row" className="text-center">อก</th>
                        <td>Chest 02</td>
                        <td>Chest 02</td>
                        <td>Chest 02</td>
                        <td>Chest 02</td>
                        <td>Chest 02</td>
                        <td>Chest 02</td>
                        <td>Chest 02</td>
                        <td>Chest 02</td>
                        <td>Chest 02</td>
                        <td>Chest 02</td>
                      </tr>
                      <tr>
                        <th scope="row" className="text-center">หลัง</th>
                        <td>Back 05</td>
                        <td>Back 05</td>
                        <td>Back 05</td>
                        <td>Back 05</td>
                        <td>Back 05</td>
                        <td>Back 05</td>
                        <td>Back 05</td>
                        <td>Back 05</td>
                        <td>Back 05</td>
                        <td>Back 05</td>
                      </tr>
                      <tr>
                        <th scope="row" className="text-center">แขน</th>
                        <td>Arm 01</td>
                        <td>Arm 01</td>
                        <td>Arm 01</td>
                        <td>Arm 01</td>
                        <td>Arm 01</td>
                        <td>Arm 01</td>
                        <td>Arm 01</td>
                        <td>Arm 01</td>
                        <td>Arm 01</td>
                        <td>Arm 01</td>
                      </tr>
                      <tr>
                        <th scope="row" className="text-center">ขา</th>
                        <td>Leg 04</td>
                        <td>Leg 04</td>
                        <td>Leg 04</td>
                        <td>Leg 04</td>
                        <td>Leg 04</td>
                        <td>Leg 04</td>
                        <td>Leg 04</td>
                        <td>Leg 04</td>
                        <td>Leg 04</td>
                        <td>Leg 04</td>
                      </tr>
                      <tr>
                        <th scope="row" className="text-center">Cadio</th>
                        <td>Cadio 04</td>
                        <td>Cadio 04</td>
                        <td>Cadio 04</td>
                        <td>Cadio 04</td>
                        <td>Cadio 04</td>
                        <td>Cadio 04</td>
                        <td>Cadio 04</td>
                        <td>Cadio 04</td>
                        <td>Cadio 04</td>
                        <td>Cadio 04</td>
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
)(ChallengesDashboard4);