package com.yolt.yts.testapp.activity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.yolt.yts.sdk.service.usersite.model.usersite.ConnectionStatus;
import com.yolt.yts.sdk.service.usersite.model.usersite.FailureReason;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.ZonedDateTime;
import java.util.Set;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Data
public class ActivityUpdate {

    @EqualsAndHashCode.Include
    private UUID userId;
    @EqualsAndHashCode.Include
    private UUID activityId;
    @EqualsAndHashCode.Include
    private WebhookEvent event;
    @EqualsAndHashCode.Include
    private WebhookActivity activity;

    private ZonedDateTime dateTime;
    private Set<UserSiteResult> userSites;


    public enum WebhookActivity {
        CREATE_USER_SITE,
        UPDATE_USER_SITE,
        BACKGROUND_REFRESH,
        USER_REFRESH,
        USER_FEEDBACK,
        TEST
    }

    public enum WebhookEvent {
        DATA_SAVED,
        ACTIVITY_FINISHED,
        TEST
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class UserSiteResult {
        private UUID userSiteId;
        private ConnectionStatus connectionStatus;
        private ZonedDateTime lastDataFetch;
        private FailureReason failureReason;
    }
}
