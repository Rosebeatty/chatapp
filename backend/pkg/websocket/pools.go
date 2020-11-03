package websocket

//GROUP MESSAGING ON HOLD FOR NOW

// import (
// 	"fmt"
// )

// type Pool struct {
// 	Register   chan *Client
// 	Unregister chan *Client
// 	Clients    map[string]map[*Client]bool
// 	Broadcast  chan Message
// }

// func NewPool() *Pool {
// 	return &Pool{
// 		Register:   make(chan *Client),
// 		Unregister: make(chan *Client),
// 		Clients:    make(map[string]map[*Client]bool),
// 		Broadcast:  make(chan Message),
// 	}
// }

// func (pool *Pool) Start() {
// 	for {
// 		select {
// 		case client := <-pool.Register:
// 			room := pool.Clients[client.ID]
// 			if room == nil {
// 				// First client in the room, create a new one
// 				room = make(map[*Client]bool)
// 				pool.Clients[client.ID] = room
// 			}
// 			room[client] = true
// 			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
// 			for client, _ := range room {
// 				fmt.Println(client)
// 				client.Conn.WriteJSON(Message{Body: "New User Joined..."})
// 			}
// 			break
// 		case client := <-pool.Unregister:
// 			room := pool.Clients[client.ID]
// 			if room != nil {
// 				// if _, ok := room[client]; ok {
// 				// 	delete(room, client)
// 				// 	close(client.Send)
// 				// 	if len(room) == 0 {
// 				// 		// This was last client in the room, delete the room
// 				// 		delete(pool.Clients, client.ID)
// 				// 	}
// 				// }
// 			}
// 			fmt.Println("Size of Connection Pool: ", len(pool.Clients))
// 			for client, _ := range room {
// 				client.Conn.WriteJSON(Message{Body: "User Disconnected..."})
// 			}
// 			break
// 		case message := <-pool.Broadcast:
// 			room := pool.Clients[message.ID]
// 			if room != nil {
// 				for client := range room {
// 					if err := client.Conn.WriteJSON(message); err != nil {
// 						fmt.Println(err)
// 						return
// 					}
// 				}
// 				// if len(room) == 0 {
// 				// 	// The room was emptied while broadcasting to the room.  Delete the room.
// 				// 	delete(pool.Clients, message.ID)
// 				// }
// 			}
// 		}
// 	}
// }
