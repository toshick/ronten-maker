package util

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"time"
)

var IsDev bool = false
var IncomingURL string = "https://hooks.slack.com/services/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"

type ReqSlack struct {
	Text      string `json:"text"`
	Username  string `json:"username"`
	IconEmoji string `json:"icon_emoji"`
	IconURL   string `json:"icon_url"`
	Channel   string `json:"channel"`
}

func TimeStampStr() string {
	t := time.Now()
	const layout = "2006-01-02-15-04-05"
	return t.Format(layout)
}

// PostSlack
func PostSlack(channelname string, txt string) (string, error) {
	params := ReqSlack{
		Text:      fmt.Sprintf("%s", txt),
		Username:  "From golang to slack hello",
		IconEmoji: ":gopher:",
		IconURL:   "",
		Channel:   channelname,
	}
	jsonparams, err := json.Marshal(params)
	if err != nil {
		return "", err
	}
	resp, err := http.PostForm(
		IncomingURL,
		url.Values{"payload": {string(jsonparams)}},
	)
	if err != nil {
		return "", err
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	return string(body), nil
}
