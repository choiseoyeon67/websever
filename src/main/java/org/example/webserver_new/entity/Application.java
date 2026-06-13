package org.example.webserver_new.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Application
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long id;

    private Long projectId;

    private Long developerId;

    //도급 전용 필드
    private Integer workDuration;

    private Integer appliedBudget;

    //상주 전용 필드
    @Column(nullable = true)
    private String techRole;
    @Column(nullable = true)
    private String experiencedLevel;
    @Column(nullable = true)
    private Integer memberCount;
    @Column(nullable = true)
    private Integer monthlySalary;

    //공통 지원 내용
    private String contents;
    private LocalDateTime createdAt;
}
