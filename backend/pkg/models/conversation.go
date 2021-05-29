package models

import "go.mongodb.org/mongo-driver/bson/primitive"

//User struct declaration
type Conversation struct {
	ID       primitive.ObjectID   `bson:"_id,omitempty"`
	Users    []primitive.ObjectID `bson:"users,omitempty"`
	Messages []primitive.ObjectID `bson:"messages,omitempty"`
}
