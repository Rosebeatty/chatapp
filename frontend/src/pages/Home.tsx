// App.js
import * as React from "react";
import "../css/App.css";
import ChatHistory from '../components/ChatHistory'
import ChatInput from '../components/ChatInput'
import Sidebar from '../components/Sidebar'
// import Searchbar from '../components/Searchbar'
// import Bottombar from '../components/Bottombar'
import { RootState } from "../redux/reducers/chatReducer"
import { RootAction, actionTypes } from "../redux/actions/actions"
import { Dispatch } from 'redux';
import { connectSocket, sendMsg } from "../api";
import { connect } from 'react-redux';
import { compose } from 'redux'
import { withAuth } from "../lib/AuthProvider";

interface ContainerProps {
  addMessage: (newChatHistoryObj: MessageEvent) => object;
  chatHistory: Array<any>;
  logout: any
}

class Home extends React.Component<ContainerProps> {
  send(event: React.KeyboardEvent): void {
    if(event.key === 'Enter') {
      sendMsg((event.target as HTMLTextAreaElement).value);
      (event.target as HTMLTextAreaElement).value = "";
    }
  }

  componentDidMount(): void {
    console.log(navigator.geolocation.getCurrentPosition(function(position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    }));
    connectSocket((msg: MessageEvent) => {
      console.log("New Message")
      this.props.addMessage(msg)
    });
  }

  render() {
    // const { logout } = this.props
    return (
      <div className="App">
        <Sidebar logout={this.props.logout} />
        <div className="right-section">
          <div id="chat-section">
            <ChatHistory chatHistory={this.props.chatHistory} />
            <ChatInput send={this.send} />
          </div>
          {/* <div id="search-section">
          </div> */}
        </div>
        <footer>2020</footer>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    chatHistory: state
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) => ({
    addMessage: (newChatHistoryObj: MessageEvent) =>
      dispatch({type: actionTypes.ADD_NEW_MESSAGE, payload: newChatHistoryObj})
  })

export default compose(connect(mapStateToProps, mapDispatchToProps), withAuth)(Home);

