package org.example.webserver_new.common.error;

import lombok.Getter;

@Getter
public class ErrorResponse
{

    private final Integer code;
    private final String message;

    private ErrorResponse(ErrorCode errorCode) {
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
    }

    public static ErrorResponse error(ErrorCode errorCode)
    {
        return new ErrorResponse(errorCode);
    }
}