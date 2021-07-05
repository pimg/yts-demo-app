package com.yolt.yts.testapp.user;

import com.yolt.yts.sdk.YTS;
import com.yolt.yts.sdk.service.user.User;
import lombok.Value;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.UUID;

@RestController
public class UserController {

    private final YTS yts;

    public UserController(YTS yts) {
        this.yts = yts;
    }

    /**
     * Creates a user and returns its id as a secure cookie.
     * We intentionally don't return the user in the response body.
     * There is no need for that.
     */
    @PostMapping("user")
    public void createUser(HttpServletResponse response) {
        final User user = yts.createUser();
        Cookie cookie = new Cookie("user", user.getId().toString());
        cookie.setHttpOnly(true); // don't allow Javascript access to the cookie
        cookie.setMaxAge(86400); // invalidate after 24h
        cookie.setSecure(false); // TODO: change to true when implementing TLS (at least on non-local envs)
        response.addCookie(cookie);
    }

    @GetMapping("user")
    public HasCookie hasUserCookie(@CookieValue(value = "user", required = false) UUID userId) {
        return new HasCookie(userId != null);
    }

    @Value
    private static class HasCookie {
        boolean hasCookie;
    }


}
