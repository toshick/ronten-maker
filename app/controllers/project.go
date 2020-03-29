package controllers

import (
	"database/sql"
	"net/http"

	"github.com/labstack/echo/v4"
	_ "github.com/mattn/go-sqlite3"
	"github.com/toshick/ronten-maker/app/model"
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
	// 送信パラメータ取得
	r := new(PostCreateProjectReq)
	if err := c.Bind(r); err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	hash := r.Hash
	memo := r.Memo

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
