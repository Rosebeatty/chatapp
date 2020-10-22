package main

import (
	"encoding/gob"
	"fmt"
	"net/http"

	"github.com/golang/chatapp/pkg/routes"
	"github.com/golang/chatapp/pkg/utils"
	"github.com/golang/chatapp/pkg/websocket"
	"github.com/gorilla/mux"
	"github.com/gorilla/securecookie"
	"github.com/gorilla/sessions"
)

// User holds a users account information
type User struct {
	Username      string
	Authenticated bool
}

// store will hold all session data
var store *sessions.CookieStore

func init() {
	authKeyOne := securecookie.GenerateRandomKey(64)
	encryptionKeyOne := securecookie.GenerateRandomKey(32)

	store = sessions.NewCookieStore(
		authKeyOne,
		encryptionKeyOne,
	)

	store.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   60 * 15,
		HttpOnly: true,
	}

	gob.Register(User{})
}

func main() {
	fmt.Println("Chat App v0.01")
	utils.ConnectDB()
	setupRoutes()
}

func setupRoutes() {
	router := mux.NewRouter()
	router.Use(forCORS)

	pool := websocket.NewPool()
	go pool.Start()

	router.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(pool, w, r)
	})
	router.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		routes.CreateUser(w, r)
	})
	router.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
	})
	router.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
	})

	http.ListenAndServe(":8080", router)
}

func forCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
		return
	})
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
