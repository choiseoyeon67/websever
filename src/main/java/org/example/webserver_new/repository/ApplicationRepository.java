package org.example.webserver_new.repository;

import org.example.webserver_new.entity.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByDeveloper_Id(Long developerId);

    List<Application> findByProject_Id(Long projectId);
    Page<Application> findByProject_Id(Long projectId, Pageable pageable);

    Optional<Application> findByProject_IdAndDeveloper_Id(Long projectId, Long developerId);

    long countByProject_Id(Long projectId);
}
