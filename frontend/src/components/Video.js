import React from 'react';
import {useState} from 'react';
import axios from 'axios'
// import VideoCall from '../helpers/simple-peer';
// import '../styles/video.css';
// import io from 'socket.io-client';
// import { getDisplayStream } from '../helpers/media-access';
// import {ShareScreenIcon,MicOnIcon,MicOffIcon,CamOnIcon,CamOffIcon} from './Icons';

const Video = (props) => {
  let pcSender = new RTCPeerConnection({
          iceServers: [
            {
              urls: 'stun:stun.l.google.com:19302'
            }
          ]
        })
  let pcReciever = new RTCPeerConnection({
          iceServers: [
            {
              urls: 'stun:stun.l.google.com:19302'
            }
          ]
        })
  let meetingId ="123"
  let userId = props.sender
  let peerId = props.recipient

  pcSender.onicecandidate = event => {
    if (event.candidate === null) {
      axios.post(`http://localhost:8080/webrtc/sdp/m//${meetingId}/c/${userId}/p/${peerId}/s/true`,
      {"sdp" : btoa(JSON.stringify(pcSender.localDescription))})
      .then(response => {
        pcSender.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(response.data.Sdp))))
        console.log(response.data.Sdp);
        
      })
      .catch(err => console.log(err))
    }
  }
  pcReciever.onicecandidate = event => {
    if (event.candidate === null) {
        axios.post(`http://localhost:8080/webrtc/sdp/m/${meetingId}/c/${userId}/p/${peerId}/s/false`, 
        {"sdp" : btoa(JSON.stringify(pcReciever.localDescription))})
        .then(response => {
        pcReciever.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(response.data.Sdp))))
        console.log(response.data.Sdp)
      })
      .catch(err => console.log(err))

    }
  }


const startCall = () => {
  // sender part of the call
  navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) =>{
    var senderVideo= document.getElementById('senderVideo');
    senderVideo.srcObject = stream;
    var tracks = stream.getTracks();
    for (var i = 0; i < tracks.length; i++) {
      pcSender.addTrack(stream.getTracks()[i]);
    }
    pcSender.createOffer().then(d => pcSender.setLocalDescription(d)).catch(err => console.log(err))
  })
  .catch(err => console.log(err))
  // you can use event listner so that you inform he is connected!
  pcSender.addEventListener('connectionstatechange', event => {
    if (pcSender.connectionState === 'connected') {
        console.log("horray!")
    }
  });

  // receiver part of the call
  pcReciever.addTransceiver('video', {'direction': 'recvonly'})

  pcReciever.createOffer()
    .then(d => pcReciever.setLocalDescription(d))
    .catch(err => console.log(err))

  pcReciever.ontrack = function (event) {
    var receiverVideo = document.getElementById('receiverVideo')
    receiverVideo.srcObject = event.streams[0]
    receiverVideo.autoplay = true
    receiverVideo.controls = true
  }

}
    return (
      <div>
          <button onClick={startCall} className="start-call">
          Start the call!
          </button>
      
        <div className="container_row">
          <video autoPlay id="senderVideo" width="500" height="100" controls muted></video>
          <div className="layer2">
            <video autoPlay id="receiverVideo" width="160" height="120" controls muted></video>
          </div>
        </div>
    </div>
    );
}
export default Video;