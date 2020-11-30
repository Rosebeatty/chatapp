import * as React from "react";
import axios from 'axios'
import "../css/Message.css";

interface MessageProps {
  message: string,
  downloadFile: () => void
}

const Message: React.FC<MessageProps> = (props) => {
  let message = JSON.parse(props.message);

  const download = async (id) => {
   return await axios.get(`http://localhost:8080/files/${id}`, { 
     responseType: 'blob'
  })
  .then(res => {
        const data = res.data;
        const url = window.URL.createObjectURL(
          new Blob([data], {
            type: res.headers["content-type"]
          })
        );
        let a = document.createElement('a');
        a.href = url;
        a.setAttribute("download", id);
        a.click();
    })
    .catch(err => {
      console.log(err)
    })
  }
  return (
    message.download ?
   <div className="Message">{message.body} <a onClick={() => download(message.body)} target="_blank" download="IMG_172.jpg">download</a> </div>
   : 
   <div className="Message">{message.body} </div>
  )
}

export default Message;

