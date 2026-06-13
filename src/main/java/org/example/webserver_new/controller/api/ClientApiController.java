package org.example.webserver_new.controller.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.webserver_new.common.success.ApiResponse;
import org.example.webserver_new.common.success.ResponseCode;
import org.example.webserver_new.dto.api.ApiDtos.ApplicationResponse;
import org.example.webserver_new.dto.api.ApiDtos.ProjectRequest;
import org.example.webserver_new.dto.api.ApiDtos.ProjectResponse;
import org.example.webserver_new.service.ClientApiService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
@Tag(name = "의뢰인 API", description = "의뢰인의 프로젝트 생성, 프로젝트 관리, 지원자 지원서 조회를 담당합니다.")
public class ClientApiController {

    private final ClientApiService clientApiService;

    // 의뢰인 마이페이지: 새 프로젝트 의뢰 내용을 등록한다.
    @Operation(summary = "프로젝트 생성", description = "의뢰인이 프로젝트명, 마감일, 고용형태, 예산, 분야, 기술스택 등을 입력해 프로젝트를 생성합니다.")
    @PostMapping("/projects")
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @RequestBody ProjectRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(ResponseCode.PROJECT_CREATED,
                        clientApiService.createProject(request, httpRequest)));
    }

    // 의뢰인 마이페이지: 내가 등록한 프로젝트 현황을 조회한다.
    @Operation(summary = "의뢰 프로젝트 목록 조회", description = "현재 의뢰인이 등록한 프로젝트 목록을 지원자 수와 D-day 정보와 함께 조회합니다.")
    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> projects(HttpServletRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(ResponseCode.PROJECT_LIST_SUCCESS, clientApiService.projects(request))
        );
    }

    // 의뢰인 마이페이지: 내가 등록한 프로젝트의 의뢰내용 요약을 조회한다.
    @Operation(summary = "의뢰 프로젝트 상세 조회", description = "현재 의뢰인이 등록한 특정 프로젝트의 의뢰내용 요약을 조회합니다.")
    @GetMapping("/projects/{projectId}")
    public ResponseEntity<ApiResponse<ProjectResponse>> project(
            @PathVariable Long projectId,
            HttpServletRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(ResponseCode.PROJECT_FIND_SUCCESS,
                        clientApiService.project(projectId, request))
        );
    }

    // 의뢰인 마이페이지: 특정 프로젝트에 지원한 지원자 목록을 더보기 방식으로 조회한다.
    @Operation(summary = "프로젝트별 지원자 목록 조회", description = "특정 프로젝트의 지원자 목록을 조회합니다. 기본 페이지 크기는 더보기 UI 요구사항에 맞춰 2입니다.")
    @GetMapping("/projects/{projectId}/applications")
    public ResponseEntity<ApiResponse<Map<String, Object>>> projectApplications(
            @PathVariable Long projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2") int size,
            HttpServletRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(ResponseCode.APPLICATION_LIST_SUCCESS,
                        clientApiService.projectApplications(projectId, page, size, request))
        );
    }

    // 의뢰인 마이페이지: 지원자 목록에서 선택한 지원서의 상세 내용을 조회한다.
    @Operation(summary = "지원자 지원서 상세 조회", description = "현재 의뢰인이 소유한 프로젝트에 제출된 특정 지원서의 상세 내용을 조회합니다.")
    @GetMapping("/applications/{applicationId}")
    public ResponseEntity<ApiResponse<ApplicationResponse>> application(
            @PathVariable Long applicationId,
            HttpServletRequest request
    ) {
        return ResponseEntity.ok(
                ApiResponse.success(ResponseCode.APPLICATION_FIND_SUCCESS,
                        clientApiService.application(applicationId, request))
        );
    }
}
