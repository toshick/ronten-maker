package model

type ApiError struct {
	Error   bool   `json:"error"`
	Message string `json:"message"`
}

/**
 * NewValidator
 */
func NewApiError(msg string) *ApiError {
	return &ApiError{Error: true, Message: msg}
}

// InternalServerError
var ApiErrorInternalServerError = &ApiError{Error: true, Message: "InternalServerError"}
