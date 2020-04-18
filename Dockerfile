# front
FROM node:13.8 as front
LABEL maintainer "toshick"

ADD . /go/src/github.com/ronten-maker/
WORKDIR /go/src/github.com/ronten-maker/front-ronten

RUN npm ci && npm run generate

# golang
FROM golang:1.13.4
LABEL maintainer "toshick"

ENV PATH $PATH:/usr/local/go/bin
ENV GO111MODULE on
ENV GO_ENV prd
ENV DBURL /go/src/github.com/ronten-maker/db/mydb.sqlite

ADD . /go/src/github.com/ronten-maker/
WORKDIR /go/src/github.com/ronten-maker/

# RUN make goose_up

COPY --from=front /go/src/github.com/ronten-maker/front-ronten/dist /go/src/github.com/ronten-maker/public

CMD ["/usr/local/go/bin/go", "run", "/go/src/github.com/ronten-maker/app/main.go"]
# CMD ["/bin/bash"]