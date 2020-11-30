// App.js
import * as React from "react";
import "../css/App.css";
import ChatHistory from '../components/ChatHistory'
import ChatInput from '../components/ChatInput'
import Sidebar from '../components/Sidebar'
import { RootState } from "../redux/reducers/index"
import { RootAction, actionTypes } from "../redux/actions/chatActions"
import { getUsers } from "../redux/actions/userActions"
import { connect } from 'react-redux';
import { compose } from 'redux'
import { withAuth } from "../lib/AuthProvider";
import { downloadFile } from "../redux/actions/downloadActions"
// import { ThunkDispatch } from 'redux-thunk'
// import { Dispatch } from 'redux';
// import { connectSocket, sendMsg } from "../api";
// import { Loader } from "@googlemaps/js-api-loader"

interface ContainerProps {
  addMessage: (newChatHistoryObj: MessageEvent) => object,
  chatHistory: Array<any>,
  deleteMessages: () => object,
  downloadFile: () => Promise<boolean>,
  logout: () => any;
  getUsers: () => Promise<boolean>,
  users:any,
  sendId: (id:any) => any,
  user: any
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

let sendMsg = (msg: object): void => {
  console.log("sending msg: ", msg);
  // userId = `?${id}`;
  socket.send(JSON.stringify(msg));
};

class Home extends React.Component<ContainerProps> {
  state = {
    sender:"",
    recipient:"",
    download:false
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
    console.log(navigator.geolocation.getCurrentPosition(function(position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    }));
    this.props.getUsers()
  }
  
  sendId = (user) => {
    console.log(user);
    this.props.deleteMessages();
    let recipient = user.toString();
    this.setState({sender: this.props.user.Username, recipient: recipient})
    this.connectS(this.props.user.Username);
  }

  connectS = (username) => {
    socket = new WebSocket(`ws://localhost:8080/ws/${username}`);
    connectSocket((msg: MessageEvent) => {
      this.props.addMessage(msg)
    });
  }
  
  render() {
    // let map: google.maps.Map;
    // const loader = new Loader({
    //   apiKey: "AIzaSyAX6LKg1WvdqijseSjpH6kLu10tyOcnQUc",
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
        <Sidebar sendId={this.sendId} users={this.props.users} logout={this.props.logout} />
        <div className="right-section">
          <div id="chat-section">
            <ChatHistory downloadFile={this.props.downloadFile} chatHistory={this.props.chatHistory} />
            <ChatInput download={this.download} send={this.send} />
            <div id="map"></div>
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
    users: state.user
  }
}

const mapDispatchToProps = (dispatch) => ({
    deleteMessages: () =>
      dispatch({type: actionTypes.DELETE_MESSAGES}),
    addMessage: (newChatHistoryObj: MessageEvent) =>
      dispatch({type: actionTypes.ADD_NEW_MESSAGE, payload: newChatHistoryObj}),
      downloadFile: async () =>
      await dispatch(downloadFile()),
    getUsers: async () =>
      await dispatch(getUsers())
  })

export default compose(connect(mapStateToProps, mapDispatchToProps), withAuth)(Home);

