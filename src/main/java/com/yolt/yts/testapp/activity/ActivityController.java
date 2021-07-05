package com.yolt.yts.testapp.activity;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
public class ActivityController {

    private final ObjectMapper objectMapper;
    private final ActivityService activityService;

    public ActivityController(ObjectMapper objectMapper, ActivityService activityService) {
        this.objectMapper = objectMapper;
        this.activityService = activityService;
    }

    @GetMapping("/activities")
    public List<Activity> getActivities(@CookieValue("user") UUID userId) throws Exception {
        return activityService.getActivities(userId);
    }

    @DeleteMapping("/activities/{activityId}")
    public void deleteActivity(@CookieValue("user") UUID userId,
                               @PathVariable("activityId") UUID activityId) throws Exception {
        log.info("Deleting activity {}", activityId);
        activityService.deleteActivity(userId, activityId);
    }

    /**
     * Receives webhooks from YTS
     */
    @SneakyThrows
    @PostMapping("/webhook")
    public void webhook(@RequestBody String rawWebhook) {
        Thread.sleep(500);
        log.info("Received webhook : {}", rawWebhook);
        final ActivityUpdate activityUpdate = objectMapper.readValue(rawWebhook, ActivityUpdate.class);
        if (activityUpdate.getActivity().equals(ActivityUpdate.WebhookActivity.TEST)) {
            return;
        }
        activityService.saveActivityUpdate(activityUpdate);
    }

}
