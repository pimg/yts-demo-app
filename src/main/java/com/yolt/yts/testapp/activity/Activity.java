package com.yolt.yts.testapp.activity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NonNull;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Getter
public class Activity {
    private final Instant started;

    @EqualsAndHashCode.Include
    private final UUID userId;
    @EqualsAndHashCode.Include
    private final UUID activityId;

    private final Set<ActivityUpdate> updates = new HashSet<>();
    private List<UUID> userSites;

    public Activity(@NonNull UUID userId, @NonNull UUID activityId) {
        this.started = Instant.now();
        this.userId = userId;
        this.activityId = activityId;
    }

    public Activity(@NonNull UUID userId, @NonNull UUID activityId, @NonNull List<UUID> userSites) {
        this.started = Instant.now();
        this.userId = userId;
        this.activityId = activityId;
        this.userSites = userSites;
    }

    public void addUpdate(ActivityUpdate update) {
        updates.add(update);
    }
}
