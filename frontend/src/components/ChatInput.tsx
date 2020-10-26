import * as React from "react";
import {useRef, useEffect} from "react";
import ReactDOM from 'react-dom';
import "../css/ChatInput.css";
import Bottombar from './Bottombar'
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'

interface InputProp {
  send: (event: React.KeyboardEvent) => void
}

const ChatInput = (props: InputProp) => {
  const [message, SetMessage] = React.useState("");
  const [emojiToggle, SetEmojiToggle] = React.useState(false);
  let node = useRef<HTMLInputElement>();

  const triggerPicker = (event) => {
    event.preventDefault();
    SetEmojiToggle(!emojiToggle);
  }

  // const handleClickOutside = event => {
  //   const domNode = ReactDOM.findDOMNode(this);
  //   if (!domNode || !domNode.contains(event.target)) {
  //     SetEmojiToggle(!emojiToggle)
  //   }
  // }

  // // below is the same as componentDidMount and componentDidUnmount
  // useEffect(() => {
  //     document.addEventListener('click', handleClickOutside, true);
  //     return () => {
  //         document.removeEventListener('click', handleClickOutside, true);
  //     };
  // }, []);

  return (
      <div>
      { emojiToggle ? (
      <Picker
        i18n={{ search: 'Search', categories: { search: 'Search Results', recent: 'Recent' } }}
        ref={node}
        title="Select emojis!"
        emoji="point_up"
        onSelect={emoji => SetMessage(message + emoji.native)}
        style={{position: 'absolute', bottom: '20px', left: '20px'}}
      />
       ) : null }
        <div className="chat-input">
          <button
            type="button"
            className="toggle-emoji"
            onClick={triggerPicker}           
          >
          EMOJI
          </button>
          <input
            value={message} 
            onKeyDown={props.send}
            onChange={event => SetMessage(event.target.value)}
            />
          <Bottombar/>
        </div>
      </div>
    );
  }

export default ChatInput;