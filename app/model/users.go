package model

type User struct {
	ID    string `json:"id" db:"id" validate:"-"`
	Name  string `json:"name" db:"name" validate:"required,min=3,max=20"`
	Email string `json:"email" db:"email" validate:"required,email"`
	Pass  string `json:"pass" db:"pass" validate:"required,min=6,max=30"`
}

// type Users []User

type Users struct {
	Users []User `json:"users"`
}
