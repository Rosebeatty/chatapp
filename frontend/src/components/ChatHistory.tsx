import * as React from "react";
import '../css/ChatHistory.css' 
import Message from './Message'
import Video from './Video'
import Man from './man.svg'
import FOG from 'vanta/dist/vanta.fog.min'
import {useRef, useEffect, useState} from 'react'
import ChatInput from '../components/ChatInput'
import { Divider } from "@material-ui/core";
import { spawn } from "child_process";


export interface ChatProps {
  chatHistory: Array<MessageEvent>,
  downloadFile: () => void,
  recipient: string,
  sender: string,
  send: (e) => void,
  download: (boolean) => void,
  username: string,
  // getUser: (username) => object,
  user:any
}

const ChatHistory: React.FC<ChatProps> = (props) => {
  const messages: Array<object> = props.chatHistory.map(msg => <Message username={props.username} downloadFile={props.downloadFile} key={Math.random()} message={msg.data} />);

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


  // useEffect(() => {
  //   props.recipient && props.getUser(props.recipient)
  // })
  return (
      <div className='ChatHistory'>
          { props.user 
          ? <div>
            <Divider/>
              <span style={{display:"flex", alignItems:"flex-end", justifyContent:"center", paddingBottom: "1em"}}>
              <img style={{width:"5vw", paddingTop:"1em"}} src={`./files/${props.user[0].profileimg}`} alt="profile img" />
                <p style={{margin:"0", paddingLeft:"1em"}}>{props.recipient}</p>
                 <p style={{margin:"0", paddingLeft:"1em"}}>{props.user[0].description}</p>
              </span>
              <div 
              className="MessageScroll"
              id="chatbox"
                 >
              <div style={{
                display:"flex",
                flexDirection:"column-reverse"
                }}>
                  {messages}
                </div>
                </div>
              <ChatInput download={props.download} send={props.send} />
              {/* <Video sender={props.sender} recipient={props.recipient}/> */}
            </div> 
          : <div style={{maxHeight:"85vh", display: "flex", justifyContent:"center", flexDirection:"column"}}>
              <img style={{maxHeight:"80vh"}} src={Man}/>
              {/* <Video sender={props.sender} recipient={props.recipient}/> */}
              <h1 style={{margin:"0", color:"rgb(69,18,66)"}}>Welcome to Memo</h1>
              <h4 style={{color:"#7986BF"}}>Chat, Translate & Search </h4>
            </div> }
       </div>
  );
}

export default ChatHistory;