import * as React from "react";
import '../css/ChatHistory.css' 
import Message from './Message'

export interface ChatProps {
  chatHistory: Array<MessageEvent>;
}

const ChatHistory: React.FC<ChatProps> = (props) => {
  const messages: Array<object> = props.chatHistory.map(msg => <Message key={Math.random()} message={msg.data} />);
  return (
      <div className='ChatHistory'>
          <h2>Chat History</h2>
            {messages}
      </div>
          );
}

export default ChatHistory;