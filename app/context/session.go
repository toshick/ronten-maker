package context

import (
	"crypto/rand"
	"encoding/base32"
	"fmt"
	"io"
	"strings"
)

const SESSION_KEY string = "session-ronten"

var letters = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

/**
 * MakeHash
 */
func MakeHash() (string, error) {
	b := make([]byte, 32)
	_, err := io.ReadFull(rand.Reader, b)
	if err != nil {
		fmt.Println("error:", err)
		return "", err
	}

	ret := strings.TrimRight(base32.StdEncoding.EncodeToString(b), "=")
	return ret, nil
}
