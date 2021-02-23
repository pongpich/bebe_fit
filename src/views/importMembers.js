import React, { Component } from "react";
import { connect } from "react-redux";
import { importMembers } from "../redux/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


class ImportMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emails: [],
      selectedStartDate: null,
      selectedExpireDate: null
    };
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
  }

  componentDidMount() {
    const { user } = this.props;
    if (user) { // ต้องเป็น admin เท่านั้นถึงจะเข้าหน้า import-members ได้
      if (user !== null && user.password !== null && user.authorization !== "admin") {
        this.props.history.push('/platform');
      }
    } else {
      this.props.history.push('/platform');
    }
  }

  fileSelectedHandler = event => {
    var { emails } = this.state;
    const Papa = require('papaparse');
    Papa.parse(document.getElementById('upload-csv').files[0], {
      download: true,
      header: false,
      complete: function (results) {
        var data = results.data;
        console.log("data : ", data);
        for (var i = 1; i <= data.length - 1; i++) { // i = 1 เพราะว่า 0 เป็นหัวcolumn
          emails.push(data[i][0]);
          //console.log(`emails ${i} : `, emails);
        }
        //console.log("emails ALL :", emails);
      }
    });
  }

  onUpload() {
    const { emails, selectedStartDate, selectedExpireDate } = this.state;
    const start_date = this.formatDate(selectedStartDate) + " 00:00:00"; // Ex. "2021-02-19 00:00:00"
    const expire_date = this.formatDate(selectedExpireDate) + " 23:59:59"; // Ex. "2021-04-30 23:59:59"
    this.props.importMembers(emails, start_date, expire_date);
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  render() {
    const { selectedStartDate, selectedExpireDate } = this.state;
    return (
      <div>
        <h1>.</h1>
        <h1>.</h1>
        <h1>.</h1>
        <h1>CSV Emails</h1>
        <input type="file" id="upload-csv" accept=".csv" onChange={this.fileSelectedHandler} />
        <h1>start_date</h1>
        <DatePicker
          dateFormat='yyyy/MM/dd'
          selected={selectedStartDate}
          onChange={date => this.setState({ selectedStartDate: date })}
          isClearable
          showYearDropdown
          showMonthDropdown
          scrollableMonthYearDropdown
        />
        <h1>expire_date</h1>
        <DatePicker
          dateFormat='yyyy/MM/dd'
          selected={selectedExpireDate}
          onChange={date => this.setState({ selectedExpireDate: date })}
          isClearable
          showYearDropdown
          showMonthDropdown
          scrollableMonthYearDropdown
        />
        <h1>.</h1>
        <button onClick={() => this.onUpload()}>UPLOAD</button>
      </div>
    )
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user, status } = authUser;
  return { user, status };
};

const mapActionsToProps = { importMembers };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(ImportMembers);