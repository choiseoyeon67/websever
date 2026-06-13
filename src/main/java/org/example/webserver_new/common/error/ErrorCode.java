package org.example.webserver_new.common.error;

import lombok.Getter;

@Getter
public enum ErrorCode
{
    // Common
    BAD_REQUEST(400000, "Bad Request"),
    UNAUTHORIZED(401000, "Unauthorized"),
    FORBIDDEN(403000, "Forbidden"),
    NOT_FOUND(404000, "Not Found"),
    NOT_FOUND_ENTITY(404001, "Not Found Entity"),
    INTERNAL_SERVER_ERROR(500000, "Internal Server Error"),
    INVALID_VALUE(400001, "Invalid Value"),
    HAS_TOO_MANY_TAG(400002, "5개 이하의 태그만 가능합니다."),
    //Account
    DUPLICATED_LOGIN_ID(400010, "Duplicated Login Id"),
    ACCESS_DENIED(403010, "Access Denied"),
    LOGIN_FAIL(400011, "Login Failed");

    private Integer code;
    private String message;

    ErrorCode(Integer code, String message)
    {
        this.code = code;
        this.message = message;
    }
}