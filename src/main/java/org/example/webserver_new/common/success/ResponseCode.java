package org.example.webserver_new.common.success;

import lombok.Getter;

@Getter
public enum ResponseCode {

    MEMBER_CREATED(201001, "회원 생성에 성공했습니다."),
    MEMBER_FIND_SUCCESS(200001, "회원 단건 조회에 성공했습니다."),
    MEMBER_LIST_SUCCESS(200002, "회원 목록 조회에 성공했습니다."),
    PROFILE_ENTER(200003, "프로필 조회 성공했습니다"),
    LOGIN_SUCCESS(200010, "로그인에 성공했습니다."),
    LOGOUT_SUCCESS(200011, "로그아웃에 성공했습니다."),
    PROJECT_LIST_SUCCESS(200020, "프로젝트 목록 조회에 성공했습니다."),
    PROJECT_FIND_SUCCESS(200021, "프로젝트 상세 조회에 성공했습니다."),
    PROJECT_CREATED(201020, "프로젝트 생성에 성공했습니다."),
    PROFILE_UPDATED(200030, "프로필 수정에 성공했습니다."),
    PROFILE_IMAGE_UPDATED(200031, "프로필 이미지 수정에 성공했습니다."),
    APPLICATION_CREATED(201040, "지원서 제출에 성공했습니다."),
    APPLICATION_LIST_SUCCESS(200041, "지원서 목록 조회에 성공했습니다."),
    APPLICATION_FIND_SUCCESS(200042, "지원서 상세 조회에 성공했습니다.");

    private final Integer code;
    private final String message;

    ResponseCode(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
