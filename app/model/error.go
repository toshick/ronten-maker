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

type ApiSuccess struct {
	Result  string `json:"result"`
	Message string `json:"message"`
}

/**
 * NewApiSuccess
 */
func NewApiSuccess(msg string) *ApiSuccess {
	return &ApiSuccess{Result: "ok", Message: msg}
}

// InternalServerError
var ApiErrorInternalServerError = &ApiError{Error: true, Message: "InternalServerError"}
