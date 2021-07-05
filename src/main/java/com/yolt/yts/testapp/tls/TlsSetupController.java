package com.yolt.yts.testapp.tls;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.shredzone.acme4j.challenge.Http01Challenge;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Controller
public class TlsSetupController {

    @Getter
    private final List<Http01Challenge> http01Challenges = new ArrayList<>();

    @GetMapping("/.well-known/acme-challenge/{token}")
    @ResponseBody
    public String acmeChallenge(@PathVariable final String token, final HttpServletResponse response) {
        // Prepare response to LetsEncrypt
        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");

        for (final Http01Challenge challenge : http01Challenges) {
            if (challenge.getToken().equals(token)) {
                log.info("LetsEncrypt challenge '{}' reply: {}", challenge.getToken(), challenge.getAuthorization());
                return challenge.getAuthorization();
            }
        }
        log.warn("LetsEncrypt challenge '{}', no reply...", token);
        return "Unknown token: " + token;
    }
}
