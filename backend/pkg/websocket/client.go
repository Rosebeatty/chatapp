package websocket

import (
	"fmt"

	"github.com/gorilla/websocket"
)

var AllClients = make(map[string]*Client)

type Client struct {
	ID   string
	Conn *websocket.Conn
	Pool *Pool
	Send chan Message
}

type Message struct {
	ID        string `json:"id"`
	Sender    string `json:"sender"`
	Recipient string `json:"recipient"`
	Body      string `json:"body"`
	// Type      int    `json:"type"`
}

func (c *Client) Read() {
	defer func() {
		c.Pool.Unregister <- c
		// c.Conn.Close()
	}()

	for {
		// messageType, p, err := c.Conn.ReadMessage()
		// if err != nil {
		// 	log.Println(err)
		// 	return
		// }
		message := Message{}
		err := c.Conn.ReadJSON(&message)
		if err != nil {
			fmt.Println(err)
			break
		}
		fmt.Printf("%v", message)
		c.Pool.Broadcast <- message
		fmt.Printf("Message Received: %+v\n", message)
	}
}
