import React from "react";
import "../Message.css";

function Message(props) {
  let message = JSON.parse(props.message);

  return <div className="Message">{message.body}</div>;
}

export default Message;

