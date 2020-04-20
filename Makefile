
.PHONY: proto
proto:
	cd proto && ./generate.sh

proto2:
	cd proto && ./generate2.sh

.PHONY: dev
dev:
	cd app && \
	DBURL=/Users/toshick/go/src/github.com/toshick/ronten-maker/db/mydb.sqlite \
	HTTPPORT=8888 \
	gin -i -p 3002 run main.go


.PHONY: dummyuser
dummyuser:
	curl -X DELETE -H 'Content-Type:application/json' -H 'X-ronten-header:kaihatsu' -d '{"email":"test@origami.com" }' http://localhost:8888/api/user/
	curl -H 'Content-Type:application/json' -H 'X-ronten-header:kaihatsu' -d '{"email":"test@origami.com", "name":"jacobsladder", "pass":"xxx"}' http://localhost:8888/api/user/new

.PHONY: strage
dummystorage:
	curl -X POST http://localhost:8888/api/storage/new
dummystorage-itemadd:
	curl -X POST http://localhost:8888/api/storage/add
dummystorage-bk:
	# curl -X POST http://localhost:8888/api/storage/backup
	curl -X POST http://34.84.39.70:8888/api/storage/backup

# sample
# goose create add_some_column sql
#
.PHONY: goose_sqlite
goose_sqlite_up:
	goose -dir db/migration sqlite3 db/mydb.sqlite up

goose_sqlite_down:
	goose -dir db/migration sqlite3 db/mydb.sqlite down

# sample
# goose create add_some_column sql
#
.PHONY: goose_cloudsql
goose_cloudsql_up:
  goose -dir db/migration postgres "user=postgres dbname=myao sslmode=disable password=root host=camaleao-postgres" up


.PHONY: test
test:
	go test -v ./app/...

.PHONY: deploy
deploy-gce:
	docker-compose build
	docker tag ronten-maker_ronten-app gcr.io/ronten-maker/app3
	gcloud docker -- push gcr.io/ronten-maker/app3
	gcloud compute instances reset ronten-maker --project ronten-maker --zone asia-northeast1-b
	afplay se/save-ja.mp3

deploy-cloudrun:
	docker-compose build
	docker tag ronten-maker_ronten-app gcr.io/ronten-maker/app3
	gcloud docker -- push gcr.io/ronten-maker/app3
	gcloud run deploy --image gcr.io/ronten-maker/app3 --platform managed
	afplay se/save-ja.mp3

port:
	gcloud compute ssh ronten-maker-6 \
		--project ronten-maker \
		--container gcr.io/ronten-maker/app3:latest \
		--zone asia-northeast1-a \
		-- -N -L 8888:localhost:8888


# gcloud docker -- push gcr.io/ronten-maker/app3
try:
	gcloud docker -- run -it -e PROJECT_ID=ronten-maker --name ronten-maker-7 -p 80:8888 gcr.io/ronten-maker/app3:latest /bin/bash
	gcloud beta run deploy --image gcr.io/ronten-maker/app3:latest