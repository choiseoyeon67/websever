package org.example.webserver_new.repository;

import org.example.webserver_new.entity.DevProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DevProfileRepository extends JpaRepository<DevProfile, Long> {

    Optional<DevProfile> findByUser_Id(Long userId);
}
