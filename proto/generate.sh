#!/bin/sh

PLUGIN_TS=../ronten/node_modules/.bin/protoc-gen-ts
PLUGIN_GRPC=../ronten/node_modules/.bin/grpc_tools_node_protoc_plugin
DIST_DIR=../ronten/proto

protoc \
  --js_out=import_style=commonjs,binary:"${DIST_DIR}"/ \
  --ts_out=import_style=commonjs,binary:"${DIST_DIR}"/ \
  --grpc_out="${DIST_DIR}"/ \
  --plugin=protoc-gen-grpc="${PLUGIN_GRPC}" \
  --plugin=protoc-gen-ts="${PLUGIN_TS}" \
  --proto_path=./ \
  -I $DIST_DIR \
  ./*.proto
