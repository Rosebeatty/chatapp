package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/golang/chatapp/pkg/models"
	"github.com/golang/chatapp/pkg/utils"
	"golang.org/x/crypto/bcrypt"
)

type ErrorResponse struct {
	Err string
}

func CreateUser(w http.ResponseWriter, r *http.Request) {
	store := utils.CreateSession()
	session, err := store.Get(r, "sess")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	user := &models.User{}
	json.NewDecoder(r.Body).Decode(user)

	pass, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println(err)
		err := ErrorResponse{
			Err: "Password Encryption failed",
		}
		json.NewEncoder(w).Encode(err)
	}
	user.Password = string(pass)
	fmt.Printf("User %v", user)

	u := utils.User{
		Username:      user.Username,
		Authenticated: true,
	}

	session.Values["user"] = u

	err = session.Save(r, w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// createdUser := utils.InsertOne(user)
	// var errMessage = createdUser.Error

	// if createdUser.Error != nil {
	// 	fmt.Println(errMessage)
	// }
	json.NewEncoder(w).Encode(user)

	return
}

func Login(w http.ResponseWriter, r *http.Request) {
	user := &models.User{}
	err := json.NewDecoder(r.Body).Decode(user)
	if err != nil {
		var resp = map[string]interface{}{"status": false, "message": "Invalid request"}
		json.NewEncoder(w).Encode(resp)
		return
	}
	// resp := FindOne(user.Email, user.Password)
	json.NewEncoder(w).Encode(user)
}
