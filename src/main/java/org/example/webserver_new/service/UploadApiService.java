package org.example.webserver_new.service;

import lombok.RequiredArgsConstructor;
import org.example.webserver_new.common.error.ApiException;
import org.example.webserver_new.common.error.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.nio.file.Path;

@Service
@RequiredArgsConstructor
// 업로드 파일 서비스: 서버 로컬 저장소의 프로필 이미지를 안전하게 조회한다.
public class UploadApiService {

    @Value("${app.upload.profile-dir:uploads/profile}")
    private String profileUploadDir;

    public Resource profileImage(String fileName) throws MalformedURLException {
        Path uploadDir = Path.of(profileUploadDir).toAbsolutePath().normalize();
        Path filePath = uploadDir.resolve(fileName).normalize();

        if (!filePath.startsWith(uploadDir)) {
            throw new ApiException(ErrorCode.ACCESS_DENIED);
        }

        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            throw new ApiException(ErrorCode.NOT_FOUND_ENTITY);
        }

        return resource;
    }
}
