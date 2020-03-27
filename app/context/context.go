package context

import (
	"database/sql"

	"github.com/labstack/echo"
	"github.com/labstack/echo-contrib/session"
	"github.com/toshick/ronten-maker/app/model"
)

/**
 * CustomContext
 */
type CustomContext struct {
	echo.Context
}

/**
 * LoginedUser
 */
func (c *CustomContext) LoginedUser() model.User {
	var logineduser model.User

	sess, _ := session.Get(SESSION_KEY, c)
	loginhash := sess.Values["loginhash"]

	db, err := sql.Open("sqlite3", model.DBURL)
	defer db.Close()
	if err != nil {
		return logineduser
	}

	row := db.QueryRow("SELECT id,name,email FROM user where loginhash = ?", loginhash)
	row.Scan(&logineduser.ID, &logineduser.Name, &logineduser.Email)

	return logineduser
}

/**
 * Bar
 */
func (c *CustomContext) Bar() string {
	return "bar"
}
