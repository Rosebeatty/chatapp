import * as React from "react";
import "../css/Message.css";

interface MessageProps {
  message: string,
  file: boolean
}

const Message: React.FC<MessageProps> = (props) => {
  let message = JSON.parse(props.message);

  return (
    props.file ?
   <div className="Message">{message.body} download </div>
   : 
   <div className="Message">{message.body} </div>

  )
}

export default Message;

