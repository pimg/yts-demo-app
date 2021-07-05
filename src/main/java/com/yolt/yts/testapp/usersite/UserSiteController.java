package com.yolt.yts.testapp.usersite;

import com.yolt.yts.sdk.YTS;
import com.yolt.yts.sdk.service.usersite.model.login.LoginStep;
import com.yolt.yts.sdk.service.usersite.model.usersite.*;
import com.yolt.yts.testapp.EnvironmentClient;
import com.yolt.yts.testapp.activity.Activity;
import com.yolt.yts.testapp.activity.ActivityService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RestController
public class UserSiteController {

    private final YTS yts;
    private final EnvironmentClient environmentClient;
    private final ActivityService activityService;

    public UserSiteController(YTS yts, EnvironmentClient environmentClient, ActivityService activityService) {
        this.yts = yts;
        this.environmentClient = environmentClient;
        this.activityService = activityService;
    }

    @PostMapping("connect")
    public LoginStep connect(@CookieValue(value = "user") UUID userId,
                             @RequestParam("siteId") UUID siteId,
                             HttpServletRequest request) {
        return yts.connectToSite(userId, request.getRemoteAddr(), siteId, environmentClient.getClient().getRedirectUrlId());
    }

    @PostMapping("user-sites/{userSiteId}/update-consent")
    public LoginStep updateConsent(@CookieValue(value = "user") UUID userId,
                                   @PathVariable("userSiteId") UUID userSiteId,
                                   HttpServletRequest request) {
        return yts.updateConsent(userId, request.getRemoteAddr(), userSiteId, environmentClient.getClient().getRedirectUrlId());
    }

    @PostMapping("user-sites/url")
    public CreateUserSiteResponse createUserSite(@CookieValue(value = "user") UUID userId,
                                                 @RequestBody UrlCreateUserSiteRequest urlRequest,
                                                 HttpServletRequest request) {
        final CreateUserSiteResponse createUserSiteResponse = yts.createUserSite(userId, request.getRemoteAddr(), urlRequest.getRedirectUrl());
        if (createUserSiteResponse.getActivityId() != null) {
            activityService.saveActivity(new Activity(userId, createUserSiteResponse.getActivityId(),
                    Collections.singletonList(createUserSiteResponse.getUserSite().getId())));
        }
        return createUserSiteResponse;
    }

    @PostMapping("user-sites/form")
    public CreateUserSiteResponse createUserSite(@CookieValue(value = "user") UUID userId,
                                                 HttpServletRequest request,
                                                 @RequestBody FormCreateUserSiteRequest formRequest) {
        return yts.createUserSite(userId, request.getRemoteAddr(), formRequest.getStateId(), formRequest.getFilledInFormValues());
    }

    @GetMapping("user-sites")
    public List<TestAppUserSite> getUserSites(@CookieValue(value = "user") UUID userId) {
        return yts.getUserSites(userId).stream()
                .map(TestAppUserSite::new)
                .sorted(Comparator.comparing(t -> t.getUserSite().getId().toString()))
                .collect(Collectors.toList());
    }

    @GetMapping("user-sites/{userSiteId}")
    public TestAppUserSite getUserSite(@CookieValue(value = "user") UUID userId,
                                       @PathVariable UUID userSiteId) {
        return new TestAppUserSite(yts.getUserSite(userId, userSiteId));
    }

    @PostMapping("user-sites/{userSiteId}/refresh")
    public RefreshUserSitesResponse refreshUserSite(@CookieValue(value = "user") UUID userId,
                                                    @PathVariable UUID userSiteId,
                                                    HttpServletRequest request) {
        final RefreshUserSitesResponse refreshUserSiteResponse = yts.refreshUserSite(userId, request.getRemoteAddr(), userSiteId);
        log.info("Refreshing user site {} in activity {}", userSiteId, refreshUserSiteResponse.getActivityId());
        if (refreshUserSiteResponse.getActivityId() != null) {
            activityService.saveActivity(new Activity(userId, refreshUserSiteResponse.getActivityId(), Collections.singletonList(userSiteId)));
        }
        return refreshUserSiteResponse;
    }

    @PostMapping("user-sites/refresh")
    public RefreshUserSitesResponse refreshAllUserSites(@CookieValue(value = "user") UUID userId, HttpServletRequest request) {
        final List<UserSite> userSites = yts.getUserSites(userId);
        final RefreshUserSitesResponse refreshUserSiteResponse = yts.refreshAllUserSites(userId, request.getRemoteAddr());
        if (refreshUserSiteResponse.getActivityId() != null) {
            activityService.saveActivity(new Activity(userId, refreshUserSiteResponse.getActivityId(), userSites.stream()
                    .map(UserSite::getId)
                    .collect(Collectors.toList())));
        }
        return refreshUserSiteResponse;
    }

    @DeleteMapping("user-sites/{userSiteId}")
    public void deleteUserSite(@CookieValue(value = "user") UUID userId,
                               HttpServletRequest request,
                               @PathVariable UUID userSiteId) {
        yts.deleteUserSite(userId, request.getRemoteAddr(), userSiteId);
    }
}
