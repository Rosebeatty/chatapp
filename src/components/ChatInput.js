import React from "react";
import "../ChatInput.css";

function ChatInput(props) {
    return (
      <div className="ChatInput">
        <input onKeyDown={props.send} />
      </div>
    );
  }

export default ChatInput;