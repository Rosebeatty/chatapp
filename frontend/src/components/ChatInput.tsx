import * as React from "react";
import { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import "../css/ChatInput.css";
import Bottombar from "./Bottombar";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { Emoji } from "emoji-mart";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import axios from 'axios'

interface InputProp {
  send: (event: React.KeyboardEvent) => void,
  download: (boolean) => void
}

const ChatInput = (props: InputProp) => {
  const [message, SetMessage] = React.useState("");
  const [download, SetDownload] = React.useState(false);
  const [file, SetFile] = React.useState(null);
  const [emojiToggle, SetEmojiToggle] = React.useState(false);
  const node = useRef<HTMLInputElement>();
  const formRef = useRef(null);
  

  const onChange = (e) => {
    e.preventDefault()
    SetFile(e.target.files[0])
    SetMessage(e.target.files[0].name)
    props.download(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // let id = this.props.user._id;

    if (file) {
    let formData = new FormData();
    formData.append("file", file);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post(
        `http://localhost:8080/upload`,
        formData,
        config
      )
      .then((res) => {
        props.download(false)
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }
}

const handleKeyDown = (ev) => {
    props.send(ev)
    if (file && ev.key ==='Enter'){
     ev.preventDefault()
     formRef.current.click()
    }
    if (ev.key ==='Enter'){
      SetMessage('')
    }
 }

  const triggerPicker = (event) => {
    event.preventDefault();
    SetEmojiToggle(!emojiToggle);
  };

  const handleClickOutside = (event) => {
    const chat = document.getElementById("chat-section")
    if (event.target === chat) {
      SetEmojiToggle(false)
    }
  }

  // below is the same as componentDidMount and componentDidUnmount
  useEffect(() => {
      document.addEventListener('click', handleClickOutside, false);
      return () => {
        document.removeEventListener('click', handleClickOutside, false);
      };
  }, []);

  return (
    <div>
      { emojiToggle ? (
        <div ref={node} className="emoji">
          <Picker
            i18n={{
              search: "Search",
              categories: { search: "Search Results", recent: "Recent" },
            }}
            title="Select emojis!"
            emoji="point_up"
            onSelect={(emoji) => SetMessage(message + emoji.native)}
            style={{ position: "absolute", bottom: "20px", left: "20px" }}
          />
        </div>
      ) : null }
      <div className="chat-input">
          <form
                  style={{display: "flex", alignItems: "center"}}
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                >
                  <label htmlFor="file-icon" style={{paddingRight:"1em", display: "flex", color:"white", cursor:"pointer"}}>
                    <AttachFileIcon />
                  </label>
                  <input
                    onChange={onChange}
                    type="file"
                    name="myFile"
                    id="file-icon"
                    style={{
                      display:"none"
                    }}
                  />
                  <button ref={formRef} value="upload" type="submit" style={{display: 'none'}}/>
          </form>
        <button type="button" className="toggle-emoji" onClick={triggerPicker} style={{cursor:"pointer", borderRadius:"10px", border:"none"}}>
          <Emoji emoji={{ id: "santa", skin: 3 }} size={18} />
        </button>
        <input
          style={{ border: "none" }}
          value={message}
          onKeyDown={handleKeyDown}
          onChange={(event) => SetMessage(event.target.value)}
        />
        <Bottombar />
      </div>
    </div>
  );
};

export default ChatInput;
