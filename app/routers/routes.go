package routers

import (
	"fmt"
	"os"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
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
			// user := cc.LoginedUser()
			// fmt.Printf("認証チェック %+v  %v \n", user, cc.Path())
			// if user.ID == "" {
			// 	return cc.JSON(http.StatusUnauthorized, &model.ApiError{Error: true, Message: "need login"})
			// }

			return next(c)
		}
	})

	// routing for front
	e.Static("/", "./public")
	e.File("/discussion/:hash", "./public/index.html")

	// e.GET("/discussion/:hash", func(c echo.Context) error {
	// 	return c.String(http.StatusOK, "/discussion/:hash")
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
	g.GET("/ronten/list/:hash", controllers.GetRontenList)
	g.DELETE("/ronten/:id", controllers.DeleteRonten)
	g.PUT("/ronten/:id", controllers.UpdateRonten)

	// project
	g.POST("/project/new", controllers.CreateProject)

	port := "8888"
	p := os.Getenv("HTTPPORT")
	if p != "" {
		port = p
	}
	fmt.Printf("port %v \n", port)

	port = fmt.Sprintf(":%s", port)

	e.Logger.Fatal(e.Start(port))
}
