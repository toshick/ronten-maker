.PHONY: dev
dev:
	cd app && \
	DBURL=/Users/toshick/go/src/github.com/toshick/ronten-maker/db/mydb.sqlite \
	HTTPPORT=8888 \
	gin -i -p 3002 run main.go

.PHONY: dummyuser
dummyuser:
	curl -X DELETE -H 'Content-Type:application/json' -H 'X-ronten-header:kaihatsu' -d '{"email":"test@xxx.com" }' http://localhost:8888/api/user/
	curl -H 'Content-Type:application/json' -H 'X-ronten-header:kaihatsu' -d '{"email":"test@xxx.com", "name":"jacobsladder", "pass":"xxx"}' http://localhost:8888/api/user/new

# sample
# goose create add_some_column sql
#
.PHONY: goose_sqlite
goose_sqlite_up:
	goose -dir db/migration sqlite3 db/mydb.sqlite up

goose_sqlite_down:
	goose -dir db/migration sqlite3 db/mydb.sqlite down

.PHONY: test
test:
	go test -v ./app/...

.PHONY: deploy
deploy-gce:
	# wget -O "db/mydb.sqlite" http://ronten.website/api/storage/download
	docker-compose build --no-cache
	docker tag ronten-maker_ronten-app gcr.io/ronten-maker/app3
	gcloud docker -- push gcr.io/ronten-maker/app3
	gcloud compute instances reset ronten-maker --project ronten-maker --zone asia-northeast1-b
	afplay se/save-ja.mp3

# deploy-cloudrun:
# 	docker-compose build
# 	docker tag ronten-maker_ronten-app gcr.io/ronten-maker/app4
# 	gcloud docker -- push gcr.io/ronten-maker/app4
# 	gcloud run deploy --image gcr.io/ronten-maker/app4 --platform managed
# 	afplay se/save-ja.mp3

.PHONY: ci
checkci:
	circleci config validate

ci-build:
	docker-compose build --no-cache
	docker tag ronten-maker_ronten-app gcr.io/ronten-maker/app3

ci-gcr-push:
	gcloud docker -- push gcr.io/ronten-maker/app3
	gcloud compute instances reset ronten-maker --project ronten-maker --zone asia-northeast1-b