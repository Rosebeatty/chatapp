package routes

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/golang/chatapp/pkg/utils"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

	var unfriended []bson.M

	for _, doc := range users {
		for key, value := range doc {
			if key == "friends" {
				if pa, ok := value.(primitive.A); ok {
					userArray := []interface{}(pa)
					result, err := client.Database("chatapp").Collection("users").Find(ctx, bson.M{"username": bson.M{"$nin": userArray}})
					if err != nil {
						panic(err)
					}
					if err = result.All(ctx, &unfriended); err != nil {
						log.Fatal(err)
					}
				}
			}
		}
	}

	json.NewEncoder(w).Encode(unfriended)
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	client, ctx, cancel := utils.ConnectDB()
	defer cancel()
	defer client.Disconnect(ctx)
	params := mux.Vars(r)
	id := params["username"]
	res, err := client.Database("chatapp").Collection("users").Find(ctx, bson.M{"username": id})
	if err != nil {
		panic(err)
	}
	var p []bson.M
	if err = res.All(ctx, &p); err != nil {
		log.Fatal(err)
	}
	json.NewEncoder(w).Encode(p)
}

func GetContacts(w http.ResponseWriter, r *http.Request) {
	client, ctx, cancel := utils.ConnectDB()
	defer cancel()
	defer client.Disconnect(ctx)
	params := mux.Vars(r)
	id := params["username"]

	res, err := client.Database("chatapp").Collection("users").Find(ctx, bson.M{"username": id})
	if err != nil {
		panic(err)
	}
	var p []bson.M
	if err = res.All(ctx, &p); err != nil {
		log.Fatal(err)
	}
	var ro []bson.M

	for _, doc := range p {
		for key, value := range doc {
			if key == "friends" {
				if pa, ok := value.(primitive.A); ok {
					valueMSI := []interface{}(pa)
					result, err := client.Database("chatapp").Collection("users").Find(ctx, bson.M{"username": bson.M{"$in": valueMSI}})
					if err != nil {
						panic(err)
					}
					if err = result.All(ctx, &ro); err != nil {
						log.Fatal(err)
					}
				}
			}
		}
	}

	json.NewEncoder(w).Encode(ro)

}

func UpdateUser(w http.ResponseWriter, r *http.Request) {
	client, ctx, cancel := utils.ConnectDB()
	defer cancel()
	defer client.Disconnect(ctx)
	params := mux.Vars(r)
	username := params["username"]
	description := params["description"]
	status := params["status"]
	res, err := client.Database("chatapp").Collection("users").UpdateOne(ctx, bson.M{"username": username},
		bson.D{
			{"$set", bson.D{{"description", description}, {"status", status}}},
		})
	if err != nil {
		panic(err)
	}
	fmt.Println(res)
}

func AddFriend(w http.ResponseWriter, r *http.Request) {
	client, ctx, cancel := utils.ConnectDB()
	defer cancel()
	defer client.Disconnect(ctx)
	params := mux.Vars(r)
	id := params["username"]
	friendId := params["friend"]
	res, err := client.Database("chatapp").Collection("users").UpdateOne(ctx, bson.M{"username": id},
		bson.M{"$push": bson.M{"friends": friendId}})
	if err != nil {
		panic(err)
	}
	fmt.Println(res)
	//save friend user id to current user friend list
}

func DeleteFriend(w http.ResponseWriter, r *http.Request) {
	//delete friend user id from current user friend list
	client, ctx, cancel := utils.ConnectDB()
	defer cancel()
	defer client.Disconnect(ctx)
	params := mux.Vars(r)
	id := params["username"]
	friend := params["friend"]
	res, err := client.Database("chatapp").Collection("users").UpdateOne(ctx, bson.M{"username": id},
		bson.M{"$pull": bson.M{"friends": friend}})
	if err != nil {
		panic(err)
	}
	fmt.Println(res)
}

func DeleteAccount(w http.ResponseWriter, r *http.Request) {
	client, ctx, cancel := utils.ConnectDB()
	defer cancel()
	defer client.Disconnect(ctx)
	params := mux.Vars(r)
	id := params["username"]
	res, err := client.Database("chatapp").Collection("users").DeleteOne(ctx, bson.M{"username": id})
	if err != nil {
		panic(err)
	}
	fmt.Println(res)
}
