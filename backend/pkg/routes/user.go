package routes

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/golang/chatapp/pkg/utils"
	"go.mongodb.org/mongo-driver/bson"
)

func GetUsers(w http.ResponseWriter, r *http.Request) {
	client, ctx, cancel := utils.ConnectDB()
	defer cancel()
	defer client.Disconnect(ctx)

	res, err := client.Database("chatapp").Collection("users").Find(ctx, bson.M{})
	if err != nil {
		panic(err)
	}
	var users []bson.M
	if err = res.All(ctx, &users); err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(users)
}
