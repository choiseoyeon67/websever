package org.example.webserver_new.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LoginForm
{
    @NotNull
    private String email;
    @NotEmpty
    private String password;
}
