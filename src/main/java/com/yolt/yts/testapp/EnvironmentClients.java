package com.yolt.yts.testapp;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Combinations of environment, client, signature verification key and redirect URL.
 * A client is selected based on the active Spring profile (environment) and the client id in application.properties
 */
@Configuration
@RequiredArgsConstructor
@Getter
public class EnvironmentClients {

    private final List<EnvironmentClient> testClients;

    @Autowired
    public EnvironmentClients(AppProperties properties, org.springframework.core.env.Environment springEnvironment) {
        testClients = new ArrayList<>(Arrays.asList(
            new EnvironmentClient(Environment.selectEnvironment(springEnvironment.getActiveProfiles()[0]),
            new Client(properties.getClientId().toString(),
              properties.getClientName(),
              properties.getSigningRequestTokenId().toString(),
              properties.getRedirectUrlId().toString())
            )
        ));
    }

}
