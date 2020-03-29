package controllers

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/toshick/ronten-maker/app/context"
	"github.com/toshick/ronten-maker/app/model"
)

type PostLoginReq struct {
	Pass  string `json:"pass"`
	Email string `json:"email"`
}

type PostLoginRes struct {
	Result string `json:"result"`
	Email  string `json:"email"`
}

/**
 * Login
 */
func Login(c echo.Context) error {
	//セッション取得
	sess, _ := session.Get(context.SESSION_KEY, c)

	// loginId := sess.Values["logined"]
	// if loginId != nil && loginId == "yes" {
	//   return c.JSON(http.StatusCreated, &PostLoginRes{Result: "already logined"})
	// }

	// 送信パラメータ取得
	r := new(PostLoginReq)
	if err := c.Bind(r); err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}

	email := r.Email
	pass := r.Pass

	fmt.Printf("そうしん %v %v \n", email, pass)

	// origami.com以外は受け付けない
	// if !strings.HasSuffix(email, "@origami.com") {
	// 	return c.JSON(http.StatusUnauthorized, &model.ApiError{Error: true, Message: "cant accept"})
	// }

	// hash, _ := MakeUserPassHash(pass)
	// データベースのコネクションを開く
	db, err := sql.Open("sqlite3", model.GetDBURL())
	defer db.Close()
	if err != nil {
		return err
	}

	row := db.QueryRow("SELECT id,name,email,pass FROM user where email = ?", email)

	var user model.User
	if err := row.Scan(&user.ID, &user.Name, &user.Email, &user.Pass); err != nil {
		if err == sql.ErrNoRows {
			return c.JSON(http.StatusNotFound, &model.ApiError{Error: true, Message: "user not found:" + email})
		}
		return c.JSON(http.StatusInternalServerError, &model.ApiError{Error: true, Message: "select error"})
	}
	fmt.Printf("userみつけた %+v \n", user)

	ok := CheckUserPassMach(user.Pass, pass)

	// 成功
	if ok {

		// ハッシュをレコードに格納
		hash, err := context.MakeHash()
		if err != nil {
			return c.JSON(http.StatusInternalServerError, &model.ApiError{Error: true, Message: "cant make hash"})
		}
		fmt.Printf("hash:  %v %v \n", hash, user.ID)
		_, err = db.Exec("UPDATE user SET loginhash=? WHERE id=?", hash, user.ID)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, &model.ApiError{Error: true, Message: "cant update"})
		}

		maxAge := 60 * 60 * 24 //秒

		//セッションにデータを保存する
		sess.Options = &sessions.Options{
			Path:     "/",
			MaxAge:   maxAge,
			HttpOnly: true,
		}
		sess.Values["loginhash"] = hash
		sess.Save(c.Request(), c.Response())

		// cookieにログイン状態をセット
		cookie := &http.Cookie{
			Name:   "ronten-logined",
			Value:  "yes",
			MaxAge: maxAge,
			Path:   "/",
		}
		http.SetCookie(c.Response(), cookie)

		return c.JSON(http.StatusOK, &PostLoginRes{Result: "ok", Email: email})
	}

	// エラー
	return c.JSON(http.StatusUnauthorized, &model.ApiError{Error: true, Message: "not valid"})

}

/**
 * LoginedCheck
 */
func LoginedCheck(c echo.Context) error {

	cc := c.(*context.CustomContext)
	user := cc.LoginedUser()
	if user.ID == "" {
		return cc.JSON(http.StatusUnauthorized, &model.ApiError{Error: true, Message: "not logined"})
	}
	return cc.JSON(http.StatusOK, map[string]model.User{"user": user})
}

/**
 * Logout
 */
func Logout(c echo.Context) error {

	//セッション取得
	sess, _ := session.Get(context.SESSION_KEY, c)

	//セッションにデータを保存する
	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   -1, //秒
		HttpOnly: true,
	}
	sess.Values["loginhash"] = ""
	sess.Save(c.Request(), c.Response())

	// cookie
	cookie := &http.Cookie{
		Name:   "ronten-logined",
		Value:  "",
		Path:   "/",
		MaxAge: -1, //秒
	}

	http.SetCookie(c.Response(), cookie)

	return c.JSON(http.StatusOK, &PostLoginRes{Result: "ok"})

}
