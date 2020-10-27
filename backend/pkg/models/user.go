package models

//User struct declaration
type User struct {
	// ID       primitive.ObjectID `bson:"_id,omitempty"`
	Username string `bson:"username,omitempty"`
	Password string `bson:"password,omitempty"`
}
