FROM golang:1.13.4

LABEL maintainer "toshick"

ENV PATH $PATH:/usr/local/go/bin
ENV GO111MODULE on
ENV GO_ENV prd

ADD . /go/src/github.com/ronten-maker/
WORKDIR /go/src/github.com/ronten-maker/

CMD ["/usr/local/go/bin/go", "run", "/go/src/github.com/ronten-maker/app/main.go"]
# CMD ["/bin/bash"]