package org.example.webserver_new.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.example.webserver_new.common.error.ApiException;
import org.example.webserver_new.common.error.ErrorCode;
import org.example.webserver_new.dto.api.ApiDtos.LoginRequest;
import org.example.webserver_new.dto.api.ApiDtos.UserResponse;
import org.example.webserver_new.entity.Role;
import org.example.webserver_new.entity.User;
import org.example.webserver_new.validation.SessionConst;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
// 인증/세션 공통 서비스: 로그인 사용자 조회와 역할 검사를 API 서비스들이 재사용한다.
public class AuthApiService {

    private final LoginService loginService;

    public UserResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        User loginUser = loginService.login(request.email(), request.password());

        if (loginUser == null) {
            throw new ApiException(ErrorCode.LOGIN_FAIL);
        }

        HttpSession session = httpRequest.getSession();
        session.setAttribute(SessionConst.LOGIN_USER, loginUser);

        return UserResponse.from(loginUser);
    }

    public void logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }
    }

    public UserResponse me(HttpServletRequest request) {
        return UserResponse.from(requiredUser(request));
    }

    public User requiredUser(HttpServletRequest request) {
        User user = currentUser(request);

        if (user == null) {
            throw new ApiException(ErrorCode.UNAUTHORIZED);
        }

        return user;
    }

    public User requiredRole(HttpServletRequest request, Role role) {
        User user = requiredUser(request);

        if (user.getRole() != role) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }

        return user;
    }

    public User currentUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session == null) {
            return null;
        }

        return (User) session.getAttribute(SessionConst.LOGIN_USER);
    }
}
