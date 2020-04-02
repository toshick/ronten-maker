package util

import (
	"context"
	"fmt"
	"log"

	"cloud.google.com/go/logging"
)

type Logger struct {
	ctx context.Context
}

/**
 * Log
 */
func (c *Logger) Log(str string) {
	if IsDev == true {
		fmt.Printf("log: %v \n", str)
	} else {
		client, err := logging.NewClient(c.ctx, "ronten-maker")
		if err != nil {
			log.Fatalf("Failed to create client: %v", err)
		}
		defer client.Close()
		logger := client.Logger("logName").StandardLogger(logging.Info)
		logger.Printf("log: %v \n", str)
	}
}

var instance = &Logger{ctx: context.Background()}

/**
 * Log
 */
func Log(str string) {
	instance.Log(str)
}
