package org.example.webserver_new.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import org.example.webserver_new.entity.converter.StringListConverter;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
public class Project
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    private Long id;

    private Long clientId;

    private String title;
    private LocalDate endDate;
    private String employmentType;
    private Integer budget;
    private Integer duration;
    private String category;
    private String status;
    private String meetingRegion;
    private String description;
    private String progressMethod;

    @Convert(converter = StringListConverter.class)
    @Column(name = "techStack", nullable = false)
    private List<String> techStack;
    private LocalDateTime createdAt;

}
