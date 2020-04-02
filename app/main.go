package main

import (
	"os"

	"github.com/toshick/ronten-maker/app/routers"
	"github.com/toshick/ronten-maker/app/util"
)

/**
 * main
 */
func main() {

	if os.Getenv("HTTPPORT") == "8888" {
		util.IsDev = true
	}

	routers.SetRoutes()

}
