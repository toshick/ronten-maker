FROM golang:1.13.4

ENV GO111MODULE=on

WORKDIR /go/src/hello-grpc-web/server
COPY . .
# RUN go get github.com/pilu/fresh
# CMD ["fresh"]
CMD ["go", "run", "main.go"]
EXPOSE 9090
