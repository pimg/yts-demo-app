package com.yolt.yts.testapp;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.yolt.yts.sdk.YTS;
import com.yolt.yts.sdk.http.HttpClientConfig;
import com.yolt.yts.sdk.service.accesstoken.AccessTokenConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import java.util.List;
import java.util.Optional;

@Slf4j
@SpringBootApplication
public class YtsTestAppApplication {

    private final AppProperties appProperties;
    private final Environment springEnvironment;

    public YtsTestAppApplication(AppProperties appProperties, Environment springEnvironment) {
        this.appProperties = appProperties;
        this.springEnvironment = springEnvironment;
    }

    public static void main(String[] args) {
        SpringApplication.run(YtsTestAppApplication.class, args);
    }

    @Bean
    public YTS ytsClient(EnvironmentClient environmentClient) {
        // Http client settings
        HttpClientConfig httpClientConfig = new HttpClientConfig.Builder(appProperties.getEnvironmentBaseUrl())
                .setKeyStore(appProperties.getTlsKeyStore(), appProperties.getTlsKeyStorePw())
                .setTimeouts(appProperties.getConnectTimeout(), appProperties.getSocketTimeout())
                .setLogRequestsResponses(appProperties.isLogRequestsResponses())
                .build();

        // Signing settings
        AccessTokenConfig signingConfig = new AccessTokenConfig(
                appProperties.getSigningKeyStore(),
                appProperties.getSigningKeyStorePw(),
                appProperties.getSigningKeyAlias(),
                environmentClient.getClient().getYtsSignatureVerificationKeyId());

        return new YTS(appProperties.getClientId(),
                signingConfig,
                httpClientConfig);
    }

    /**
     * Select an EnvironmentClient based on the selected Spring profile and the client id in config.
     * This means that multiple clients can be configured per environment, but the app runs for only a single client.
     *
     * @return
     */
    @Bean
    public EnvironmentClient selectEnvironmentClient(EnvironmentClients environmentClients) {
        String[] activeProfiles = springEnvironment.getActiveProfiles();
        String activeProfile;

        if (activeProfiles.length == 0) {
            log.warn("No active profile was set - falling back to sandbox profile");
            activeProfile = "sandbox";
        } else {
            activeProfile = springEnvironment.getActiveProfiles()[0];
        }

        Optional<EnvironmentClient> environmentClientOptional = environmentClients.getTestClients().stream()
                .filter(ec -> ec.getEnvironment().name().equals(activeProfile) && ec.getClient().getClientId().equals(appProperties.getClientId()))
                .findFirst();
        if (environmentClientOptional.isEmpty()) {
            throw new RuntimeException("Could not find EnvironmentClient for profile " + activeProfile + " and client " + appProperties.getClientId());
        }

        EnvironmentClient environmentClient = environmentClientOptional.get();

        log.info("Running app against environment [{}] at [{}] for client [{}] with req/resp logging [{}]",
                environmentClient.getEnvironment(),
                appProperties.getEnvironmentBaseUrl(),
                environmentClient.getClient().getName(),
                appProperties.isLogRequestsResponses() ? "enabled" : "disabled");

        return environmentClient;
    }

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        JavaTimeModule module = new JavaTimeModule();
        return new ObjectMapper()
                .setSerializationInclusion(JsonInclude.Include.NON_NULL)
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                .registerModule(module);
    }


}
