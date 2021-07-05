package com.yolt.yts.testapp;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Data
@Component
@ConfigurationProperties("app")
public class AppProperties {
    private String signingKeyAlias;
    private String tlsKeyStore;
    private String tlsKeyStorePw;
    private String signingKeyStore;
    private String signingKeyStorePw;
    private String tlsTrustStore;
    private String tlsTrustStorePw;

    private int connectTimeout;
    private int socketTimeout;

    private String environmentBaseUrl;
    private UUID clientId;

    private boolean logRequestsResponses;

    private String apiPathTokens;

    private String tlsHostname;

    public boolean isTlsEnabled() {
        return tlsHostname != null;
    }
}
