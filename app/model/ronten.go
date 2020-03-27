package model

type Ronten struct {
	ID          string `json:"id" db:"id" validate:"-"`
	Name        string `json:"name" db:"name" validate:"required,min=1,max=30"`
	UserID      int    `json:"user_id" db:"user_id" validate:"required"`
	Memo        string `json:"memo" db:"memo" validate:"-"`
	ProjectHash string `json:"project_hash" db:"project_hash" validate:"-"`
}

type RontenList struct {
	List []Ronten `json:"list"`
}

type RontenCreated struct {
	Created Ronten `json:"created"`
}
