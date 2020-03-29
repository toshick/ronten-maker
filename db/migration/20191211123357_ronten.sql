-- +goose Up
-- +goose StatementBegin

CREATE TABLE ronten
(
  id INTEGER PRIMARY KEY,
  name text,
  memo text,
  project_hash text
);

insert into ronten
values(null, 'ろんてん1', 'memoです', 'xxx');


-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE ronten;

-- +goose StatementEnd
