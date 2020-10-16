import * as React from "react";
import "../css/ChatInput.css";

interface InputProp {
  send: (event: React.KeyboardEvent) => void
}

const ChatInput: React.FC<InputProp> = (props) => {
    return (
      <div className="ChatInput">
        <input onKeyDown={props.send} />
      </div>
    );
  }

export default ChatInput;