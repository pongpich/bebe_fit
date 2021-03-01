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
      selectedExpireDate: null,
      selectedFile: null
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

    this.setState({
      selectedFile: null
    })

    if (document.getElementById('upload-csv').files[0]) {
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
      this.setState({
        selectedFile: document.getElementById('upload-csv').files[0]
      })
    }
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
      <div className="row">
        <h1>.</h1>
        <div className="card mt-5 mb-3 col-lg-12">
          <div className="card-body">

            <h1 className="mb-5">เพิ่มสมาชิก</h1>
            <h5>อัปโหลดไฟล์อีเมล
              <span className="h6 ml-3" style={{ color: "red" }}>
                *ไฟล์นามสกุล .csv
              </span>
            </h5>
            <input
              type="file"
              id="upload-csv"
              accept=".csv"
              ref={fileInput => this.fileInput = fileInput}
              onChange={this.fileSelectedHandler}
              style={{ display: "none" }}
            />
            <div className="mb-5 col-lg-9 col-md-12">
              <div className="input-group mb-2">
                <div className="input-group-prepend">
                  <button
                    class=""
                    onClick={() => this.fileInput.click()}
                    style={{ background: "#333333", color: "white" }}
                  >
                    อัปโหลด
              </button>
                </div>
                <input
                  type="text"
                  class="form-control "
                  value={(this.state.selectedFile) ? this.state.selectedFile.name : ""}
                />
              </div>
              {
                ((this.state.statusMaualPayment === "fail") && !(this.state.selectedFile)) &&
                <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "red" }}>กรุณาอัพโหลดหลักฐานการชำระเงิน</h6></small>
              }
            </div>

            <section>
              <div style={{ float: "left" }} className="mr-5">
                <label style={{ display: "block" }} className="h5">วันเริ่มต้น</label>
                <DatePicker
                  style={{ display: "block" }}
                  dateFormat='yyyy/MM/dd'
                  selected={selectedStartDate}
                  onChange={date => this.setState({ selectedStartDate: date })}
                  isClearable
                  showYearDropdown
                  showMonthDropdown
                  scrollableMonthYearDropdown
                />
              </div>
              <div style={{ float: "left" }}>
                <label style={{ display: "block" }} className="h5">วันสิ้นสุด</label>
                <DatePicker
                  style={{ display: "block" }}
                  dateFormat='yyyy/MM/dd'
                  selected={selectedExpireDate}
                  onChange={date => this.setState({ selectedExpireDate: date })}
                  isClearable
                  showYearDropdown
                  showMonthDropdown
                  scrollableMonthYearDropdown
                />
              </div>
            </section>
          </div>
        </div>


        <button
          type="button"
          className="btn btn-danger ml-auto col-lg-1 col-md-6 "
          onClick={() => this.setState({
            emails: [],
            selectedStartDate: null,
            selectedExpireDate: null,
            selectedFile: null
          })}
        >
          ยกเลิก
        </button>
        <button
          type="button"
          className="btn btn-success col-lg-1 col-md-6 "
          onClick={() => this.onUpload()}
        >
          ยืนยัน
        </button>


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