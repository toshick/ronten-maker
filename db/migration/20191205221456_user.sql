-- +goose Up
-- +goose StatementBegin

CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    name text,
    email text,
    pass text,
    loginhash text
);

insert into user values(null, 'Yamada1', '111@dummy.com', 'pass11111', '');
insert into user values(null, 'Yamada2', '222@dummy.com', 'pass22222', '');


-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TABLE user;

-- +goose StatementEnd
