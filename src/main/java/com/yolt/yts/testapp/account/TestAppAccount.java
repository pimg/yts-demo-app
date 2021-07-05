package com.yolt.yts.testapp.account;

import com.yolt.yts.sdk.service.account.Account;
import com.yolt.yts.testapp.LastRefreshLine;
import lombok.Getter;

@Getter
public class TestAppAccount {

    private final Account account;
    private final String lastRefreshLine;

    public TestAppAccount(Account account) {
        this.account = account;
        this.lastRefreshLine = LastRefreshLine.from(account.getLastDataFetchTime());
    }
}
