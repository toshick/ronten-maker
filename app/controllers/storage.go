package controllers

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"cloud.google.com/go/storage"
	"github.com/labstack/echo/v4"
	_ "github.com/mattn/go-sqlite3"
	"github.com/toshick/ronten-maker/app/model"
	"github.com/toshick/ronten-maker/app/util"
	"google.golang.org/api/option"
	// "github.com/toshick/ronten-maker/app/context"
)

const bucketName = "ronten-bucket"
const projectID = "ronten-maker"

// type PostCreateUserReq struct {
// 	Pass  string `json:"pass"`
// 	Email string `json:"email"`
// 	Name  string `json:"name"`
// }

// type DeleteUserReq struct {
// 	Email string `json:"email"`
// 	ID    string `json:"id"`
// }

/**
 * CreateStorage
 */
func getClient() (*storage.Client, context.Context, error) {
	var client *storage.Client
	var err error
	ctx := context.Background()
	if util.IsDev {
		credentialFilePath := "../credentials/ronten-maker-f7c980a9afeb.json"
		client, err = storage.NewClient(ctx, option.WithCredentialsFile(credentialFilePath))
	} else {
		client, err = storage.NewClient(ctx)
	}

	return client, ctx, err
}

/**
 * CreateStorage
 */
func CreateStorageHandler(c echo.Context) error {
	// Creates a client.
	client, ctx, err := getClient()

	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.NewApiError(fmt.Sprintf("Failed to create client: %v", err)))
	}
	defer client.Close()

	// Creates a Bucket instance.
	bucket := client.Bucket(bucketName)

	// Creates the new bucket.
	ctx, cancel := context.WithTimeout(ctx, time.Second*10)
	defer cancel()
	if err := bucket.Create(ctx, projectID, nil); err != nil {
		str := fmt.Sprintf("Failed to create bucket: %v", err)
		return c.JSON(http.StatusInternalServerError, model.NewApiError(str))
	}

	return c.JSON(http.StatusOK, model.NewApiSuccess(fmt.Sprintf("Bucket %v created.\n", bucketName)))
}

/**
 * AddStorageItem
 */
func AddStorageItemHandler(c echo.Context) error {
	// add text file
	client, err := AddStorageTextFile("test.txt", "this is test text !!!!!!3")
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.NewApiError(fmt.Sprintf("Failed to write file: %v", err)))
	}
	defer client.Close()

	return c.JSON(http.StatusOK, model.NewApiSuccess(fmt.Sprintf("Bucket %v write.\n", bucketName)))
}

/**
 * AddStorageTextFile
 */
func AddStorageTextFile(filename string, str string) (*storage.Client, error) {
	client, ctx, err := getClient()
	if err != nil {
		return nil, err
	}

	// GCS writer
	writer := client.Bucket(bucketName).Object(filename).NewWriter(ctx)
	writer.ContentType = "text/plain"

	// upload : write object body
	if _, err := writer.Write(([]byte)(str)); err != nil {
		return nil, err
	}

	if err := writer.Close(); err != nil {
		return nil, err
	}
	return client, nil
}

/**
 * DownloadDBHandler
 */
func DownloadDBHandler(c echo.Context) error {
	err := downloadDB()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.NewApiError(fmt.Sprintf("Failed to Download DB: %v", err)))
	}
	// defer client.Close()

	return c.JSON(http.StatusOK, model.NewApiSuccess(fmt.Sprintf("DB Download succeed \n")))
}

/**
 * downloadDB
 */
func downloadDB() error {
	return errors.New("(*>△<)<ナーンナーンっっ")
}

/**
 * BackupDBHandler
 */
func BackupDBHandler(c echo.Context) error {
	// add text file
	client, attrs, err := backupDB()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, model.NewApiError(fmt.Sprintf("Failed to backup DB: %v", err)))
	}
	defer client.Close()

	return c.JSON(http.StatusOK, model.NewApiSuccess(fmt.Sprintf("DB Backup succeed '%v'\n", attrs.Name)))
}

/**
 * BackupDB
 */
func backupDB() (*storage.Client, *storage.ObjectAttrs, error) {
	client, ctx, err := getClient()
	if err != nil {
		return nil, nil, err
	}

	source := "db/mydb.sqlite"
	if util.IsDev {
		source = "../db/mydb.sqlite"
	}
	filename := fmt.Sprintf("mydb-%v.sqlite", util.TimeStampStr())

	f, err := os.Open(source)
	if err != nil {
		return nil, nil, err
	}
	defer f.Close()

	obj := client.Bucket(bucketName).Object(fmt.Sprintf("db/%v", filename))
	wc := obj.NewWriter(ctx)
	if _, err = io.Copy(wc, f); err != nil {
		return nil, nil, err
	}
	if err := wc.Close(); err != nil {
		return nil, nil, err
	}

	// if public {
	// 	if err := obj.ACL().Set(ctx, storage.AllUsers, storage.RoleReader); err != nil {
	// 		return nil, nil, err
	// 	}
	// }

	attrs, err := obj.Attrs(ctx)
	if err != nil {
		return nil, nil, err
	}

	return client, attrs, nil
}
