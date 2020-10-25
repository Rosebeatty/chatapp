package utils

import (
	"encoding/gob"
	"encoding/json"
	"net/http"

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

func CreateSession() *sessions.CookieStore {
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
	return store
}

func getUser(s *sessions.Session) User {
	val := s.Values["user"]
	var user = User{}
	user, ok := val.(User)
	if !ok {
		return User{Authenticated: false}
	}
	return user
}

func CheckSession(w http.ResponseWriter, r *http.Request) {
	session, err := store.Get(r, "sess")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	user := getUser(session)
	json.NewEncoder(w).Encode(user)
	return
}
