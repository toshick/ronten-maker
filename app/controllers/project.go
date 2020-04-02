package controllers

import (
	"database/sql"
	"net/http"

	"github.com/labstack/echo/v4"
	_ "github.com/mattn/go-sqlite3"
	"github.com/toshick/ronten-maker/app/model"
	"github.com/toshick/ronten-maker/app/util"
)

type PostCreateProjectReq struct {
	Hash string `json:"hash"`
	Memo string `json:"memo"`
}

type DeleteProjectReq struct {
	Email string `json:"email"`
	ID    string `json:"id"`
}

/**
 * CreateUser
 */
func CreateProject(c echo.Context) error {
	// ctx := context.Background()
	// client, err := logging.NewClient(ctx, "ronten-maker")
	// if err != nil {
	// 	log.Fatalf("Failed to create client: %v", err)
	// }
	// defer client.Close()
	// logger := client.Logger("logName").StandardLogger(logging.Info)
	// logger.Println("ログをだしてみるぞ")

	util.Log("ログだすよ")

	// 送信パラメータ取得
	r := new(PostCreateProjectReq)
	if err := c.Bind(r); err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	hash := r.Hash
	memo := r.Memo

	util.Log(model.GetDBURL())

	// データベースのコネクションを開く
	db, err := sql.Open("sqlite3", model.GetDBURL())
	defer db.Close()
	if err != nil {
		return err
	}

	query, err := db.Prepare("INSERT INTO project(hash,memo) VALUES(?, ?)")
	if err != nil {
		return err
	}
	result, err := query.Exec(hash, memo)
	if err != nil {
		return err
	}

	insertID, err := result.LastInsertId()
	if err != nil {
		return err
	}

	// 取得
	var createdProject model.Project
	row := db.QueryRow("SELECT * FROM project where id = ?", insertID)
	row.Scan(&createdProject.ID, &createdProject.Hash, &createdProject.Memo)

	return c.JSON(http.StatusCreated, model.ProjectCreated{Created: createdProject})
}
