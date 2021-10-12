import React, { Component } from "react";
import {
  CardTitle,
  Form,
  Label,
  Input,
  Button
} from "reactstrap";
import { connect } from "react-redux";

import { getGamification } from "../redux/dashboard";
//import "./login.scss";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      season: "season 1"
    };
  }

  componentDidMount() {
    const { season } = this.state;
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
        <h1>season : {season}</h1>
        <h1>percentCompleteOfWeightResult : {percentCompleteOfWeightResult}</h1>
        <h1>percentCompleteOfExerciseComplete : {percentCompleteOfExerciseComplete}</h1>
        <h1>percentCompleteOfWeightBonusResult : {percentCompleteOfWeightBonusResult}</h1>
        <h1>percentCompleteOfWeightTeamComplete : {percentCompleteOfWeightTeamComplete}</h1>
        <h1>percentCompleteOfReducedWeight : {percentCompleteOfReducedWeight}</h1>
        <h1>numberOfMembersInSeason : {numberOfMembersInSeason}</h1>
        <h1>numberOfMembersInEndSeason : {numberOfMembersInEndSeason}</h1>
        <h1>numberOfMembersNotInGamification : {numberOfMembersNotInGamification}</h1>
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

const mapActionsToProps = { getGamification };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Dashboard);
