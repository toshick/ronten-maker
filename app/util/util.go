package util

import (
	"time"
)

var IsDev bool = false

// type Env struct {
// 	IsDev bool
// }

func TimeStampStr() string {
	t := time.Now()
	const layout = "2006-01-02-15-04-05"
	return t.Format(layout)
}
