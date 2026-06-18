package org.example.webserver_new.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.webserver_new.common.error.ApiException;
import org.example.webserver_new.common.error.ErrorCode;
import org.example.webserver_new.dto.api.ApiDtos.ApplicationRequest;
import org.example.webserver_new.dto.api.ApiDtos.ApplicationResponse;
import org.example.webserver_new.dto.api.ApiDtos.ProjectResponse;
import org.example.webserver_new.entity.Application;
import org.example.webserver_new.entity.DevProfile;
import org.example.webserver_new.entity.Project;
import org.example.webserver_new.entity.Role;
import org.example.webserver_new.entity.User;
import org.example.webserver_new.repository.ApplicationRepository;
import org.example.webserver_new.repository.DevProfileRepository;
import org.example.webserver_new.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
// 프로젝트 공개 서비스: 랜딩 페이지 검색/상세 조회와 개발자의 프로젝트 지원서 제출을 처리한다.
public class ProjectApiService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}", Pattern.CASE_INSENSITIVE);
    private static final Pattern PHONE_PATTERN = Pattern.compile("(01[016789][- ]?\\d{3,4}[- ]?\\d{4}|\\d{2,3}[- ]?\\d{3,4}[- ]?\\d{4})");

    private final ProjectRepository projectRepository;
    private final ApplicationRepository applicationRepository;
    private final DevProfileRepository devProfileRepository;
    private final AuthApiService authApiService;

    public Map<String, Object> projects(String employmentType, String status, String sort, int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = size <= 0 ? 4 : size;

        List<ProjectResponse> projects = projectRepository.findAll()
                .stream()
                .filter(project -> employmentType == null || employmentType.equals(project.getEmploymentType()))
                .filter(project -> status == null || status.equals(project.getStatus()))
                .sorted(projectComparator(sort))
                .map(project -> ProjectResponse.from(project, applicationRepository.countByProject_Id(project.getId())))
                .toList();

        return paged(projects, safePage, safeSize);
    }

    public ProjectResponse project(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND_ENTITY));

        return ProjectResponse.from(project, applicationRepository.countByProject_Id(project.getId()));
    }

    public ApplicationResponse apply(Long projectId, HttpServletRequest request) {
        ApplicationRequest defaultRequest = new ApplicationRequest(
                null, null, null, null, null, null, null, "지원서가 제출되었습니다."
        );

        return submitApplication(projectId, defaultRequest, request);
    }

    public ApplicationResponse submitApplication(
            Long projectId,
            ApplicationRequest applicationRequest,
            HttpServletRequest request
    ) {
        User user = authApiService.requiredRole(request, Role.DEVELOPER);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND_ENTITY));
        DevProfile developer = devProfileRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND_ENTITY));

        if (containsContactInfo(applicationRequest.contents())) {
            throw new ApiException(ErrorCode.INVALID_VALUE);
        }

        Application application = applicationRepository.findByProject_IdAndDeveloper_Id(projectId, developer.getId())
                .orElseGet(() -> {
                    Application newApplication = new Application();
                    newApplication.setProject(project);
                    newApplication.setDeveloper(developer);
                    newApplication.setCreatedAt(LocalDateTime.now());
                    return newApplication;
                });

        application.setWorkDuration(applicationRequest.workDuration());
        application.setAppliedBudget(applicationRequest.appliedBudget());
        application.setTechRole(applicationRequest.techRole());
        application.setExperiencedLevel(applicationRequest.experiencedLevel());
        application.setMemberCount(applicationRequest.memberCount());
        application.setMonthlySalary(applicationRequest.monthlySalary());
        application.setPositionDetails(applicationRequest.positionDetails());
        application.setContents(applicationRequest.contents());

        return ApplicationResponse.from(applicationRepository.save(application));
    }

    private Comparator<Project> projectComparator(String sort) {
        return switch (sort) {
            case "endDate" -> Comparator.comparing(Project::getEndDate, Comparator.nullsLast(Comparator.naturalOrder()));
            case "budget" -> Comparator.comparing(Project::getBudget, Comparator.nullsLast(Comparator.reverseOrder()));
            case "applicantCount" -> Comparator.comparing(project -> applicationRepository.countByProject_Id(project.getId()), Comparator.reverseOrder());
            default -> Comparator.comparing(Project::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder()));
        };
    }

    private boolean containsContactInfo(String contents) {
        if (contents == null) {
            return false;
        }

        return EMAIL_PATTERN.matcher(contents).find() || PHONE_PATTERN.matcher(contents).find();
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
