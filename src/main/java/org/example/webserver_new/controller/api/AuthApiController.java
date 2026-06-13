package org.example.webserver_new.controller.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.webserver_new.common.success.ApiResponse;
import org.example.webserver_new.common.success.ResponseCode;
import org.example.webserver_new.dto.api.ApiDtos.LoginRequest;
import org.example.webserver_new.dto.api.ApiDtos.UserResponse;
import org.example.webserver_new.service.AuthApiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "인증 API", description = "세션 기반 로그인, 로그아웃, 내 정보 조회를 담당합니다.")
public class AuthApiController {

    private final AuthApiService authApiService;

    // 개발자/의뢰인 공통 로그인: 성공 시 세션에 로그인 사용자를 저장한다.
    @Operation(summary = "로그인", description = "이메일 또는 로그인 ID와 비밀번호로 로그인하고 세션을 생성합니다.")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(ResponseCode.LOGIN_SUCCESS, authApiService.login(request, httpRequest))
        );
    }

    // 개발자/의뢰인 공통 로그아웃: 현재 세션을 만료시킨다.
    @Operation(summary = "로그아웃", description = "현재 로그인 세션을 만료시킵니다.")
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request) {
        authApiService.logout(request);
        return ResponseEntity.ok(ApiResponse.success(ResponseCode.LOGOUT_SUCCESS));
    }

    // 개발자/의뢰인 공통 내 정보 조회: 세션에 저장된 사용자 정보를 반환한다.
    @Operation(summary = "내 정보 조회", description = "현재 세션에 로그인된 사용자 정보를 조회합니다.")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me(HttpServletRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(ResponseCode.MEMBER_FIND_SUCCESS, authApiService.me(request))
        );
    }
}
