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

import { getWorstClipInSeason } from "../../redux/dashboard";

class ChallengesDashboard3 extends Component {


  componentDidMount() {
   this.props.getWorstClipInSeason();

  }

 




  render() {
    const {
      worstClipInSeason
    } = this.props;


    return (
      <div className="background">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="box-background">
                <br />
                <h5  className="text-center">คลิปที่คนสามารถลดน้ำหนักได้มากที่สุด</h5>
                <br/>
              <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col" className="text-center"></th>
                        <th scope="col " className="text-centerColor" >อก</th>
                        <th scope="col " className="text-centerColor" >หลัง</th>
                        <th scope="col " className="text-centerColor" >แขน</th>
                        <th scope="col " className="text-centerColor" >ขา</th>
                        <th scope="col " className="text-centerColor" >Cadio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                          worstClipInSeason  && worstClipInSeason.map((key) => {
                            return   <tr>
                                      <th scope="row" className="text-center">{key.event_name}</th>
                                      <td>{key.chest_focus}</td>
                                      <td>{key.back_focus}</td>
                                      <td>{key.arm_focus}</td>
                                      <td>{key.leg_focus}</td>
                                      <td>{key.cardio}</td>
                                    </tr>
                         }) 
                      }
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
    worstClipInSeason
  } = dashboard;
  return {
    worstClipInSeason
  };
};

const mapActionsToProps = { getWorstClipInSeason};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(ChallengesDashboard3);