package com.yolt.yts.testapp.usersite;

import com.yolt.yts.sdk.service.usersite.model.usersite.UserSite;
import com.yolt.yts.testapp.LastRefreshLine;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

/**
 * This class only exists to add some convenience fields for the front-end that are too case-specific to be moved
 * to the JDK
 */
@Slf4j
@Getter
public class TestAppUserSite {

    private final UserSite userSite;
    private final String lastRefreshLine;

    public TestAppUserSite(UserSite userSite) {
        this.userSite = userSite;
        this.lastRefreshLine = LastRefreshLine.from(userSite.getLastDataFetchTime());
    }


}
