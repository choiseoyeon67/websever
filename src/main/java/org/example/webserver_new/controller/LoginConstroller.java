package org.example.webserver_new.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.example.webserver_new.entity.User;
import org.example.webserver_new.dto.LoginForm;
import org.example.webserver_new.service.LoginService;
import org.example.webserver_new.validation.SessionConst;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.SessionAttribute;

@Controller
@RequiredArgsConstructor
public final class LoginConstroller
{
    private final LoginService loginService;

    @PostMapping("/login")
    public String login(@Validated @ModelAttribute LoginForm loginform, BindingResult bindingResult, HttpServletRequest request)
    {
        User loginMember = loginService.login(loginform.getLoginId(), loginform.getPassword());

        if (loginMember == null)
        {
            bindingResult.reject("loginFail", "아이디 또는 비밀번호가 맞지 않습니다");
            return "login/login-Form";
        }

        HttpSession session = request.getSession();
        session.setAttribute(SessionConst.LOGIN_USER, loginMember);

        return "redirect:/";
    }

    @GetMapping("/logout")
    public String logout(HttpServletRequest request)
    {
        HttpSession session = request.getSession(false);
        if (session!=null)
            session.invalidate();

        return "redirect:/";
    }

    @GetMapping("/")
    public String home(@SessionAttribute(name=SessionConst.LOGIN_USER, required =false)
                           User loginMember, Model model)
    {
        if (loginMember == null)
        {
            return "index";
        }
        model.addAttribute("member", loginMember);
        return "index";
    }
}
