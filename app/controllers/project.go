package controllers

import (
	_ "github.com/mattn/go-sqlite3"
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
// func CreateProject(c echo.Context) error {
// 	// 送信パラメータ取得
// 	r := new(PostCreateProjectReq)
// 	if err := c.Bind(r); err != nil {
// 		return c.JSON(http.StatusInternalServerError, err)
// 	}

// 	hash := r.Hash
// 	memo := r.Memo
// 	fmt.Printf("CreateProject  %v %v %v \n", hash)

// 	// データベースのコネクションを開く
// 	db, err := sql.Open("sqlite3", model.DBURL)
// 	defer db.Close()
// 	if err != nil {
// 		return err
// 	}

// 	query, err := db.Prepare("INSERT INTO project(hash,memo) VALUES(?, ?)")
// 	if err != nil {
// 		return err
// 	}
// 	if _, err := query.Exec(hash, memo); err != nil {
// 		return err
// 	}

// 	ret := &model.Project{Hash: hash, Memo: memo}

// 	return c.JSON(http.StatusCreated, ret)
// }
