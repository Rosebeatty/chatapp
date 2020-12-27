package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/golang/chatapp/pkg/routes"
	"github.com/golang/chatapp/pkg/utils"
	"github.com/golang/chatapp/pkg/websocket"
	"github.com/gorilla/mux"
	"github.com/pion/rtcp"
	"github.com/pion/webrtc/v2"
	"github.com/rs/cors"
)

const (
	rtcpPLIInterval = time.Second * 3
)

// Sdp represent session description protocol describe media communication sessions
type Sdp struct {
	Sdp string
}

func main() {
	fmt.Println("Chat App v0.01")
	setupRoutes()
}

func Decode(in string, obj interface{}) {
	b, err := base64.StdEncoding.DecodeString(in)
	if err != nil {
		panic(err)
	}
	fmt.Println(b)
	err = json.Unmarshal(b, obj)
	if err != nil {
		panic(err)
	}
}

func setupRoutes() {
	router := mux.NewRouter().StrictSlash(true)
	staticDir := "/files/"
	pool := websocket.NewPool()
	go pool.Start()

	router.HandleFunc("/ws/{id}", func(w http.ResponseWriter, r *http.Request) {
		serveWs(pool, w, r)
	})
	router.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		routes.CreateUser(w, r)
	})
	router.HandleFunc("/me", func(w http.ResponseWriter, r *http.Request) {
		utils.CheckSession(w, r)
	})
	router.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		routes.Login(w, r)
	})
	router.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		routes.Logout(w, r)
	})
	router.HandleFunc("/getUsers", func(w http.ResponseWriter, r *http.Request) {
		routes.GetUsers(w, r)
	})
	router.HandleFunc("/upload", func(w http.ResponseWriter, r *http.Request) {
		routes.UploadFile(w, r)
	})
	sd := Sdp{}
	router.HandleFunc("/webrtc/sdp/m/{meetingId}/c/{userID}/p/{peerId}/s/{isSender}", func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		isSender, _ := strconv.ParseBool(params["isSender"])
		userID := params["userID"]
		peerID := params["peerId"]
		// sender to channel of track
		peerConnectionMap := make(map[string]chan *webrtc.Track)

		m := webrtc.MediaEngine{}

		// Setup the codecs you want to use.
		// Only support VP8(video compression), this makes our proxying code simpler
		m.RegisterCodec(webrtc.NewRTPVP8Codec(webrtc.DefaultPayloadTypeVP8, 90000))

		api := webrtc.NewAPI(webrtc.WithMediaEngine(m))

		peerConnectionConfig := webrtc.Configuration{
			ICEServers: []webrtc.ICEServer{
				{
					URLs: []string{"stun:stun.l.google.com:19302"},
				},
			},
		}
		// sdp, _ := ioutil.ReadAll(r.Body)
		decoder := json.NewDecoder(r.Body)
		decoder.Decode(&sd)
		// if err != nil {
		// 	w.Write([]byte("error"))
		// 	return
		// }
		c := sd.Sdp
		offer := webrtc.SessionDescription{}

		Decode(c, &offer)
		// if err != nil {
		// 	panic(err)
		// }
		// Create a new RTCPeerConnection
		// this is the gist of webrtc, generates and process SDP
		peerConnection, err := api.NewPeerConnection(peerConnectionConfig)
		if err != nil {
			log.Fatal(err)
		}
		if !isSender {
			recieveTrack(peerConnection, peerConnectionMap, peerID)
		} else {
			createTrack(peerConnection, peerConnectionMap, userID)
		}
		// Set the SessionDescription of remote peer
		peerConnection.SetRemoteDescription(offer)

		// Create answer
		answer, err := peerConnection.CreateAnswer(nil)
		if err != nil {
			log.Fatal(err)
		}

		// Sets the LocalDescription, and starts our UDP listeners
		err = peerConnection.SetLocalDescription(answer)
		if err != nil {
			log.Fatal(err)
		}
		l, _ := json.Marshal(answer)

		e := base64.StdEncoding.EncodeToString(l)
		json.NewEncoder(w).Encode(Sdp{e})
		// w.JSON(http.StatusOK, Sdp{Sdp: Encode(answer)})
	})
	router.
		PathPrefix(staticDir).
		Handler(http.StripPrefix(staticDir, http.FileServer(http.Dir("."+staticDir))))

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "https://localhost:3000", "http://localhost:3001", "https://localhost:3000"}, // All origins
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},                                                                             // Allowing only get, just an example
		AllowCredentials: true,
		AllowedHeaders:   []string{"Accept", "content-type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"},
	})
	http.ListenAndServe(":8080", c.Handler(router))
}

