package org.example.webserver_new.repository;

import org.example.webserver_new.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByDeveloperId(Long developerId);

    List<Application> findByProjectId(Long projectId);

    Optional<Application> findByProjectIdAndDeveloperId(Long projectId, Long developerId);

    long countByProjectId(Long projectId);
}
