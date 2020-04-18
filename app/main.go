package main

import (
	"os"
	"time"

	"github.com/toshick/ronten-maker/app/routers"
	"github.com/toshick/ronten-maker/app/util"
)

/**
 * main
 */
func main() {
	// jst
	time.Local = time.FixedZone("Local", -8*60*60)

	// port
	if os.Getenv("HTTPPORT") == "8888" {
		util.IsDev = true
	}

	routers.SetRoutes()
}
