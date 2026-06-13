package org.example.webserver_new.common.success;

import lombok.Getter;
import org.example.webserver_new.common.error.ErrorCode;

@Getter
public class ApiResponse<T> {

    private final Integer code;
    private final String message;
    private final T data;

    private ApiResponse(ResponseCode responseCode, T data)
    {
        this.code = responseCode.getCode();
        this.message = responseCode.getMessage();
        this.data = data;
    }
    private ApiResponse(ErrorCode errorCode)
    {
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
        this.data = null;
    }

    public static <T> ApiResponse<T> success(ResponseCode responseCode, T data)
    {
        return new ApiResponse<>(responseCode, data);
    }

    public static ApiResponse<Void> success(ResponseCode responseCode)
    {
        return new ApiResponse<>(responseCode, null);
    }

    public static <T> ApiResponse<T> fail (ErrorCode errorCode)
    {
        return new ApiResponse<>(errorCode);
    }
}