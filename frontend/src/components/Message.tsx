import React from "react";
import axios from "axios";
import "../css/Message.css";
import GetAppIcon from '@material-ui/icons/GetApp';

interface MessageProps {
  message: string;
  downloadFile: () => void;
  username: string;
}

const Message: React.FC<MessageProps> = (props) => {
  let message = JSON.parse(props.message);

  const download = async (id) => {
    return await axios
      .get(`http://localhost:8080/files/${id}`, {
        responseType: "blob",
      })
      .then((res) => {
        const data = res.data;
        const url = window.URL.createObjectURL(
          new Blob([data], {
            type: res.headers["content-type"],
          })
        );
        let a = document.createElement("a");
        a.href = url;
        a.setAttribute("download", id);
        a.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    props.username &&
    (message.sender === props.username && message.download ? (
      <div className="Message" style={{width:"100%"}}>
        {message.body}{" "}
        <a
          onClick={() => download(message.body)}
          target="_blank"
          download="IMG_172.jpg"
          style={{position:"fixed", marginLeft:"0.3em"}}
        >
          <GetAppIcon />
        </a>{" "}
      </div>
    ) : message.sender === props.username ? (
      <div style={{ backgroundColor: "pink", width:"100%" }} className="Message">
        {message.body}
      </div>
    ) : message.sender !== props.username ? (
      <div style={{ backgroundColor: "yellow", width:"100%" }} className="Message">
        {message.body}
      </div>
    ) : null)
  );
};

export default Message;
