package org.example.webserver_new.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "application")
public class Application
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "developer_id", nullable = false)
    private DevProfile developer;

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
    @Column(columnDefinition = "TEXT", nullable = true)
    private String positionDetails;

    //공통 지원 내용
    private String contents;
    private LocalDateTime createdAt;
}
