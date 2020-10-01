import React, { Component } from "react";
import '../ChatHistory.css' 
import Message from './Message'


function ChatHistory(props) {
  console.log(props.chatHistory);
  const messages = props.chatHistory.map(msg => <Message key={Math.random()} message={msg.data} />);
        
  return (
      <div className='ChatHistory'>
          <h2>Chat History</h2>
            {messages}
      </div>
          );
}

export default ChatHistory;