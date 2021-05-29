// App.js
import * as React from "react";
import "../css/App.css";
import ChatHistory from '../components/ChatHistory'
import Sidebar from '../components/Sidebar'
import { RootState } from "../redux/reducers/index"
import { RootAction, actionTypes } from "../redux/actions/chatActions"
import { getUsers, getContacts } from "../redux/actions/userActions"
import { getUser } from "../redux/actions/uActions"
import { connect } from 'react-redux';
import { compose } from 'redux'
import { withAuth } from "../lib/AuthProvider";
import { downloadFile } from "../redux/actions/downloadActions"
import axios from 'axios'
// import { ThunkDispatch } from 'redux-thunk'
// import { Dispatch } from 'redux';
// import { connectSocket, sendMsg } from "../api";
// import { Loader } from "@googlemaps/js-api-loader"

interface ContainerProps {
  addMessage: (newChatHistoryObj: MessageEvent) => object,
  saveMessage: (username, newChatHistoryObj: MessageEvent) => object,
  chatHistory: Array<any>,
  deleteMessages: () => object,
  downloadFile: () => Promise<boolean>,
  logout: () => any;
  getUsers: () => Promise<boolean>,
  getContacts: (username: string) => Promise<boolean>,
  users:any,
  sendId: (id:any) => any,
  user: any,
  usr: any,
  getUser: (username) => object
}

interface Message {
  (msg: MessageEvent): void,
}

let socket;

let connectSocket = (cb: Message): void => {
  console.log("connecting");
  // var userID = parseInt(cb.upgradeReq.url.substr(1), 10)

  socket.onopen = (): void => {
    console.log("Successfully Connected");
  };

  socket.onmessage = (msg: MessageEvent): void=> {
    cb(msg);
  };

  socket.onclose = (event: Event): void => {
    console.log("Socket Closed Connection: ", event);
    localStorage.setItem('userId', "")
  };

  socket.onerror = (error: Event): void => {
    console.log("Socket Error: ", error);
  };
};

// socket.addEventListener('join', function (event) {
//   if(! rooms[room][uuid]) rooms[room][uuid] = socket 
// });


let sendMsg = (msg: object): void => {
  console.log("sending msg: ", msg);
  // userId = `?${id}`;
  socket.send(JSON.stringify(msg));
};

class Home extends React.Component<ContainerProps> {
  state = {
    sender:"",
    recipient:"",
    download:false,
  }

  send =(event: React.KeyboardEvent): void => {
    let obj = {body: (event.target as HTMLTextAreaElement).value, recipient: this.state.recipient, sender: this.state.sender, download: this.state.download}
    if(event.key === 'Enter') {
      sendMsg(obj);
      (event.target as HTMLTextAreaElement).value = "";
    }
  }

  download = (bool) => {
    this.setState({download: bool})
  }

  componentDidMount(): void {
    // console.log(navigator.geolocation.getCurrentPosition(function(position) {
    //   console.log("Latitude is :", position.coords.latitude);
    //   console.log("Longitude is :", position.coords.longitude);
    // }));
    // this.props.getUser(this.props.user.Username)
    this.props.getContacts(this.props.user.Username)
  }
  
  sendId = (user) => {
    console.log(this.props.user);
    this.props.deleteMessages();
    let recipient = user.toString();
    this.setState({sender: this.props.user.Username, recipient: recipient})
    this.connectS(this.props.user.Username);
    return axios.post(`http://localhost:8080/addFriend/${this.props.user.Username}/${user}`)
      .then(res => {
        this.props.getUser(recipient)
        console.log(res)
      })
      .catch(err => console.log(err))
  }

  connectS = (username) => {
    socket = new WebSocket(`ws://localhost:8080/ws/${username}`);
    connectSocket((msg: MessageEvent) => {
      this.props.addMessage(msg)
      // this.props.saveMessage(username, msg)
    });
  }
  
  render() {
    // let map: google.maps.Map;
    // const loader = new Loader({
    //   apiKey: "",
    //   version: "weekly"
    //   // ...additionalOptions,
    // })
    
    // loader.load().then(() => {
    //   map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    //     center: { lat: -34.397, lng: 150.644 },
    //     zoom: 8,
    //   });
    // })
    return (
      <div className="App">
        <Sidebar {...this.props} getUsers={this.props.getUsers} getContacts={this.props.getContacts} profile={false} sendId={this.sendId} users={this.props.users} logout={this.props.logout} />
        <div className="right-section">
          <div id="chat-section">
            <ChatHistory user={this.props.usr[0]} username={this.props.user.Username} download={this.download} send={this.send} sender={this.state.sender} recipient={this.state.recipient} downloadFile={this.props.downloadFile} chatHistory={this.props.chatHistory} /> 
            {/* <div id="map"></div> */}
          </div>
        </div>
        {/* <footer style={{position:"fixed", bottom:"0", width:"100vw", height:"2vh", margin:"0 auto"}}>2020</footer> */}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    chatHistory: state.chat,
    users: state.user,
    usr: state.usr
  }
}

const mapDispatchToProps = (dispatch) => ({
    deleteMessages: () =>
      dispatch({type: actionTypes.DELETE_MESSAGES}),
    addMessage: (newChatHistoryObj: MessageEvent) =>
      dispatch({type: actionTypes.ADD_MESSAGE, payload: newChatHistoryObj}),
    saveMessage: (username: string, newChatHistoryObj: MessageEvent) =>
      dispatch({type: actionTypes.SAVE_MESSAGE, payload: username, newChatHistoryObj}),
      downloadFile: async () =>
      await dispatch(downloadFile()),
    getUsers: async () =>
      await dispatch(getUsers()),
    getUser: async (username) =>
      await dispatch(getUser(username)),
    getContacts: async (username) =>
      await dispatch(getContacts(username))
  })

export default compose(connect(mapStateToProps, mapDispatchToProps), withAuth)(Home);

