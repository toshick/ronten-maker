package controllers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	_ "github.com/mattn/go-sqlite3"
	"github.com/toshick/ronten-maker/app/context"
	"github.com/toshick/ronten-maker/app/model"
	"golang.org/x/crypto/bcrypt"
)

/**
 * ハッシュ化したパスワードを返却
 */
func MakeUserPassHash(pass string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(pass), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), err
}

/**
 * パスワードが正しいかチェック
 */
func CheckUserPassMach(hash, pass string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(pass)) == nil
}

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
 * CreateUser
 */
func CreateUser(c echo.Context) error {
	// 送信パラメータ取得
	r := new(PostCreateUserReq)
	if err := c.Bind(r); err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	email := r.Email
	pass := r.Pass
	name := r.Name
	fmt.Printf("CreateUser  %v %v %v \n", email, pass, name)

	// パスワードをhash化
	hash, _ := MakeUserPassHash(pass)

	// データベースのコネクションを開く
	db, err := sql.Open("sqlite3", model.GetDBURL())
	defer db.Close()
	if err != nil {
		return err
	}

	query, err := db.Prepare("INSERT INTO user(name,email,pass) VALUES(?, ?, ?)")
	if err != nil {
		return err
	}
	if _, err := query.Exec(name, email, hash); err != nil {
		return err
	}

	ret := &model.User{Name: name}

	return c.JSON(http.StatusCreated, ret)
}

/**
 * e.GET("/users/:id", getUser)
 */
func GetUser(c echo.Context) error {

	// 自作コンテキスト取得
	cc := c.(*context.CustomContext)
	bar := cc.Bar()

	log.Printf("bar: %+v", bar)

	// User ID from path `users/:id`
	id := c.Param("id")

	u := &model.User{ID: id}
	if err := c.Bind(u); err != nil {
		return err
	}

	return c.JSON(http.StatusCreated, u)
}

/**
 * DeleteUser
 */
func DeleteUser(c echo.Context) error {

	// パラメータ取得
	userID := c.Param("user_id")
	if userID == "" {
		return c.JSON(http.StatusBadRequest, &model.ApiError{Error: true, Message: "cant find user"})
	}

	// データベースのコネクションを開く
	db, err := sql.Open("sqlite3", model.GetDBURL())
	defer db.Close()
	if err != nil {
		return err
	}

	query, err := db.Prepare("DELETE FROM user WHERE id = ?")
	if err != nil {
		return err
	}
	if _, err := query.Exec(userID); err != nil {
		return err
	}

	return c.JSON(http.StatusAccepted, map[string]string{"result": "ok"})
}

/**
 * DeleteUser
 */
func DeleteUserFromEmail(c echo.Context) error {

	// 送信パラメータ取得
	r := new(DeleteUserReq)
	if err := c.Bind(r); err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	userEmail := r.Email
	log.Printf("userEmail %+v", userEmail)
	if userEmail == "" {
		return c.JSON(http.StatusBadRequest, &model.ApiError{Error: true, Message: "cant find user"})
	}

	// データベースのコネクションを開く
	db, err := sql.Open("sqlite3", model.GetDBURL())
	defer db.Close()
	if err != nil {
		return err
	}

	query, err := db.Prepare("DELETE FROM user WHERE email = ?")
	if err != nil {
		return err
	}
	if _, err := query.Exec(userEmail); err != nil {
		return err
	}

	return c.JSON(http.StatusAccepted, map[string]string{"result": "ok"})
}

/**
 * /users
 */
func GetUsers(c echo.Context) error {

	var users []model.User

	// データベースのコネクションを開く
	db, err := sql.Open("sqlite3", model.GetDBURL())
	defer db.Close()
	if err != nil {
		return err
	}

	rows, err := db.Query(
		`SELECT id, name, email FROM user`,
	)
	defer rows.Close()
	if err != nil {
		return err
	}

	for rows.Next() {
		var user model.User

		// 値を取得
		if err := rows.Scan(&user.ID, &user.Name, &user.Email); err != nil {
			return err
		}

		users = append(users, user)
	}

	ret := model.Users{Users: users}
	// if err := c.Bind(ret); err != nil {
	// 	return err
	// }

	return c.JSON(http.StatusCreated, ret)
}
