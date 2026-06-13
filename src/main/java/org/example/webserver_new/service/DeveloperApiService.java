package org.example.webserver_new.service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.example.webserver_new.common.error.ApiException;
import org.example.webserver_new.common.error.ErrorCode;
import org.example.webserver_new.dto.api.ApiDtos.ApplicationResponse;
import org.example.webserver_new.dto.api.ApiDtos.DeveloperApplicationResponse;
import org.example.webserver_new.dto.api.ApiDtos.ProfileRequest;
import org.example.webserver_new.dto.api.ApiDtos.ProfileResponse;
import org.example.webserver_new.entity.DevProfile;
import org.example.webserver_new.entity.Project;
import org.example.webserver_new.entity.Role;
import org.example.webserver_new.entity.User;
import org.example.webserver_new.repository.ApplicationRepository;
import org.example.webserver_new.repository.DevProfileRepository;
import org.example.webserver_new.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
// 개발자 마이페이지 서비스: 프로필 관리, 이미지 업로드, 내가 지원한 프로젝트/지원서 조회를 처리한다.
public class DeveloperApiService {

    private final DevProfileRepository devProfileRepository;
    private final ApplicationRepository applicationRepository;
    private final ProjectRepository projectRepository;
    private final AuthApiService authApiService;

    @Value("${app.upload.profile-dir:uploads/profile}")
    private String profileUploadDir;

    public ProfileResponse profile(HttpServletRequest request) {
        User user = authApiService.requiredRole(request, Role.DEVELOPER);
        return ProfileResponse.from(findOrCreateProfile(user.getId()));
    }

    public ProfileResponse updateProfile(ProfileRequest request, HttpServletRequest httpRequest) {
        User user = authApiService.requiredRole(httpRequest, Role.DEVELOPER);

        if (hasTooManySearchTags(request.searchTags()))
        {
            throw new ApiException(ErrorCode.HAS_TOO_MANY_TAG);
        }

        DevProfile profile = findOrCreateProfile(user.getId());
        profile.setDevType(request.devType());
        profile.setIsActive(request.isActive());
        profile.setIsResident(request.isResident());
        profile.setRegion(request.region());
        profile.setBizType(request.bizType());
        profile.setCareerYears(request.careerYears());
        profile.setSearchTags(request.searchTags());
        profile.setIntroduction(request.introduction());

        return ProfileResponse.from(devProfileRepository.save(profile));
    }

    public ProfileResponse uploadImage(MultipartFile image, HttpServletRequest request) throws IOException {
        User user = authApiService.requiredRole(request, Role.DEVELOPER);
        DevProfile profile = findOrCreateProfile(user.getId());
        Path uploadDir = Path.of(profileUploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadDir);

        String originalFilename = image.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String fileName = UUID.randomUUID() + extension;

        image.transferTo(uploadDir.resolve(fileName));
        profile.setProfileImageFileName(fileName);

        return ProfileResponse.from(devProfileRepository.save(profile));
    }

    public List<DeveloperApplicationResponse> applications(HttpServletRequest request) {
        User user = authApiService.requiredRole(request, Role.DEVELOPER);

        return applicationRepository.findByDeveloperId(user.getId())
                .stream()
                .map(application -> {
                    Project project = projectRepository.findById(application.getProjectId()).orElse(null);
                    long applicantCount = applicationRepository.countByProjectId(application.getProjectId());
                    return DeveloperApplicationResponse.from(application, project, applicantCount);
                })
                .toList();
    }

    public ApplicationResponse application(Long applicationId, HttpServletRequest request) {
        User user = authApiService.requiredRole(request, Role.DEVELOPER);

        return applicationRepository.findById(applicationId)
                .filter(application -> user.getId().equals(application.getDeveloperId()))
                .map(ApplicationResponse::from)
                .orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND_ENTITY));
    }

    private DevProfile findOrCreateProfile(Long userId) {
        return devProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    DevProfile profile = new DevProfile();
                    profile.setUserId(userId);
                    return devProfileRepository.save(profile);
                });
    }

    private boolean hasTooManySearchTags(String searchTags) {
        if (searchTags == null || searchTags.isBlank()) {
            return false;
        }

        return Arrays.stream(searchTags.split(","))
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .count() > 5;
    }
}
