-- +goose Up
-- SQL in this section is executed when the migration is applied.

CREATE TABLE project
(
  id INTEGER PRIMARY KEY,
  hash text,
  memo text
);

ALTER TABLE ronten ADD COLUMN project_hash text DEFAULT "";

-- +goose Down
-- SQL in this section is executed when the migration is rolled back.

DROP TABLE project;

