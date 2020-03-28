package controllers

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/labstack/echo"
	_ "github.com/mattn/go-sqlite3"
	"github.com/toshick/ronten-maker/app/model"
)

type UpdateRontenReq struct {
	Memo string `json:"memo" validate:"required"`
	Name string `json:"name" validate:"required"`
}

/**
 * CreateRonten
 */
func CreateRonten(c echo.Context) error {
	// 送信パラメータ取得
	r := new(model.Ronten)

	if err := c.Bind(r); err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	// validate
	errors := c.Validate(r)
	if errors != nil {
		return c.JSON(http.StatusBadRequest, model.NewApiError(errors.Error()))
	}

	userID := r.UserID
	memo := r.Memo
	name := r.Name
	hash := r.ProjectHash
	fmt.Printf("CreateRonten  %v %v %v \n", userID, memo, hash)

	// データベースのコネクションを開く
	db, err := sql.Open("sqlite3", model.DBURL)
	defer db.Close()
	if err != nil {
		return err
	}

	query, err := db.Prepare("INSERT INTO ronten(name,user_id,memo,project_hash) VALUES(?, ?, ?, ?)")
	if err != nil {
		return err
	}
	result, err := query.Exec(name, userID, memo, hash)
	if err != nil {
		return err
	}

	insertID, err := result.LastInsertId()
	if err != nil {
		return err
	}

	// 取得
	var createdRonten model.Ronten
	row := db.QueryRow("SELECT * FROM ronten where id = ?", insertID)
	row.Scan(&createdRonten.ID, &createdRonten.Name, &createdRonten.UserID, &createdRonten.Memo, &createdRonten.ProjectHash)

	return c.JSON(http.StatusCreated, model.RontenCreated{Created: createdRonten})
}

/**
 * e.GET("/users/:id", getUser)
 */
// func GetRonten(c echo.Context) error {

//   // 自作コンテキスト取得
//   cc := c.(*context.CustomContext)
//   bar := cc.Bar()

//   log.Printf("bar: %+v", bar)

//   // User ID from path `users/:id`
//   id := c.Param("id")

//   u := &model.User{ID: id}
//   if err := c.Bind(u); err != nil {
//     return err
//   }

//   return c.JSON(http.StatusCreated, u)
// }

/**
 * DeleteRonten
 */
func DeleteRonten(c echo.Context) error {
	// パラメータ取得
	rontenID := c.Param("id")

	// データベースのコネクションを開く
	db, err := sql.Open("sqlite3", model.DBURL)
	defer db.Close()
	if err != nil {
		return err
	}

	query, err := db.Prepare("DELETE FROM ronten WHERE id = ?")
	if err != nil {
		return err
	}
	if _, err := query.Exec(rontenID); err != nil {
		return err
	}

	return c.JSON(http.StatusAccepted, map[string]string{"result": "ok"})

}

/**
 * UpdateRonten
 */
func UpdateRonten(c echo.Context) error {
	// 送信パラメータ取得
	r := new(model.Ronten)
	if err := c.Bind(r); err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	// validate
	errors := c.Validate(r)
	if errors != nil {
		return c.JSON(http.StatusBadRequest, model.NewApiError(errors.Error()))
	}

	rontenID := r.ID
	memo := r.Memo
	name := r.Name

	// データベースのコネクションを開く
	db, err := sql.Open("sqlite3", model.DBURL)
	defer db.Close()
	if err != nil {
		return err
	}

	query, err := db.Prepare("UPDATE ronten SET name = ?, memo = ? WHERE id = ?")
	if err != nil {
		return err
	}
	if _, err := query.Exec(name, memo, rontenID); err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	return c.JSON(http.StatusAccepted, map[string]string{"result": "ok"})

}

/**
 * /GetRontenList
 */
func GetRontenList(c echo.Context) error {

	// パラメータ取得
	hash := c.Param("hash")

	if hash == "" {
		return c.JSON(http.StatusBadRequest, &model.ApiError{Error: true, Message: "cant find hash"})
	}

	rontenlist := []model.Ronten{}

	// データベースのコネクションを開く
	db, err := sql.Open("sqlite3", model.DBURL)
	defer db.Close()
	if err != nil {
		return err
	}

	q := fmt.Sprintf(`SELECT * FROM ronten WHERE project_hash="%s" ORDER BY id DESC`, hash)
	rows, err := db.Query(q)
	if err != nil {
		return err
	}

	for rows.Next() {
		var r model.Ronten

		// 値を取得
		if err := rows.Scan(&r.ID, &r.Name, &r.UserID, &r.Memo, &r.ProjectHash); err != nil {
			return err
		}

		rontenlist = append(rontenlist, r)
	}

	ret := model.RontenList{List: rontenlist}

	return c.JSON(http.StatusOK, ret)
}
