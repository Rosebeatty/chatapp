import * as React from "react";
// import "../css/Message.css";

interface MessageProps {
  message: string
}

const Message: React.FC<MessageProps> = (props) => {
  let message = JSON.parse(props.message);

  return <div className="Message">{message.body}</div>;
}

export default Message;