func serveWs(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	fmt.Println("WebSocket Endpoint Hit")
	params := mux.Vars(r)
	id := params["id"]

	log.Println("Url Param 'key' is: " + id)

	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}

	client := &websocket.Client{
		Conn: conn,
		Pool: pool,
		ID:   id,
	}

	pool.Register <- client
	client.Read()
}

// user is the caller of the method
// if user connects before peer: create channel and keep listening till track is added
// if peer connects before user: channel would have been created by peer and track can be added by getting the channel from cache
func recieveTrack(peerConnection *webrtc.PeerConnection,
	peerConnectionMap map[string]chan *webrtc.Track,
	peerID string) {
	if _, ok := peerConnectionMap[peerID]; !ok {
		peerConnectionMap[peerID] = make(chan *webrtc.Track, 1)
	}
	localTrack := <-peerConnectionMap[peerID]
	peerConnection.AddTrack(localTrack)
}

// user is the caller of the method
// if user connects before peer: since user is first, user will create the channel and track and will pass the track to the channel
// if peer connects before user: since peer came already, he created the channel and is listning and waiting for me to create and pass track
func createTrack(peerConnection *webrtc.PeerConnection,
	peerConnectionMap map[string]chan *webrtc.Track,
	currentUserID string) {

	if _, err := peerConnection.AddTransceiver(webrtc.RTPCodecTypeVideo); err != nil {
		log.Fatal(err)
	}

	// Set a handler for when a new remote track starts, this just distributes all our packets
	// to connected peers
	peerConnection.OnTrack(func(remoteTrack *webrtc.Track, receiver *webrtc.RTPReceiver) {
		// Send a PLI on an interval so that the publisher is pushing a keyframe every rtcpPLIInterval
		// This can be less wasteful by processing incoming RTCP events, then we would emit a NACK/PLI when a viewer requests it
		go func() {
			ticker := time.NewTicker(rtcpPLIInterval)
			for range ticker.C {
				if rtcpSendErr := peerConnection.WriteRTCP([]rtcp.Packet{&rtcp.PictureLossIndication{MediaSSRC: remoteTrack.SSRC()}}); rtcpSendErr != nil {
					fmt.Println(rtcpSendErr)
				}
			}
		}()

		// Create a local track, all our SFU clients will be fed via this track
		// main track of the broadcaster
		localTrack, newTrackErr := peerConnection.NewTrack(remoteTrack.PayloadType(), remoteTrack.SSRC(), "video", "pion")
		if newTrackErr != nil {
			log.Fatal(newTrackErr)
		}

		// the channel that will have the local track that is used by the sender
		// the localTrack needs to be fed to the reciever
		localTrackChan := make(chan *webrtc.Track, 1)
		localTrackChan <- localTrack
		if existingChan, ok := peerConnectionMap[currentUserID]; ok {
			// feed the exsiting track from user with this track
			existingChan <- localTrack
		} else {
			peerConnectionMap[currentUserID] = localTrackChan
		}

		rtpBuf := make([]byte, 1400)
		for { // for publisher only
			i, readErr := remoteTrack.Read(rtpBuf)
			if readErr != nil {
				log.Fatal(readErr)
			}

			// ErrClosedPipe means we don't have any subscribers, this is ok if no peers have connected yet
			if _, err := localTrack.Write(rtpBuf[:i]); err != nil && err != io.ErrClosedPipe {
				log.Fatal(err)
			}
		}
	})

}
