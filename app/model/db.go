package model

import (
	"os"
)

func GetDBURL() string {
	url := os.Getenv("DBURL")
	return url
}

/**
 * TrashScanner
 */
type TrashScanner struct{}

func (TrashScanner) Scan(interface{}) error {
	return nil
}
