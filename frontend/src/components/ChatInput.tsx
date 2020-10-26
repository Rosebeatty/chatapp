import * as React from "react";
import "../css/ChatInput.css";
import Bottombar from './Bottombar'

interface InputProp {
  send: (event: React.KeyboardEvent) => void
}

const ChatInput: React.FC<InputProp> = (props) => {
    return (
      <div className="chat-input">
        <input onKeyDown={props.send} />
        <Bottombar/>
      </div>
    );
  }

export default ChatInput;