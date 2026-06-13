package org.example.webserver_new.repository;

import org.example.webserver_new.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
