package models

import "go.mongodb.org/mongo-driver/bson/primitive"

//User struct declaration
type Notification struct {
	ID           primitive.ObjectID `bson:"_id,omitempty"`
	User         primitive.ObjectID `bson:"user,omitempty"`
	Notification string             `bson:"notification,omitempty"`
}
