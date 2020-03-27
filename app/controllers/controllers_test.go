package controllers

import (
	"testing"

	_ "github.com/mattn/go-sqlite3"
)

func TestMain(m *testing.M) {

	println("[test start]")

	m.Run()
	println("[test finish]")
}

func TestStart(t *testing.T) {

}

func TestStart2(t *testing.T) {

	// t.Fatal("failed test")

	t.Log("TestStart2 Finish")
}
