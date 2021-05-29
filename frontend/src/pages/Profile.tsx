import * as React from "react";
import { withAuth } from "../lib/AuthProvider";
import Sidebar from "../components/Sidebar";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import axios from "axios";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { ContactlessOutlined } from "@material-ui/icons";
// import {useLocation} from "react-router-dom";

interface ProfileProps {
  logout: () => any;
  user: any;
  profile: boolean;
}

class Profile extends React.Component<ProfileProps> {
  state = {
    file: null,
    filename: "No picture",
    mouseEnter: false,
    mouseLeave: true,
    online: true,
    open: false,
    username: "",
    description: "No status",
    status: "Online",
  };

  onChange = (event) => {
    this.setState({ file: event.target.files[0] });
    let u = this.props.user.Username;
    let file = event.target.files[0];

    if (file) {
      let formData = new FormData();
      formData.append("file", file);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      axios
        .post(`http://localhost:8080/upload/${u}`, formData, config)
        .then(() => {
          alert("The file was successfully uploaded");
          this.setState((prevState) => ({ ...prevState, filename: file.name }));

          // this.uploadFile();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  mouseEnter = () => {
    let p = document.getElementById("profile-img");
    let u = document.getElementById("upload-img");
    if (this.state.filename) {
      u.style.display = "block";
      p.style.display = "none";
    }
    this.setState({ mouseEnter: true, mouseLeave: false });
  };

  mouseLeave = () => {
    let p = document.getElementById("profile-img");
    let u = document.getElementById("upload-img");
    if (this.state.filename) {
      u.style.display = "none";
      p.style.display = "block";
    }
    this.setState({ mouseLeave: true, mouseEnter: false });
  };

  deleteAcc = () => {
    let username  = this.props.user.Username
    console.log("deleting account");
    return axios
      .post(`http://localhost:8080/deleteAccount/${username}`)
      .then((res) => {
        console.log(res, "user account deleted");
        this.props.logout()
      })
      .catch((error) => {
        console.log(error);
      });
  };
  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (event) => {
    console.log(event)
    this.setState({ [event.target.name]: event.target.value });
  };

  handleFormSubmit = (event: any) => {
    event.preventDefault();
    const { username, description, status } = this.state;
    this.handleClose();
    console.log("Signup -> form submit", { username, description, status });
    return axios
      .post(`http://localhost:8080/updateUser/${username}/${description}/${status}`)
      .then((res) => {
        console.log(res, "user updated");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount = async () => {
    let username = this.props.user.Username;
    // let u = document.getElementById('upload-img')
    // u.style.display= 'none'
   let res = await axios
      .get(`http://localhost:8080/getUser/${username}`) 
   let user = res && res.data[0]
   this.setState({ username: user.username, description: user.description, status: user.status, filename: user.profileimg });
  };

  render() {
    let username = this.props.user.Username;
    return (
      <div>
        <Sidebar profile={true} logout={this.props.logout} />
       <div style={{height:"100vh"}}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "65.5vh",
            backgroundColor: "#f7f7f7",
            justifyContent:"center",
            marginTop:"1em",
            paddingBottom:"1.5em"
          }}
        >
          <Avatar
            style={{
              padding: "6em",
              margin: "0.5em 0em 0.5em 0em",
              backgroundColor: "#212121",
            }}
            alt="Remy Sharp"
          >
            <form onMouseLeave={this.mouseLeave} onMouseEnter={this.mouseEnter}>
              <React.Fragment>
                <label id="profile-img" htmlFor="pp-input" className="hidden">
                  {this.state.filename &&
                  this.state.filename !== "No picture" ? (
                    <img
                      style={{ width: "20vw" }}
                      src={`./files/${this.state.filename}`}
                    />
                  ) : this.state.filename &&
                    this.state.filename === "No picture" ? (
                    <p>loading</p>
                  ) : (
                    <p>Upload an image</p>
                  )}
                </label>
                <label
                  id="upload-img"
                  htmlFor="pp-input"
                  style={{ cursor: "pointer", display: "none" }}
                >
                  <span>Upload profile picture</span>
                </label>

                <input
                  id="pp-input"
                  type="file"
                  onChange={this.onChange}
                  style={{ display: "none" }}
                />
              </React.Fragment>
            </form>
          </Avatar>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {this.state.status === "Online" && this.props.user.Authenticated ? (
              <FiberManualRecordIcon style={{color: "lightgreen", margin:"0.2em auto"}} />
              // <p style={{ fontSize:"1.2em", margin: "0", color: "lightgreen" }}>Online</p>
            ) : this.state.status === "Offline" && this.props.user.Authenticated ? (
              <p style={{ fontSize:"1.2em", margin: "0", color: "red" }}>Offline</p>
            ) : <p style={{ fontSize:"1.2em", margin: "0", color: "yellow" }}>Away</p>}
            <h1 style={{ margin: "0.1em 0 0.3em 0" }}>{username}</h1>
            {this.state.description ? (
              <p style={{ fontSize:"1.2em", margin: "0", color:"rgb(69,18,66)" }}> {this.state.description}</p>
            ) : (
              <p style={{ fontSize:"1.2em", margin: "0", color: "red" }}>loading...</p>
            )}
          </div>
        </div>
        <div style={{ 
          backgroundColor: "lightgrey",
          bottom: "0",
          position: "fixed",
          width: "100%",
          minHeight: "25vh"
        }}>
          <button
            onClick={this.handleOpen}
            style={{
              padding: "1.2em 2.8em",
              margin: "2.4em 2em 1.7em 2em",
              backgroundColor: "#666DA3",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
          >
            Settings
          </button>
          <Modal
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className="paper" style={{padding:"4em 5em 4em 5em", backgroundColor:"#f7f7f7", borderRadius:"5px"}}>
              <h2 id="simple-modal-title" style={{marginTop:"0em", color:"#666DA3"}}>SETTINGS</h2>
              <br/>
              <form style={{display:"flex", flexDirection:"column", justifyContent:"center", textAlign:"left", alignItems: "center"}} onSubmit={this.handleFormSubmit}>
                <label style={{paddingBottom:"0.6em", fontSize:"1.2em"}}>USERNAME</label>
                <p>{this.state.username}</p>
                {/* <label>Username: </label>
                <input
                  name="username"
                  value={this.state.username}
                  type="text"
                  placeholder={username}
                  onChange={this.handleChange}
                />
                <br /> */}
                <hr />
                <label style={{paddingBottom:"0.6em", fontSize:"1.2em"}}>YOUR STATUS </label>
                <textarea
                  name="description"
                  value={this.state.description}
                  onChange={this.handleChange}
                  placeholder={
                    "Duis mollis, est non commodo luctus, nisi erat porttitor ligula."
                  }
                  style={{backgroundColor:"transparent", borderRadius:"5px", textAlign:"center"}}
                />
                <br />
                <hr/>
                <React.Fragment>
                <label style={{paddingBottom:"0.6em", fontSize:"1.2em"}}>AVAILABILITY </label>
                <select
                  name="status"
                  value={this.state.status}
                  onChange={this.handleChange}
                  style={{border:"none"}}
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Away">Away</option>
                </select>
                </React.Fragment>
                <br />
                <br />
                <button style={{backgroundColor:"#666DA3", color:"white", textAlign:"center", width:"50%", border:"none", padding:"1em", borderRadius:"25px", cursor:"pointer"}}>Save</button>
              </form>
            </div>
          </Modal>
          <p onClick={this.deleteAcc} style={{ cursor: "pointer" }}>
            Delete account
          </p>
        </div>
      </div>
      </div>
    );
  }
}

export default withAuth(Profile);
