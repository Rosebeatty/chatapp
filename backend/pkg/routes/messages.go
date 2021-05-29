package routes

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/golang/chatapp/pkg/models"
	"github.com/golang/chatapp/pkg/utils"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func StartConversation(w http.ResponseWriter, r *http.Request) {
	client, ctx, cancel := utils.ConnectDB()
	defer cancel()
	defer client.Disconnect(ctx)
	params := mux.Vars(r)
	username := params["username"]
	convo := &models.Conversation{}
	json.NewDecoder(r.Body).Decode(convo)

	convo.ID = primitive.NewObjectID()

	res, err := client.Database("chatapp").Collection("users").UpdateOne(ctx, bson.M{"username": username},
		bson.D{
			{"$push", bson.D{{"conversations", convo}}},
		})
	result, err := client.Database("chatapp").Collection("conversation").UpdateOne(ctx, bson.M{"ID": convo.ID},
		bson.D{
			{"$set", bson.D{{"users", convo.Users}}},
		})
	if err != nil {
		panic(err)
	}
	fmt.Println(res, result)

	json.NewEncoder(w).Encode(convo)
}

func SaveMessage(w http.ResponseWriter, r *http.Request) {
	client, ctx, cancel := utils.ConnectDB()
	defer cancel()
	defer client.Disconnect(ctx)
	params := mux.Vars(r)
	user := params["username"]
	convoID := params["convoID"]
	message := &models.Message{}
	json.NewDecoder(r.Body).Decode(message)

	message.ID = primitive.NewObjectID()

	res, err := client.Database("chatapp").Collection("messages").InsertOne(ctx, message)
	result, err := client.Database("chatapp").Collection("conversations").UpdateOne(ctx, bson.M{"ID": convoID},
		bson.D{
			{"$push", bson.D{
				{"messages", message.ID},
				{"user", user},
			}}},
	)

	if err != nil {
		panic(err)
	}
	fmt.Println(res, result)

}

func DeleteMessage(w http.ResponseWriter, r *http.Request) {
	client, ctx, cancel := utils.ConnectDB()
	defer cancel()
	defer client.Disconnect(ctx)
	params := mux.Vars(r)
	id := params["id"]
	res, err := client.Database("chatapp").Collection("messages").UpdateOne(ctx, bson.M{"ID": id},
		bson.D{
			{"$pull", bson.D{{"messages", id}}},
		})

	if err != nil {
		panic(err)
	}
	fmt.Println(res)
}
