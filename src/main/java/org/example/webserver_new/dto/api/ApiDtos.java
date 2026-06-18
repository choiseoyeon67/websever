package org.example.webserver_new.dto.api;

import org.example.webserver_new.entity.Application;
import org.example.webserver_new.entity.DevProfile;
import org.example.webserver_new.entity.Project;
import org.example.webserver_new.entity.Role;
import org.example.webserver_new.entity.User;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public final class ApiDtos {

    private ApiDtos() {
    }

    public record LoginRequest(String email, String password) {
    }

    public record UserResponse(Long id, String email, String name, Role role) {
        public static UserResponse from(User user) {
            return new UserResponse(user.getId(), user.getEmail(), user.getName(), user.getRole());
        }
    }

    public record ProjectRequest(
            String title,
            LocalDate endDate,
            String employmentType,
            Integer budget,
            Integer duration,
            String category,
            String status,
            String meetingRegion,
            String description,
            String progressMethod,
            List<String> techStack
    ) {
    }

    public record ProjectResponse(
            Long id,
            Long clientId,
            String title,
            LocalDate endDate,
            String employmentType,
            Integer budget,
            Integer duration,
            String category,
            String status,
            String meetingRegion,
            String description,
            String progressMethod,
            List<String> techStack,
            LocalDateTime createdAt,
            long applicantCount,
            long dDay
    ) {
        public static ProjectResponse from(Project project) {
            return from(project, 0);
        }

        public static ProjectResponse from(Project project, long applicantCount) {
            long dDay = project.getEndDate() == null
                    ? 0
                    : java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), project.getEndDate());

            return new ProjectResponse(
                    project.getId(),
                    project.getClient().getId(),
                    project.getTitle(),
                    project.getEndDate(),
                    project.getEmploymentType(),
                    project.getBudget(),
                    project.getDuration(),
                    project.getCategory(),
                    project.getStatus(),
                    project.getMeetingRegion(),
                    project.getDescription(),
                    project.getProgressMethod(),
                    project.getTechStack(),
                    project.getCreatedAt(),
                    applicantCount,
                    dDay
            );
        }
    }

    public record ProfileRequest(
            String devType,
            Boolean isActive,
            Boolean isResident,
            String region,
            String bizType,
            Integer careerYears,
            String searchTags,
            String introduction
    ) {
    }

    public record ProfileResponse(
            Long id,
            Long userId,
            String devType,
            Boolean isActive,
            Boolean isResident,
            String region,
            String bizType,
            Integer careerYears,
            String searchTags,
            String introduction,
            String profileImageUrl
    ) {
        public static ProfileResponse from(DevProfile profile) {
            String imageUrl = profile.getImagePath() != null
                    ? profile.getImagePath()
                    : profile.getProfileImageFileName() == null
                    ? null
                    : "/uploads/profile/" + profile.getProfileImageFileName();

            return new ProfileResponse(
                    profile.getId(),
                    profile.getUser().getId(),
                    profile.getDevType(),
                    profile.getIsActive(),
                    profile.getIsResident(),
                    profile.getRegion(),
                    profile.getBizType(),
                    profile.getCareerYears(),
                    profile.getSearchTags(),
                    profile.getIntroduction(),
                    imageUrl
            );
        }
    }

    public record ApplicationRequest(
            Integer workDuration,
            Integer appliedBudget,
            String techRole,
            String experiencedLevel,
            Integer memberCount,
            Integer monthlySalary,
            String positionDetails,
            String contents
    ) {
    }

    public record ApplicationResponse(
            Long id,
            Long projectId,
            Long developerId,
            Integer workDuration,
            Integer appliedBudget,
            String techRole,
            String experiencedLevel,
            Integer memberCount,
            Integer monthlySalary,
            String positionDetails,
            String contents,
            LocalDateTime createdAt
    ) {
        public static ApplicationResponse from(Application application) {
            return new ApplicationResponse(
                    application.getId(),
                    application.getProject().getId(),
                    application.getDeveloper().getId(),
                    application.getWorkDuration(),
                    application.getAppliedBudget(),
                    application.getTechRole(),
                    application.getExperiencedLevel(),
                    application.getMemberCount(),
                    application.getMonthlySalary(),
                    application.getPositionDetails(),
                    application.getContents(),
                    application.getCreatedAt()
            );
        }
    }

    public record DeveloperApplicationResponse(
            Long id,
            Long projectId,
            String projectTitle,
            Integer estimate,
            long applicantCount,
            Integer duration,
            ApplicationResponse application
    ) {
        public static DeveloperApplicationResponse from(
                Application application,
                Project project,
                long applicantCount
        ) {
            return new DeveloperApplicationResponse(
                    application.getId(),
                    application.getProject().getId(),
                    project == null ? null : project.getTitle(),
                    application.getAppliedBudget() != null
                            ? application.getAppliedBudget()
                            : application.getMonthlySalary(),
                    applicantCount,
                    project == null ? null : project.getDuration(),
                    ApplicationResponse.from(application)
            );
        }
    }
}
