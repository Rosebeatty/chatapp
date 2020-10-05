// App.js
import React, { Component } from "react";
import "./App.css";
import ChatHistory from './components/ChatHistory'
import ChatInput from './components/ChatInput'
import { connect, sendMsg } from "./api";

class App extends Component {
    state = {
      chatHistory: []
    }

  send(event) {
    if(event.keyCode === 13) {
      sendMsg(event.target.value);
      event.target.value = "";
    }
  }

  componentDidMount() {
    connect((msg) => {
      console.log("New Message")
      this.setState(prevState => ({
        chatHistory: [...this.state.chatHistory, msg]
      }))
    });
  }

  render() {
    return (
      <div className="App">
        {/* <Header /> */}
        <ChatHistory chatHistory={this.state.chatHistory} />
        <ChatInput send={this.send} />
      </div>
    );
  }
}

// const mapStateToProps = state => {
//   return {
//     chatHistory: state
//   }
// }

// const mapDispatchToProps = dispatch => {
//   return {
//     chatHistory: (newChatHistoryObj) => {
//       dispatch(actions.addStudent(newChatHistoryObj))
//     },
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(App);

export default App;