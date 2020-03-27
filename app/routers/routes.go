package routers

import (
	"fmt"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo"
	"github.com/labstack/echo-contrib/session"
	"github.com/toshick/ronten-maker/app/context"
	"github.com/toshick/ronten-maker/app/controllers"
	"github.com/toshick/ronten-maker/app/model"
)

/**
 * SetRoutes
 */
func SetRoutes() {
	e := echo.New()
	e.Validator = model.NewValidator()

	// session
	e.Use(session.Middleware(sessions.NewCookieStore([]byte("secret"))))

	// e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
	//   AllowOrigins: []string{"http://localhost:8080"},
	//   AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	// }))

	/**
	 * オリジナルコンテキストをセット
	 */
	e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			cc := &context.CustomContext{c}
			return next(cc)
		}
	})

	/**
	 * CheckAuth
	 */
	e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {

			cc := c.(*context.CustomContext)

			if cc.Path() == "/api/login" || cc.Path() == "/api/logout" {
				return next(c)
			}
			rontenHeader := cc.Request().Header.Get("X-Ronten-Header")
			if rontenHeader == "kaihatsu" {
				return next(c)
			}

			// 認証チェック
			user := cc.LoginedUser()
			fmt.Printf("認証チェック %+v  %v \n", user, cc.Path())
			if user.ID == "" {
				return cc.JSON(http.StatusUnauthorized, &model.ApiError{Error: true, Message: "need login"})
			}

			return next(c)
		}
	})

	e.Static("/", "../public")

	// e.GET("/", func(c echo.Context) error {
	//   return c.String(http.StatusOK, "Hello, World!")
	// })

	//----------------------
	// api
	//----------------------
	g := e.Group("/api")
	g.POST("/login", controllers.Login)
	g.GET("/logincheck", controllers.LoginedCheck)
	g.POST("/logout", controllers.Logout)

	// user
	g.POST("/user/new", controllers.CreateUser)
	g.GET("/user/list", controllers.GetUsers)
	g.GET("/user/:id", controllers.GetUser)
	g.DELETE("/user/", controllers.DeleteUserFromEmail)

	// ronten
	g.POST("/ronten/new", controllers.CreateRonten)
	g.GET("/ronten/list", controllers.GetRontenList)
	g.DELETE("/ronten/:id", controllers.DeleteRonten)
	g.PUT("/ronten/:id", controllers.UpdateRonten)

	// project
	// g.POST("/project/new", controllers.CreateProject)

	e.Logger.Fatal(e.Start(":8888"))
}
