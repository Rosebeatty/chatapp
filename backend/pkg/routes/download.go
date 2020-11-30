package routes

import (
	"net/http"
)

// DownloadFile will download a url and store it in local filepath.
// It writes to the destination file as it downloads it, without
// loading the entire file into memory.
func DownloadFile(w http.ResponseWriter, r *http.Request, url string, filename string) {
	// Create the file
	// out, err := os.Create(filepath)
	// if err != nil {
	// 	return err
	// }
	// defer out.Close()
	// fmt.Println(out)
	// // Get the data
	// resp, err := http.Get(url)
	// if err != nil {
	// 	return err
	// }
	// fmt.Println(resp.Body)
	// defer resp.Body.Close()

	// // Write the body to file
	// _, err = io.Copy(out, resp.Body)
	// if err != nil {
	// 	return err
	// }
	// dir, err := os.Getwd()
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// }
	// fileLocation := filepath.Join(dir, "files", filename)
	// os.Open(fileLocation, os.O_WRONLY|os.O_CREATE, 0666)
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// }

	// os.Open(filepath)

	// return nil

}
