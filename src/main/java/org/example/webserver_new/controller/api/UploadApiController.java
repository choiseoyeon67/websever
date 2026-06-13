package org.example.webserver_new.controller.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.example.webserver_new.service.UploadApiService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.MalformedURLException;

@RestController
@RequestMapping("/uploads/profile")
@RequiredArgsConstructor
@Tag(name = "업로드 파일 API", description = "서버 로컬 폴더에 저장된 프로필 이미지 파일 조회를 담당합니다.")
public class UploadApiController {

    private final UploadApiService uploadApiService;

    // 프로필 화면: DB에 저장된 파일명을 이용해 서버 로컬 이미지 파일을 내려준다.
    @Operation(summary = "이미지 조회", description = "프로필 이미지 파일명을 받아 서버에 저장된 이미지를 inline 리소스로 반환합니다.")
    @GetMapping("/{fileName}")
    public ResponseEntity<Resource> profileImage(@PathVariable String fileName) throws MalformedURLException {
        Resource resource = uploadApiService.profileImage(fileName);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
