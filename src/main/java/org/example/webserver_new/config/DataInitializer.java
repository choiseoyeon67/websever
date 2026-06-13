package org.example.webserver_new.config;

import lombok.RequiredArgsConstructor;
import org.example.webserver_new.entity.Application;
import org.example.webserver_new.entity.DevProfile;
import org.example.webserver_new.entity.Project;
import org.example.webserver_new.entity.Role;
import org.example.webserver_new.entity.User;
import org.example.webserver_new.repository.ApplicationRepository;
import org.example.webserver_new.repository.DevProfileRepository;
import org.example.webserver_new.repository.MemberRepository;
import org.example.webserver_new.repository.ProjectRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final MemberRepository memberRepository;
    private final ProjectRepository projectRepository;
    private final DevProfileRepository devProfileRepository;
    private final ApplicationRepository applicationRepository;

    @Bean
    public CommandLineRunner seedData() {
        return args -> {
            if (projectRepository.count() >= 10) {
                return;
            }

            User developer = findOrCreateUser("developer@test.com", "1234", "개발자 테스트", Role.DEVELOPER);
            User client = findOrCreateUser("client@test.com", "1234", "의뢰인 테스트", Role.CLIENT);
            User secondClient = findOrCreateUser("client2@test.com", "1234", "의뢰인 테스트2", Role.CLIENT);

            devProfileRepository.findByUserId(developer.getId())
                    .orElseGet(() -> {
                        DevProfile profile = new DevProfile();
                        profile.setUserId(developer.getId());
                        profile.setDevType("풀스택");
                        profile.setIsActive(true);
                        profile.setIsResident(false);
                        profile.setRegion("서울");
                        profile.setBizType("개인");
                        profile.setCareerYears(3);
                        profile.setSearchTags("React,Spring,JPA,MySQL");
                        profile.setIntroduction("React와 Spring 기반 웹 서비스를 개발합니다.");
                        return devProfileRepository.save(profile);
                    });

            List<Project> projects = List.of(
                    createProject(client.getId(), "AI 기반 쇼핑몰 플랫폼 개발", "도급외주", 800, 45, "개발", "OPEN", "서울", List.of("React", "Spring", "MySQL"), 3),
                    createProject(client.getId(), "React 관리자 페이지 리뉴얼", "상주", 700, 60, "개발", "OPEN", "경기", List.of("React", "TypeScript"), 8),
                    createProject(client.getId(), "숙박 예약 서비스 앱 개발", "도급외주", 1500, 90, "개발", "OPEN", "부산", List.of("React Native", "Spring"), -1),
                    createProject(client.getId(), "B2B 견적 관리 시스템", "도급외주", 1200, 70, "개발", "OPEN", "서울", List.of("Vue", "Spring", "JPA"), 12),
                    createProject(client.getId(), "물류 대시보드 고도화", "상주", 650, 80, "개발", "OPEN", "인천", List.of("React", "Chart.js"), 15),
                    createProject(secondClient.getId(), "병원 예약 웹서비스 구축", "도급외주", 1800, 100, "개발", "OPEN", "대전", List.of("Spring", "MySQL"), 20),
                    createProject(secondClient.getId(), "교육 플랫폼 유지보수", "상주", 550, 120, "개발", "OPEN", "대구", List.of("Java", "Spring"), 25),
                    createProject(secondClient.getId(), "커뮤니티 서비스 MVP", "도급외주", 900, 50, "개발", "OPEN", "광주", List.of("React", "Node.js"), 30),
                    createProject(secondClient.getId(), "결제 모듈 연동 프로젝트", "도급외주", 700, 35, "개발", "OPEN", "서울", List.of("Spring", "Payment"), 40),
                    createProject(secondClient.getId(), "사내 업무 포털 개편", "상주", 600, 90, "개발", "CLOSED", "서울", List.of("React", "Java"), -5)
            );
            projectRepository.saveAll(projects);

            createApplication(projects.get(0).getId(), developer.getId(), 30, 750, null, null, 1, null, "프로젝트 구조를 빠르게 파악하고 일정 내 구현하겠습니다.");
            createApplication(projects.get(1).getId(), developer.getId(), null, null, "프론트엔드", "중급", 1, 650, "운영 중인 관리자 페이지 개선 경험이 있습니다.");
            createApplication(projects.get(3).getId(), developer.getId(), 50, 1100, null, null, 1, null, "견적과 승인 흐름이 있는 B2B 시스템 경험이 있습니다.");
        };
    }

    private User findOrCreateUser(String email, String password, String name, Role role) {
        return memberRepository.findByEmail(email)
                .orElseGet(() -> createUser(email, password, name, role));
    }

    private User createUser(String email, String password, String name, Role role) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setName(name);
        user.setRole(role);
        return memberRepository.save(user);
    }

    private Project createProject(
            Long clientId,
            String title,
            String employmentType,
            Integer budget,
            Integer duration,
            String category,
            String status,
            String meetingRegion,
            List<String> techStack,
            int deadlineOffset
    ) {
        Project project = new Project();
        project.setClientId(clientId);
        project.setTitle(title);
        project.setEndDate(LocalDate.now().plusDays(deadlineOffset));
        project.setEmploymentType(employmentType);
        project.setBudget(budget);
        project.setDuration(duration);
        project.setCategory(category);
        project.setStatus(status);
        project.setMeetingRegion(meetingRegion);
        project.setDescription(title + " 업무를 수행할 개발자를 모집합니다.");
        project.setProgressMethod("온라인 협업 및 주간 미팅");
        project.setTechStack(techStack);
        project.setCreatedAt(LocalDateTime.now().minusDays(Math.max(deadlineOffset, 0)));
        return project;
    }

    private void createApplication(
            Long projectId,
            Long developerId,
            Integer workDuration,
            Integer appliedBudget,
            String techRole,
            String experiencedLevel,
            Integer memberCount,
            Integer monthlySalary,
            String contents
    ) {
        Application application = new Application();
        application.setProjectId(projectId);
        application.setDeveloperId(developerId);
        application.setWorkDuration(workDuration);
        application.setAppliedBudget(appliedBudget);
        application.setTechRole(techRole);
        application.setExperiencedLevel(experiencedLevel);
        application.setMemberCount(memberCount);
        application.setMonthlySalary(monthlySalary);
        application.setContents(contents);
        application.setCreatedAt(LocalDateTime.now());
        applicationRepository.save(application);
    }
}
