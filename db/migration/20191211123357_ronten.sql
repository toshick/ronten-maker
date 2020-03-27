-- +goose Up
-- +goose StatementBegin

CREATE TABLE ronten (
    id INTEGER PRIMARY KEY,
    name text,
    user_id INTEGER,
    memo text
);

insert into ronten values(null, 'ろんてん1', 1, 'memoです');


-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE ronten;

-- +goose StatementEnd
