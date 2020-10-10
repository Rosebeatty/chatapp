import * as React from "react";
import "../Message.css";

interface MessageProps {
  message: string
}

const Message: React.FC<MessageProps> = (props) => {
  let message = JSON.parse(props.message);

  return <div className="Message">{message.body}</div>;
}

export default Message;

