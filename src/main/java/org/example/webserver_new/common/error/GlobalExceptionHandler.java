package org.example.webserver_new.common.error;

import org.example.webserver_new.common.success.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<Void>> handleApiException(ApiException exception) {
        ErrorCode errorCode = exception.getErrorCode();

        return ResponseEntity.status(statusOf(errorCode))
                .body(ApiResponse.fail(errorCode));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception exception) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.fail(ErrorCode.INTERNAL_SERVER_ERROR));
    }

    private HttpStatus statusOf(ErrorCode errorCode) {
        int status = errorCode.getCode() / 1000;

        return HttpStatus.resolve(status) == null
                ? HttpStatus.INTERNAL_SERVER_ERROR
                : HttpStatus.valueOf(status);
    }
}
