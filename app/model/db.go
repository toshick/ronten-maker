package model

const DBURL string = "/Users/toshick/go/src/github.com/toshick/ronten-maker/db/mydb.sqlite"

/**
 * TrashScanner
 */
type TrashScanner struct{}

func (TrashScanner) Scan(interface{}) error {
	return nil
}
