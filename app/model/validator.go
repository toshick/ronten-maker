package model

import (
	"github.com/labstack/echo/v4"
	validator "gopkg.in/go-playground/validator.v9"
)

/**
 * Validator
 */
type Validator struct {
	validator *validator.Validate
}

/**
 * NewValidator
 */
func NewValidator() echo.Validator {
	return &Validator{validator: validator.New()}
}

// Validate
func (v *Validator) Validate(i interface{}) error {

	v.validator.RegisterValidation("hogehoge", validateHoge)

	return v.validator.Struct(i)
}

/**
 * validateHoge
 */
func validateHoge(fl validator.FieldLevel) bool {
	return fl.Field().String() == "hogehoge"
}
