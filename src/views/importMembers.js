import React, { Component } from "react";
import { connect } from "react-redux";
import { importMembers, changeEmail } from "../redux/auth";
import { selectProgramInWeek, deleteProgramInWeek, selectMemberInfo } from "../redux/exerciseVideos";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./importMembers.scss";


class ImportMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      selectedStartDate: null,
      selectedExpireDate: null,
      selectedFile: null,
      statusSubmitImportMembers: "default",
      statusSubmitAddMember: "default",
      email: "",
      new_email: "",
      statusChangeEmail: "default",
      fullname: "",
      phone: "",
      fb_group: 404
    };
    this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
  }

  componentDidMount() {
    const { user } = this.props;
    if (user) { // เช็คว่า login ยัง
      if (user !== null && user.password !== null && user.authorization !== "admin") { // ต้องเป็น admin เท่านั้นถึงจะเข้าหน้า import-members ได้
        this.props.history.push('/login');
      }
    } else {
      this.props.history.push('/login');
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  fileSelectedHandler = event => {
    var { members } = this.state;
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
          for (var i = 1; i <= data.length - 1; i++) { // i = 1 เพราะว่า rowที่0 เป็นหัวcolumn
            var member = { email: "", first_name: "", last_name: "", phone: "", fb_group: 404 }; // fb_group = 404 คือ Admin ไม่ใส่ fb_group ตอน Import
            member.email = (data[i][0]) ? (data[i][0].trim()).split(" ").join("") : "";
            const full_name = (data[i][1]) ? (data[i][1].trim()).split(" ") : "";
            member.first_name = full_name[0] ? full_name[0] : "";
            member.last_name = full_name[full_name.length - 1] ? full_name[full_name.length - 1] : "";
            if (member.first_name === member.last_name) { member.last_name = "" }; //เช็คสำหรับ กรณีกรอกมาแค่ชื่อ
            member.phone = (data[i][2]) ? data[i][2] : "";
            member.fb_group = (data[i][3]) ? data[i][3] : 404; // fb_group = 404 คือ Admin ไม่ใส่ fb_group ตอน Import
            members.push(member);
            console.log(`members ${i} : `, members);
          }
          console.log("members ALL :", members);
        }
      });
      this.setState({
        selectedFile: document.getElementById('upload-csv').files[0]
      })
    }
  }

  onSubmitImportMembers() {
    const { members, selectedStartDate, selectedExpireDate, selectedFile } = this.state;
    const start_date = this.formatDate(selectedStartDate) + " 00:00:00"; // Ex. "2021-02-19 00:00:00"
    const expire_date = this.formatDate(selectedExpireDate) + " 23:59:59"; // Ex. "2021-04-30 23:59:59"
    this.setState({
      statusSubmitImportMembers: "default"
    })

    if (selectedFile !== null && selectedStartDate !== null && selectedExpireDate !== null) {
      this.props.importMembers(members, start_date, expire_date);
      document.getElementById("popupSuccessSubmit").classList.toggle("active");
      document.getElementById("overlayPopupSuccessSubmit").classList.toggle("active");
      var delayInMilliseconds = 1750; //1.75 second
      setTimeout(() => { // เด้ง Popup SucccessSubmit 1.75 วินาที แล้วปิดเอง 
        this.closePopupSuccessSubmit();
      }, delayInMilliseconds);
    } else {
      this.setState({
        statusSubmitImportMembers: "fail"
      })
    }

  }

  onSubmitAddMember() {
    const { selectedStartDate, selectedExpireDate, email, fullname, phone, fb_group } = this.state;
    const start_date = this.formatDate(selectedStartDate) + " 00:00:00"; // Ex. "2021-02-19 00:00:00"
    const expire_date = this.formatDate(selectedExpireDate) + " 23:59:59"; // Ex. "2021-04-30 23:59:59"
    this.setState({
      statusSubmitAddMember: "default"
    })
    const full_name = (fullname) ? (fullname.trim()).split(" ") : "";
    const first_name = full_name[0] ? full_name[0] : "";
    const last_name = full_name[full_name.length - 1] ? full_name[full_name.length - 1] : "";
    const members = [{ email: email, first_name: first_name, last_name: last_name, phone: phone, fb_group: fb_group }];

    if (email && fullname && phone && fb_group && selectedStartDate !== null && selectedExpireDate !== null) {
      console.log("members : ", members);
      console.log("start_date : ", start_date);
      console.log("expire_date : ", expire_date);
      this.props.importMembers(members, start_date, expire_date);
      document.getElementById("popupSuccessSubmit").classList.toggle("active");
      document.getElementById("overlayPopupSuccessSubmit").classList.toggle("active");
      var delayInMilliseconds = 1750; //1.75 second
      setTimeout(() => { // เด้ง Popup SucccessSubmit 1.75 วินาที แล้วปิดเอง 
        this.closePopupSuccessSubmit();
      }, delayInMilliseconds);
    } else {
      this.setState({
        statusSubmitAddMember: "fail"
      })
    }
  }

  deleteProgramInWeek(email) {
    this.props.deleteProgramInWeek(email);
    document.getElementById("popupSuccessSubmit").classList.toggle("active");
    document.getElementById("overlayPopupSuccessSubmit").classList.toggle("active");
    var delayInMilliseconds = 1750; //1.75 second
    setTimeout(() => { // เด้ง Popup SucccessSubmit 1.75 วินาที แล้วปิดเอง 
      this.props.selectProgramInWeek(email);
      this.closePopupSuccessSubmit();
    }, delayInMilliseconds);
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

  closePopupSuccessSubmit() {
    document.getElementById("popupSuccessSubmit").classList.toggle("active");
    document.getElementById("overlayPopupSuccessSubmit").classList.toggle("active");
  }

  renderPopupSuccessSubmit() {
    return (
      <div>
        <div className="overlayContainerPopupSuccessSubmit" id="overlayPopupSuccessSubmit" ></div>
        <div className="popupSuccessSubmit" id="popupSuccessSubmit" style={{ marginTop: "10%" }}>
          <center><h2 style={{ color: "green" }}><i className="fa fa-check fa-lg" > Success</i></h2></center>
        </div>
      </div>
    )
  }

  changeEmail(email, new_email) {
    this.props.changeEmail(email, new_email);
    var delayInMilliseconds = 1300; //1.3 second
    setTimeout(() => { // หน่วงเวลา แล้วค่อย setState 
      this.setState({
        statusChangeEmail: this.props.statusChangeEmail
      })
    }, delayInMilliseconds);
  }

  renderChangeEmail() {
    return (
      <div className="row">
        {this.renderPopupSuccessSubmit()}
        <h1>.</h1>
        <div className="card mt-5 mb-3 col-lg-12">
          <div className="card-body">

            <h1 className="mb-5">เปลี่ยนอีเมล</h1>
            <label for="fname">Email: </label>
            <input type="text" id="email" name="email" value={this.state.email} onChange={(event) => this.handleChange(event)} />
            <br></br>
            {
              (this.state.statusChangeEmail === "email_incorrect") &&
              <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "red" }}>อีเมลไม่ถูกต้อง</h6></small>
            }
            <label for="fname">New Email: </label>
            <input type="text" id="new_email" name="new_email" value={this.state.new_email} onChange={(event) => this.handleChange(event)} />
            {
              (this.state.statusChangeEmail === "email_exist") &&
              <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "red" }}>อีเมลนี้มีในระบบอยู่แล้ว</h6></small>
            }
            {
              (this.state.statusChangeEmail === "success") &&
              <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "green" }}>Success</h6></small>
            }
            <br></br>
            <button type="button" onClick={() => this.changeEmail(this.state.email, this.state.new_email)}>ยืนยัน</button>
          </div>
        </div>
      </div>
    )
  }

  renderMemberInfo() {
    return (
      <div className="row">
        {this.renderPopupSuccessSubmit()}
        <h1>.</h1>
        <div className="card mt-5 mb-3 col-lg-12">
          <div className="card-body">

            <h1 className="mb-5">ข้อมูลผู้ใช้</h1>
            <label for="fname">Email: </label>
            <input type="text" id="email" name="email" value={this.state.email} onChange={(event) => this.handleChange(event)} />
            <button type="button" onClick={() => this.props.selectMemberInfo(this.state.email)}>ค้นหา</button>
            <br></br>
            <h5>{"Email : " + this.props.memberInfo.email}</h5>
            <h5>{"Firstname : " + this.props.memberInfo.first_name}</h5>
            <h5>{"Lastname : " + this.props.memberInfo.last_name}</h5>
            <h5>{"Phone : " + this.props.memberInfo.phone}</h5>
            <h5>{"FB Group : " + this.props.memberInfo.fb_group}</h5>
            <h5>{"Facebook : " + this.props.memberInfo.facebook}</h5>
            <h5>
              {
                "Info : "
                + " อายุ: " + JSON.parse(this.props.memberInfo.other_attributes).age + ","
                + " เพศ: " + JSON.parse(this.props.memberInfo.other_attributes).sex + ","
              }
            </h5>
            <h5>
              {
                "Body Info : "
                + " น้ำหนัก: " + JSON.parse(this.props.memberInfo.other_attributes).weight + ","
                + " ส่วนสูง: " + JSON.parse(this.props.memberInfo.other_attributes).height + ","
                + " อก: " + JSON.parse(this.props.memberInfo.other_attributes).chest + ","
                + " เอว: " + JSON.parse(this.props.memberInfo.other_attributes).waist + ","
                + " สะโพก: " + JSON.parse(this.props.memberInfo.other_attributes).hip + ","
              }
            </h5>
            <h5>{"วันเริ่มต้น : " + this.props.memberInfo.start_date}</h5>
            <h5>{"วันสิ้นสุด : " + this.props.memberInfo.expire_date}</h5>
          </div>
        </div>
      </div>
    )
  }

  renderDeleteProgramInWeek() {
    return (
      <div className="row">
        {this.renderPopupSuccessSubmit()}
        <h1>.</h1>
        <div className="card mt-5 mb-3 col-lg-12">
          <div className="card-body">

            <h1 className="mb-5">Program In Week</h1>
            <label for="fname">Email: </label>
            <input type="text" id="email" name="email" value={this.state.email} onChange={(event) => this.handleChange(event)} />
            <button type="button" onClick={() => this.props.selectProgramInWeek(this.state.email)}>ค้นหา</button>
            <br></br>
            <textarea id="w3review" name="w3review" rows="10" cols="100"
              value={this.props.programInWeek}>
            </textarea>
            <button type="button" onClick={() => this.deleteProgramInWeek(this.state.email)}>ลบ</button>
          </div>
        </div>
      </div>
    )
  }

  renderAddMember() {
    const { selectedStartDate, selectedExpireDate, statusSubmitAddMember } = this.state;
    return (
      <div className="row">
        {this.renderPopupSuccessSubmit()}
        <h1>.</h1>
        <div className="card mt-5 mb-3 col-lg-12">
          <div className="card-body">

            <h1 className="mb-5">เพิ่มสมาชิก</h1>
            <label for="fname">Email: </label>
            <input type="text" id="email" name="email" value={this.state.email} onChange={(event) => this.handleChange(event)} /><br></br>
            <label for="fname">Fullname: </label>
            <input type="text" id="fullname" name="fullname" value={this.state.fullname} onChange={(event) => this.handleChange(event)} /><br></br>
            <label for="fname">Phone: </label>
            <input type="text" id="phone" name="phone" value={this.state.phone} onChange={(event) => this.handleChange(event)} /><br></br>
            <label for="fname">fb_group: </label>
            <input type="text" id="fb_group" name="fb_group" value={this.state.fb_group} onChange={(event) => this.handleChange(event)} /><br></br>
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
          {
            (statusSubmitAddMember === "fail") &&
            <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "red" }}>**กรุณากรอกข้อมูลให้ครบถ้วน</h6></small>
          }
        </div>


        <button
          type="button"
          className="btn btn-danger ml-auto col-lg-1 col-md-6 "
          onClick={() => this.setState({
            members: [],
            selectedStartDate: null,
            selectedExpireDate: null,
            statusSubmitImportMembers: "default",
            statusSubmitAddMember: "default",
            email: "",
            fullname: "",
            phone: "",
            fb_group: 404
          })}
        >
          ยกเลิก
        </button>
        <button
          type="button"
          className="btn btn-success col-lg-1 col-md-6 "
          onClick={() => this.onSubmitAddMember()}
        >
          ยืนยัน
        </button>
      </div>
    )
  }

  renderImportMembers() {
    const { selectedStartDate, selectedExpireDate, statusSubmitImportMembers } = this.state;
    return (
      <div className="row">
        {this.renderPopupSuccessSubmit()}
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
                    className=""
                    onClick={() => this.fileInput.click()}
                    style={{ background: "#333333", color: "white" }}
                  >
                    อัปโหลด
              </button>
                </div>
                <input
                  type="text"
                  className="form-control "
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
          {
            (statusSubmitImportMembers === "fail") &&
            <small id="emailHelp" className="form-text text-muted mb-3"><h6 style={{ color: "red" }}>**กรุณากรอกข้อมูลให้ครบถ้วน</h6></small>
          }
        </div>


        <button
          type="button"
          className="btn btn-danger ml-auto col-lg-1 col-md-6 "
          onClick={() => this.setState({
            members: [],
            selectedStartDate: null,
            selectedExpireDate: null
          })}
        >
          ยกเลิก
        </button>
        <button
          type="button"
          className="btn btn-success col-lg-1 col-md-6 "
          onClick={() => this.onSubmitImportMembers()}
        >
          ยืนยัน
        </button>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderImportMembers()}
        {this.renderAddMember()}
        {this.renderDeleteProgramInWeek()}
        {this.renderChangeEmail()}
        {this.renderMemberInfo()}
      </div>
    )
  }
}

const mapStateToProps = ({ authUser, exerciseVideos }) => {
  const { user, status, statusChangeEmail } = authUser;
  const { programInWeek, memberInfo } = exerciseVideos;
  return { user, status, programInWeek, memberInfo, statusChangeEmail };
};

const mapActionsToProps = { importMembers, selectProgramInWeek, deleteProgramInWeek, changeEmail, selectMemberInfo };

export default connect(
  mapStateToProps,
  mapActionsToProps
)(ImportMembers);