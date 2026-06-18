package org.example.webserver_new.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.webserver_new.common.error.ApiException;
import org.example.webserver_new.common.error.ErrorCode;
import org.example.webserver_new.dto.api.ApiDtos.ApplicationResponse;
import org.example.webserver_new.dto.api.ApiDtos.ProjectRequest;
import org.example.webserver_new.dto.api.ApiDtos.ProjectResponse;
import org.example.webserver_new.entity.Application;
import org.example.webserver_new.entity.Project;
import org.example.webserver_new.entity.Role;
import org.example.webserver_new.entity.User;
import org.example.webserver_new.repository.ApplicationRepository;
import org.example.webserver_new.repository.ProjectRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
// 의뢰인 마이페이지 서비스: 프로젝트 생성/관리와 프로젝트별 지원자 조회를 처리한다.
public class ClientApiService {

    private final ProjectRepository projectRepository;
    private final ApplicationRepository applicationRepository;
    private final AuthApiService authApiService;

    public ProjectResponse createProject(ProjectRequest request, HttpServletRequest httpRequest) {
        User user = authApiService.requiredRole(httpRequest, Role.CLIENT);

        Project project = new Project();
        project.setClient(user);
        project.setTitle(request.title());
        project.setEndDate(request.endDate());
        project.setEmploymentType(request.employmentType());
        project.setBudget(request.budget());
        project.setDuration(request.duration());
        project.setCategory(request.category());
        project.setStatus(request.status() == null ? "OPEN" : request.status());
        project.setMeetingRegion(request.meetingRegion());
        project.setDescription(request.description());
        project.setProgressMethod(request.progressMethod());
        project.setTechStack(request.techStack());
        project.setCreatedAt(LocalDateTime.now());

        return ProjectResponse.from(projectRepository.save(project));
    }

    public List<ProjectResponse> projects(HttpServletRequest request) {
        User user = authApiService.requiredRole(request, Role.CLIENT);

        return projectRepository.findByClient_Id(user.getId())
                .stream()
                .map(project -> ProjectResponse.from(project, applicationRepository.countByProject_Id(project.getId())))
                .toList();
    }

    public ProjectResponse project(Long projectId, HttpServletRequest request) {
        User user = authApiService.requiredRole(request, Role.CLIENT);

        return projectRepository.findById(projectId)
                .filter(project -> user.getId().equals(project.getClient().getId()))
                .map(project -> ProjectResponse.from(project, applicationRepository.countByProject_Id(project.getId())))
                .orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND_ENTITY));
    }

    // 2. Controller/Service 수정
    public Map<String, Object> projectApplications(Long projectId, int page, int size, HttpServletRequest request) {
        User user = authApiService.requiredRole(request, Role.CLIENT);
        boolean ownsProject = projectRepository.findById(projectId)
                .map(project -> user.getId().equals(project.getClient().getId()))
                .orElse(false);

        if (!ownsProject) {
            throw new ApiException(ErrorCode.NOT_FOUND_ENTITY);
        }

        // 페이지 번호가 0보다 작으면 0으로 고정 (안전장치)
        int safePage = Math.max(page, 0);

        // Pageable 객체 생성
        Pageable pageable = PageRequest.of(safePage, size);

        // Repository에서 Page 객체를 반환하도록 수정
        Page<Application> applicationPage = applicationRepository.findByProject_Id(projectId, pageable);

        // 응답 구성
        return Map.of(
                "content", applicationPage.getContent().stream().map(ApplicationResponse::from).toList(),
                "last", applicationPage.isLast(),           // 마지막 페이지 여부 (boolean)
                "totalElements", applicationPage.getTotalElements(), // 전체 데이터 개수
                "totalPages", applicationPage.getTotalPages()   // 전체 페이지 수
        );
    }

    public ApplicationResponse application(Long applicationId, HttpServletRequest request) {
        User user = authApiService.requiredRole(request, Role.CLIENT);

        return applicationRepository.findById(applicationId)
                .filter(application -> user.getId().equals(application.getProject().getClient().getId()))
                .map(ApplicationResponse::from)
                .orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND_ENTITY));
    }

    private Map<String, Object> paged(List<?> content, int page, int size) {
        int fromIndex = Math.min(page * size, content.size());
        int toIndex = Math.min(fromIndex + size, content.size());
        int totalPages = (int) Math.ceil((double) content.size() / size);

        return Map.of(
                "content", content.subList(fromIndex, toIndex),
                "page", page,
                "size", size,
                "totalElements", content.size(),
                "totalPages", totalPages,
                "hasNext", page + 1 < totalPages
        );
    }
}
