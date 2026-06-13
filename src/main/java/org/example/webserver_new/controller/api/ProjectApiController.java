package org.example.webserver_new.controller.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.webserver_new.common.success.ApiResponse;
import org.example.webserver_new.common.success.ResponseCode;
import org.example.webserver_new.dto.api.ApiDtos.ApplicationRequest;
import org.example.webserver_new.dto.api.ApiDtos.ApplicationResponse;
import org.example.webserver_new.dto.api.ApiDtos.ProjectResponse;
import org.example.webserver_new.service.ProjectApiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "프로젝트 공개 API", description = "개발자 랜딩 페이지의 프로젝트 검색, 상세 조회, 지원서 제출을 담당합니다.")
public class ProjectApiController {

    private final ProjectApiService projectApiService;

    // 개발자 랜딩 페이지: 프로젝트 형태, 상태, 정렬, 페이지 조건으로 프로젝트를 검색한다.
    @Operation(summary = "프로젝트 목록 조회", description = "프로젝트 형태/상태 필터, 정렬, 페이지네이션을 서버에서 처리합니다.")
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> projects(
            @RequestParam(required = false) String employmentType,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(ResponseCode.PROJECT_LIST_SUCCESS,
                        projectApiService.projects(employmentType, status, sort, page, size))
        );
    }

    // 개발자 랜딩 페이지: 선택한 프로젝트의 요약 탭 정보를 조회한다.
    @Operation(summary = "프로젝트 상세 조회", description = "프로젝트 상세 화면의 요약 탭에 필요한 정보를 조회합니다.")
    @GetMapping("/{projectId}")
    public ResponseEntity<ApiResponse<ProjectResponse>> project(@PathVariable Long projectId) {
        return ResponseEntity.ok(
                ApiResponse.success(ResponseCode.PROJECT_FIND_SUCCESS, projectApiService.project(projectId))
        );
    }

    // 호환용 지원서 제출 API: 기존 요구 URL이 GET으로 적혀 있어 기본 지원서를 생성한다.
    @Operation(summary = "프로젝트 지원서 제출 GET 호환", description = "요구 URL 표의 GET 방식과 호환하기 위한 기본 지원서 제출 API입니다. 실제 입력 제출은 POST 사용을 권장합니다.")
    @GetMapping("/{projectId}/applications")
    public ResponseEntity<ApiResponse<ApplicationResponse>> apply(
            @PathVariable Long projectId,
            HttpServletRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(ResponseCode.APPLICATION_CREATED, projectApiService.apply(projectId, request))
        );
    }

    // 개발자 프로젝트 지원: 도급/상주 입력값을 받아 지원서를 생성 또는 갱신한다.
    @Operation(summary = "프로젝트 지원서 제출", description = "지원서 내용을 저장합니다. 이메일 또는 전화번호가 포함되면 에러 코드를 반환합니다.")
    @PostMapping("/{projectId}/applications")
    public ResponseEntity<ApiResponse<ApplicationResponse>> submitApplication(
            @PathVariable Long projectId,
            @RequestBody ApplicationRequest applicationRequest,
            HttpServletRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(ResponseCode.APPLICATION_CREATED,
                        projectApiService.submitApplication(projectId, applicationRequest, request))
        );
    }
}
