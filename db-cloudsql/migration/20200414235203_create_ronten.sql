-- +goose Up
-- SQL in this section is executed when the migration is applied.

CREATE TABLE ronten (id INTEGER PRIMARY KEY,
                                        name text, memo text, project_hash text);

-- +goose Down
-- SQL in this section is executed when the migration is rolled back.

DROP TABLE ronten;