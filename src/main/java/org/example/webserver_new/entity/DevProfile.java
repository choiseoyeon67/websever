package org.example.webserver_new.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class DevProfile
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long id;

    private Long userId;

    private String devType;
    private Boolean isActive;
    private Boolean isResident;
    private String region;
    private String bizType;
    private Integer careerYears;
    private String searchTags;
    private String introduction;
    private String profileImageFileName;
}
