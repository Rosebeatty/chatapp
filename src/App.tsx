// App.js
import * as React from "react";
import "./App.css";
import ChatHistory from './components/ChatHistory'
import ChatInput from './components/ChatInput'
import { RootState } from "./redux/reducers/chatReducer"
import { RootAction, actionTypes } from "./redux/actions/actions"
import { Dispatch } from 'redux';
import { connectSocket, sendMsg } from "./api";
import { connect } from 'react-redux';

interface ContainerProps {
  addMessage: (newChatHistoryObj: string) => object;
  chatHistory: Array<any>;
}

class App extends React.Component<ContainerProps> {
  
  send(event: React.KeyboardEvent): void {
    if(event.key === 'Enter') {
      sendMsg((event.target as HTMLTextAreaElement).value);
      (event.target as HTMLTextAreaElement).value = "";
    }
  }

  componentDidMount(): void {
    connectSocket((msg: string) => {
      console.log("New Message")
      this.props.addMessage(msg)
    });
  }

  render() {
    return (
      <div className="App">
        {/* <Header /> */}
        <ChatHistory chatHistory={this.props.chatHistory} />
        <ChatInput send={this.send} />
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
    addMessage: (newChatHistoryObj: string) =>
      dispatch({type: actionTypes.ADD_NEW_MESSAGE, payload: newChatHistoryObj})
  })

export default connect(mapStateToProps, mapDispatchToProps)(App);

