package main

import (
	"fmt"
	"net/http"

	"github.com/golang/chatapp/pkg/routes"
	"github.com/golang/chatapp/pkg/utils"
	"github.com/golang/chatapp/pkg/websocket"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	fmt.Println("Chat App v0.01")
	setupRoutes()
}

func setupRoutes() {
	router := mux.NewRouter()

	pool := websocket.NewPool()
	go pool.Start()

	router.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
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

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "https://localhost:3000"}, // All origins
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},                          // Allowing only get, just an example
		AllowCredentials: true,
		AllowedHeaders:   []string{"Accept", "content-type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"},
	})

	http.ListenAndServe(":8080", c.Handler(router))
}

func serveWs(pool *websocket.Pool, w http.ResponseWriter, r *http.Request) {
	fmt.Println("WebSocket Endpoint Hit")
	conn, err := websocket.Upgrade(w, r)
	if err != nil {
		fmt.Fprintf(w, "%+v\n", err)
	}

	client := &websocket.Client{
		Conn: conn,
		Pool: pool,
	}

	pool.Register <- client
	client.Read()
}
