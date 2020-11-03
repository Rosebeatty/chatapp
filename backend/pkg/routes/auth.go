package routes

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/golang/chatapp/pkg/models"
	"github.com/golang/chatapp/pkg/utils"
	"github.com/gorilla/sessions"
	"go.mongodb.org/mongo-driver/bson"
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

	client, ctx, cancel := utils.ConnectDB()
	defer cancel()
	defer client.Disconnect(ctx)
	// user.ID = primitive.NewObjectID()

	res, err := client.Database("chatapp").Collection("users").InsertOne(ctx, user)
	if err != nil {
		panic(err)
	}
	fmt.Println(res)

	json.NewEncoder(w).Encode(user)
	return
}

func Login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	store := utils.CreateSession()
	session, err := store.Get(r, "sess")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	user := &models.User{}
	err = json.NewDecoder(r.Body).Decode(user)
	fmt.Println(user)

	if err != nil {
		var resp = map[string]interface{}{"status": false, "message": "Invalid request"}
		json.NewEncoder(w).Encode(resp)
		return
	}

	dbUser := &models.User{}
	client, ctx, cancel := utils.ConnectDB()
	defer cancel()
	defer client.Disconnect(ctx)
	err = client.Database("chatapp").Collection("users").FindOne(ctx, bson.M{"username": user.Username}).Decode(dbUser)
	if err != nil {
		log.Fatal(err)
	}
	userPass := []byte(user.Password)
	dbPass := []byte(dbUser.Password)
	passErr := bcrypt.CompareHashAndPassword(dbPass, userPass)
	if passErr != nil {
		log.Println(passErr)
		w.Write([]byte(`{"response":"Wrong Password!"}`))
		return
	}

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
	json.NewEncoder(w).Encode(u)

	return
}

func Logout(w http.ResponseWriter, r *http.Request) {
	session, err := utils.Store.Get(r, "sess")
	if err != nil {
		log.Fatal(err)
	}
	session.Values["user"] = utils.User{}
	session.Options = &sessions.Options{
		MaxAge: -1,
	}
	err = session.Save(r, w)
	if err != nil {
		log.Fatal(err)
	}
}
