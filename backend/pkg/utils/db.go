package utils

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectDB() (*mongo.Client, context.Context, context.CancelFunc) {
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb+srv://rose:bbr@cluster0.jthgd.mongodb.net/chatapp?retryWrites=true&w=majority&tlsInsecure=true"))
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2000*time.Second)

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Connected to database %v", client.Database("chatapp"))
	return client, ctx, cancel
}
