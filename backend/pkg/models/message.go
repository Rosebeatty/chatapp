package models

import "go.mongodb.org/mongo-driver/bson/primitive"

//User struct declaration
type Message struct {
	ID      primitive.ObjectID `bson:"_id,omitempty"`
	User    primitive.ObjectID `bson:"user,omitempty"`
	Message string             `bson:"message,omitempty"`
}
