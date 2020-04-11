package controllers

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"cloud.google.com/go/storage"
	"github.com/labstack/echo/v4"
	_ "github.com/mattn/go-sqlite3"
	"github.com/toshick/ronten-maker/app/context"
)

type PostCreateUserReq struct {
	Pass  string `json:"pass"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

type DeleteUserReq struct {
	Email string `json:"email"`
	ID    string `json:"id"`
}

/**
 * CreateStorage
 */
func CreateStorage(c echo.Context) error {
	ctx := context.Background()

	// Sets your Google Cloud Platform project ID.
	projectID := "YOUR_PROJECT_ID"

	// Creates a client.
	client, err := storage.NewClient(ctx)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}

	// Sets the name for the new bucket.
	bucketName := "my-new-bucket"

	// Creates a Bucket instance.
	bucket := client.Bucket(bucketName)

	// Creates the new bucket.
	ctx, cancel := context.WithTimeout(ctx, time.Second*10)
	defer cancel()
	if err := bucket.Create(ctx, projectID, nil); err != nil {
		log.Fatalf("Failed to create bucket: %v", err)
	}

	fmt.Printf("Bucket %v created.\n", bucketName)

	return c.JSON(http.StatusCreated, ret)
}
