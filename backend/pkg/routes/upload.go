package routes

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/golang/chatapp/pkg/utils"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
)

func UploadProfilePic(w http.ResponseWriter, r *http.Request) {
	fmt.Println("File Upload Endpoint Hit")

	// Parse our multipart form, 10 << 20 specifies a maximum
	// upload of 10 MB files.
	r.ParseMultipartForm(10 << 20)
	// FormFile returns the first file for the given key `myFile`
	// it also returns the FileHeader so we can get the Filename,
	// the Header and the size of the file
	file, handler, err := r.FormFile("file")
	if err != nil {
		fmt.Println("Error Retrieving the File")
		fmt.Println(err)
		return
	}
	defer file.Close()
	fmt.Printf("Uploaded File: %+v\n", handler.Filename)
	fmt.Printf("File Size: %+v\n", handler.Size)
	fmt.Printf("MIME Header: %+v\n", handler.Header)

	dir, err := os.Getwd()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	client, ctx, cancel := utils.ConnectDB()
	defer cancel()
	defer client.Disconnect(ctx)
	col := client.Database("chatapp").Collection("users")
	filename := handler.Filename
	params := mux.Vars(r)
	username := params["username"]
	result, insertErr := col.UpdateOne(ctx,
		bson.M{"username": username},
		bson.D{
			{"$set", bson.D{{"profileimg", filename}}},
		},
	)
	fmt.Println(result)
	if insertErr != nil {
		fmt.Println(err)
	}
	fileLocation := filepath.Join(dir, "files", filename)
	targetFile, err := os.OpenFile(fileLocation, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer targetFile.Close()

	if _, err := io.Copy(targetFile, file); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func UploadFile(w http.ResponseWriter, r *http.Request) {
	fmt.Println("File Upload Endpoint Hit")

	// Parse our multipart form, 10 << 20 specifies a maximum
	// upload of 10 MB files.
	r.ParseMultipartForm(10 << 20)
	// FormFile returns the first file for the given key `myFile`
	// it also returns the FileHeader so we can get the Filename,
	// the Header and the size of the file
	file, handler, err := r.FormFile("file")
	if err != nil {
		fmt.Println("Error Retrieving the File")
		fmt.Println(err)
		return
	}
	defer file.Close()
	fmt.Printf("Uploaded File: %+v\n", handler.Filename)
	fmt.Printf("File Size: %+v\n", handler.Size)
	fmt.Printf("MIME Header: %+v\n", handler.Header)

	dir, err := os.Getwd()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// client, ctx, cancel := utils.ConnectDB()
	// defer cancel()
	// defer client.Disconnect(ctx)
	// col := client.Database("chatapp").Collection("users")
	// params := mux.Vars(r)
	// username := params["username"]
	// result, insertErr := col.UpdateOne(ctx,
	// 	bson.M{"username": username},
	// 	bson.D{
	// 		{"$set", bson.D{{"profileimg", filename}}},
	// 	},
	// )
	// fmt.Println(result)
	// if insertErr != nil {
	// 	fmt.Println(err)
	// }
	filename := handler.Filename
	fileLocation := filepath.Join(dir, "files", filename)
	targetFile, err := os.OpenFile(fileLocation, os.O_WRONLY|os.O_CREATE, 0666)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer targetFile.Close()

	if _, err := io.Copy(targetFile, file); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
