package main

import (
	"fmt"
	"log"
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
	router.HandleFunc("/download", func(w http.ResponseWriter, r *http.Request) {
		routes.DownloadFile(w, r, "Readme.txt", "IMG_1713.jpg")
	})
	// Create the route
	router.
		PathPrefix(staticDir).
		Handler(http.StripPrefix(staticDir, http.FileServer(http.Dir("."+staticDir))))

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "https://localhost:3000", "http://localhost:3001", "https://localhost:3000"}, // All origins
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},                                                                             // Allowing only get, just an example
		AllowCredentials: true,
		AllowedHeaders:   []string{"Accept", "content-type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization"},
	})
	fmt.Println(router)
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
