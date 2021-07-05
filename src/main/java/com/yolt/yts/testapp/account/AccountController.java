package com.yolt.yts.testapp.account;

import com.yolt.yts.sdk.YTS;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
public class AccountController {

    private final YTS yts;

    public AccountController(YTS yts) {
        this.yts = yts;
    }

    @GetMapping("accounts")
    public List<TestAppAccount> getAccounts(@CookieValue("user") UUID userId) {
        return yts.getAccounts(userId).stream()
                .map(TestAppAccount::new)
                .sorted(Comparator.comparing(taa -> taa.getAccount().getUserSite().getUserSiteId().toString()))
                .collect(Collectors.toList());
    }

}
