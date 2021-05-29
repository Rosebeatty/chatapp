package models

import "go.mongodb.org/mongo-driver/bson/primitive"

//User struct declaration
type User struct {
	ID            primitive.ObjectID   `bson:"_id,omitempty"`
	Username      string               `bson:"username,omitempty"`
	Password      string               `bson:"password,omitempty"`
	ProfileImg    string               `bson:"profileimg,omitempty"`
	Friends       []string             `bson:"friends,omitempty"`
	Description   string               `bson:"description,omitempty"`
	Status        string               `bson:"status,omitempty"`
	Conversations []primitive.ObjectID `bson:"conversations,omitempty"`
	Notifications []primitive.ObjectID `bson:"notifications,omitempty"`
}
