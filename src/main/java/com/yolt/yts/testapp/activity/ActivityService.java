package com.yolt.yts.testapp.activity;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * Manages activities so they can be accessed from the UserSiteController and from the ActivityController
 * Move to a database when deploying multiple instances of this app.
 */
@Slf4j
@Service
public class ActivityService {

    /**
     * Webhooks can be sent multiple times if processing by the client (this app) isn't fast enough.
     * We should expect multiple deliveries of the same webhook and therefore save activities in a set to prevent
     * duplicates
     *
     * @param activityUpdate
     */
    private static final Set<Activity> ACTIVITIES = new HashSet<>();

    static {
        // Remove activities that are older than 5 minutes
        ScheduledExecutorService executorService = Executors.newScheduledThreadPool(1);
        executorService.scheduleAtFixedRate(() -> {
            final List<Activity> oldActivities = ACTIVITIES.stream().filter(a -> ChronoUnit.MINUTES.between(a.getStarted(), Instant.now()) > 5).collect(Collectors.toList());
            if (oldActivities.size() > 0) {
                log.info("Cleaning up {} old activities", oldActivities.size());
            }
            ACTIVITIES.removeAll(oldActivities);
        }, 0, 1, TimeUnit.MINUTES);
    }

    public List<Activity> getActivities(UUID userId) {
        final List<Activity> collect = ACTIVITIES.stream()
                .filter(a -> a.getUserId().equals(userId))
                .sorted((a1, a2) -> a1.getStarted().equals(a2.getStarted()) ? 0 : a1.getStarted().isBefore(a2.getStarted()) ? -1 : 1)
                .collect(Collectors.toList());
        deleteCompletedActivitiesForUser(userId);
        return collect;
    }

    public void deleteCompletedActivitiesForUser(UUID userId) {
        final List<Activity> completedActivities = ACTIVITIES.stream()
                .filter(a -> a.getUserId().equals(userId))
                .filter(a -> a.getUpdates().stream().anyMatch(u -> u.getEvent().equals(ActivityUpdate.WebhookEvent.ACTIVITY_FINISHED)))
                .collect(Collectors.toList());
        ACTIVITIES.removeAll(completedActivities);
    }

    public void deleteActivity(UUID userId, UUID activityId) {
        ACTIVITIES.remove(new Activity(userId, activityId));
    }


    public void saveActivityUpdate(ActivityUpdate activityUpdate) {
        ACTIVITIES.stream()
                .filter(a -> a.getUserId().equals(activityUpdate.getUserId()) && a.getActivityId().equals(activityUpdate.getActivityId()))
                .findAny()
                .ifPresent(a -> a.getUpdates().add(activityUpdate));
    }

    public void saveActivity(Activity activity) {
        log.info("Saving activity {}", activity.getActivityId());
        ACTIVITIES.add(activity);
    }

}
