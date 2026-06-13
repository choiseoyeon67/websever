package org.example.webserver_new.service;

import lombok.RequiredArgsConstructor;
import org.example.webserver_new.entity.User;
import org.example.webserver_new.repository.MemberRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginService
{
    private final MemberRepository memberRepository;

    public User login(String email, String password) {
        User member = memberRepository.findByEmail(email)
                .orElse(null);

        if (member == null)
        {
            return null;
        }

        if (!password.equals(member.getPassword())) {
            return null;
        }

        return member;
    }
}
