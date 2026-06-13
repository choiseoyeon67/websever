package org.example.webserver_new.controller.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.webserver_new.common.success.ApiResponse;
import org.example.webserver_new.common.success.ResponseCode;
import org.example.webserver_new.dto.api.ApiDtos.ApplicationResponse;
import org.example.webserver_new.dto.api.ApiDtos.DeveloperApplicationResponse;
import org.example.webserver_new.dto.api.ApiDtos.ProfileRequest;
import org.example.webserver_new.dto.api.ApiDtos.ProfileResponse;
import org.example.webserver_new.service.DeveloperApiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/developer")
@RequiredArgsConstructor
@Tag(name = "개발자 API", description = "개발자 마이페이지의 프로필 관리와 지원 프로젝트/지원서 조회를 담당합니다.")
public class DeveloperApiController {

    private final DeveloperApiService developerApiService;

    // 개발자 마이페이지: 로그인한 개발자의 프로필 정보를 조회한다.
    @Operation(summary = "개발자 프로필 조회", description = "현재 로그인한 개발자의 프로필 정보를 조회합니다. 없으면 빈 프로필을 생성해 반환합니다.")
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> profile(HttpServletRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(ResponseCode.PROFILE_ENTER, developerApiService.profile(request))
        );
    }

    // 개발자 마이페이지: 기본 정보와 검색태그를 수정한다.
    @Operation(summary = "개발자 프로필 수정", description = "프로필 기본 정보를 수정합니다. 검색태그는 최대 5개까지만 허용합니다.")
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            @RequestBody ProfileRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(ResponseCode.PROFILE_UPDATED,
                        developerApiService.updateProfile(request, httpRequest))
        );
    }

    // 개발자 마이페이지: multipart 이미지 파일을 서버 로컬 폴더에 저장하고 DB에는 파일명만 저장한다.
    @Operation(summary = "프로필 이미지 업로드 / 업데이트", description = "multipart/form-data로 받은 프로필 이미지를 서버에 저장하고 이미지 조회 URL을 반환합니다.")
    @PostMapping("/profile/image")
    public ResponseEntity<ApiResponse<ProfileResponse>> uploadImage(
            @RequestParam("image") MultipartFile image,
            HttpServletRequest request
    ) throws IOException {
        return ResponseEntity.ok(
                ApiResponse.success(ResponseCode.PROFILE_IMAGE_UPDATED,
                        developerApiService.uploadImage(image, request))
        );
    }

    // 개발자 마이페이지: 내가 지원한 프로젝트 목록과 요약 정보를 조회한다.
    @Operation(summary = "내 지원 프로젝트 목록 조회", description = "현재 개발자가 지원한 프로젝트 목록을 프로젝트 제목, 견적, 지원자 수, 과업일수와 함께 조회합니다.")
    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<List<DeveloperApplicationResponse>>> applications(HttpServletRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(ResponseCode.APPLICATION_LIST_SUCCESS,
                        developerApiService.applications(request))
        );
    }

    // 개발자 마이페이지: 내가 작성한 특정 지원서의 입력 내용을 조회한다.
    @Operation(summary = "내 지원서 상세 조회", description = "현재 개발자가 작성한 특정 지원서 상세 내용을 조회합니다.")
    @GetMapping("/applications/{applicationId}")
    public ResponseEntity<ApiResponse<ApplicationResponse>> application(
            @PathVariable Long applicationId,
            HttpServletRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(ResponseCode.APPLICATION_FIND_SUCCESS,
                        developerApiService.application(applicationId, request))
        );
    }
}
