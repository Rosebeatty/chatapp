package websocket

import (
	"fmt"
)

type Pool struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[string]*Client
	Broadcast  chan Message
}

func NewPool() *Pool {
	return &Pool{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[string]*Client),
		Broadcast:  make(chan Message),
	}
}

func (pool *Pool) Start() {
	for {
		select {
		case client := <-pool.Register:
			pool.Clients[client.ID] = client
			if client, ok := pool.Clients[client.ID]; ok {
				fmt.Println(client)
				client.Conn.WriteJSON(Message{Body: "New User Joined..."})
			}
			break
		case client := <-pool.Unregister:
			delete(pool.Clients, client.ID)
			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
			if client, ok := pool.Clients[client.ID]; ok {
				client.Conn.WriteJSON(Message{Body: "User Disconnected..."})
			}
			break
		case message := <-pool.Broadcast:
			//REFACTOR
			if client, ok := pool.Clients[message.Recipient]; ok {
				fmt.Printf("%v %v %v", client, message, ok)
				client.Conn.WriteJSON(message)
			}
			if client, ok := pool.Clients[message.Sender]; ok {
				client.Conn.WriteJSON(message)
			}
		}
	}
}
