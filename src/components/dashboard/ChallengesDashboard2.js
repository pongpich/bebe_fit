import React, { Component } from "react";
import './ChallengesDashboard2.css';


import {
  CardTitle,
  Form,
  Label,
  Input,
  Button,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import { connect } from "react-redux";

import { getGamification, clearGamification, getChallengeEvent,getMembersEachWeekInSeason } from "../../redux/dashboard";

class ChallengesDashboard2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      season: "ตลอดทั้ง season",
      dropdownOpen: false
    };
  }

  componentDidMount() {
    const { season } = this.state;
    const { percentOfMembersEachWeek } = this.state;
    this.props.clearGamification();
    this.props.getChallengeEvent();
    this.props.getMembersEachWeekInSeason();
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
      percentCompleteOfWeightResult,percentOfMembersEachWeek,
    } = this.props;
    const myStyle = {
      width: { percentCompleteOfWeightResult }
    };


    
    console.log("percentOfMembersEachWeek",percentOfMembersEachWeek);

    return (
      <div className="background">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="box-background">
              <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col" className="text-center"></th>
                        <th scope="col" className="text-centerColor">สัปดาห์ที่ 1</th>
                        <th scope="col" className="text-centerColor">สัปดาห์ที่ 2</th>
                        <th scope="col" className="text-centerColor">สัปดาห์ที่ 3</th>
                        <th scope="col" className="text-centerColor">สัปดาห์ที่ 4</th>
                        <th scope="col" className="text-centerColor">สัปดาห์ที่ 5</th>
                        <th scope="col" className="text-centerColor">สัปดาห์ที่ 6</th>
                        <th scope="col" className="text-centerColor">สัปดาห์ที่ 7</th>
                        <th scope="col" className="text-centerColor">สัปดาห์ที่ 8</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row" className="text-centerColor">SEASON 1</th>
                        <td className="text-center">
                          <div className="spinner-border text-primary2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
                      </tr>
                      <tr>
                        <th scope="row" className="text-centerColor">SEASON 2</th>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
                      </tr>
                      <tr>
                        <th scope="row" className="text-centerColor">SEASON 3</th>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
                        <td>0.00 %</td>
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
    challengeEvent,
    percentOfMembersEachWeek
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
    challengeEvent,
    percentOfMembersEachWeek
  };
};

const mapActionsToProps = { getGamification, clearGamification, getChallengeEvent, getMembersEachWeekInSeason };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(ChallengesDashboard2);