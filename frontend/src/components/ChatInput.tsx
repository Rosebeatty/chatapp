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
  let node = useRef<HTMLInputElement>();
  const formRef = React.useRef(null);
  

  const onChange = (e) => {
    e.preventDefault()
    SetFile(e.target.files[0])
    SetMessage(e.target.files[0].name)
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
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }
  props.download(true)
}

  const handleKeyDown = (ev) => {
    props.send(ev)
    if (file && ev.key ==='Enter'){
     ev.preventDefault()
     formRef.current.click()
    }
 }

  const triggerPicker = (event) => {
    event.preventDefault();
    SetEmojiToggle(!emojiToggle);
  };

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
      {emojiToggle ? (
        <Picker
          i18n={{
            search: "Search",
            categories: { search: "Search Results", recent: "Recent" },
          }}
          ref={node}
          title="Select emojis!"
          emoji="point_up"
          onSelect={(emoji) => SetMessage(message + emoji.native)}
          style={{ position: "absolute", bottom: "20px", left: "20px" }}
        />
      ) : null}
      <div className="chat-input">
          <form
                  // action="http://localhost:8080/upload"
                  // method="post"
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                >
                  <label htmlFor="file-icon">
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
        <button type="button" className="toggle-emoji" onClick={triggerPicker}>
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
