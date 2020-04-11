
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


# sample
# goose create add_some_column sql
#
.PHONY: goose
goose_up:
	goose -dir db/migration sqlite3 db/mydb.sqlite up

goose_down:
	goose -dir db/migration sqlite3 db/mydb.sqlite down


.PHONY: test
test:
	go test -v ./app/...

.PHONY: deploy
deploy:
	docker tag ronten-maker_ronten-app gcr.io/ronten-maker/app3
	# gcloud docker -- push gcr.io/ronten-maker/app3
	gcloud compute instances \
		update-container ronten-maker-6 \
		--project ronten-maker \
		--zone asia-northeast1-a \
		--container-image gcr.io/ronten-maker/app3:latest
		--tags ronten-maker

	gcloud compute firewall-rules create allow-http \
		--project ronten-maker \
		--allow tcp:80 --target-tags ronten-maker

port:
	gcloud compute ssh ronten-maker-6 \
		--project ronten-maker \
		--container gcr.io/ronten-maker/app3:latest \
		--zone asia-northeast1-a \
		-- -N -L 8888:localhost:8888


# gcloud docker -- push gcr.io/ronten-maker/app3
try:
	gcloud docker -- run -it -e PROJECT_ID=ronten-maker --name ronten-maker-7 -p 80:8888 gcr.io/ronten-maker/app3:latest /bin/bash