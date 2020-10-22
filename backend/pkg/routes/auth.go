package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/golang/chatapp/pkg/models"
)

func CreateUser(w http.ResponseWriter, r *http.Request) {
	user := &models.User{}
	json.NewDecoder(r.Body).Decode(user)
	fmt.Printf("User %v", user)
}
