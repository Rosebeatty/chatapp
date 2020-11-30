import * as React from "react";
import '../css/ChatHistory.css' 
import Message from './Message'
import Man from './man.svg'
import FOG from 'vanta/dist/vanta.fog.min'
import {useRef, useEffect, useState} from 'react'

export interface ChatProps {
  chatHistory: Array<MessageEvent>,
  downloadFile: () => void
}

const ChatHistory: React.FC<ChatProps> = (props) => {
  console.log(props.chatHistory)
  const messages: Array<object> = props.chatHistory.map(msg => <Message downloadFile={props.downloadFile} key={Math.random()} message={msg.data} />);

  // const [vantaEffect, setVantaEffect] = useState(null)
  // const myRef = useRef(null)
  // useEffect(() => {
  //   if (!vantaEffect) {
  //     setVantaEffect(FOG({
  //       el: myRef.current
  //     }))
  //   }
  // //   return () => {
  // //     if (vantaEffect) vantaEffect.destroy()
  // //   }
  // }, [vantaEffect])

  return (
      <div className='ChatHistory'>
          { messages.length > 0 
          ? <div>{messages}</div> 
          : <div style={{height:"85vh", display: "flex", justifyContent:"center", flexDirection:"column"}}>
              <img src={Man}/>
              <h1 style={{marginTop:"0", color:"purple"}}>Welcome to Memo</h1>
              <h4 style={{color:"purple"}}>Chat, Translate & Search </h4>
            </div> }
      </div>
  );
}

export default ChatHistory;