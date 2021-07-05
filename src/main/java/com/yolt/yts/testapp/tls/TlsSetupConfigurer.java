package com.yolt.yts.testapp.tls;


import com.yolt.yts.testapp.AppProperties;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.shredzone.acme4j.*;
import org.shredzone.acme4j.challenge.Http01Challenge;
import org.shredzone.acme4j.exception.AcmeException;
import org.shredzone.acme4j.util.CSRBuilder;
import org.shredzone.acme4j.util.KeyPairUtils;
import org.springframework.boot.web.server.Ssl;
import org.springframework.boot.web.server.SslStoreProvider;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.security.KeyPair;
import java.security.KeyStore;
import java.security.Security;
import java.security.cert.X509Certificate;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * Orders a certificate from LetsEncrypt. Challenges spawned by this configurer are received and handled by the
 * TlsSetupController. Written by Jan van den Berg.
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class TlsSetupConfigurer implements WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> {

    static {
        Security.addProvider(new BouncyCastleProvider());
    }

    private static final String SERVER_CERT_KEY_ALIAS = "yfb-tester-app-local";
    private final KeyPair accountKeyPair = KeyPairUtils.createKeyPair(2048);;
    private final KeyPair domainKeyPair = KeyPairUtils.createKeyPair(2048);;

    @NonNull
    private final TlsSetupController tlsSetupController;

    @NonNull
    private final AppProperties appProperties;

    @Override
    public void customize(final ConfigurableServletWebServerFactory factory) {
        if (appProperties.isTlsEnabled()) {
            // Chicken and egg problem (we can't halt the execution here).
            // This triggers HTTP challenges that we must handle in the meantime.
            Executors.newCachedThreadPool().submit(() -> {
                try {
                    TimeUnit.SECONDS.sleep(1);
                    log.info("TLS: start negotiation with LetsEncrypt");
                    final Certificate certificate = letsEncrypt(appProperties.getTlsHostname());
                    log.info("TLS: got certificate, reconfiguring ConfigurableServletWebServerFactory.");

                    final Ssl ssl = new Ssl();
                    ssl.setKeyAlias(SERVER_CERT_KEY_ALIAS);
                    factory.setSsl(ssl);
                    factory.setSslStoreProvider(new SslStoreProvider() {
                        @Override
                        public KeyStore getKeyStore() {
                            return createKeyStore(certificate.getCertificate());
                        }

                        @Override
                        public KeyStore getTrustStore() {
                            return createTrustStore(certificate.getCertificateChain());
                        }
                    });
                    log.info("TLS: reconfiguring done, you can now enjoy: https://{}/", appProperties.getTlsHostname());
                } catch (Exception e) {
                    log.error("TLS: reconfiguring failed.", e);
                }
            });
        }
    }

    private Certificate letsEncrypt(final String hostname) throws AcmeException, IOException, InterruptedException {
        // create a session ("acme://letsencrypt.org" for production)
        Session session = new Session("acme://letsencrypt.org/staging");

        // create a login
        Login login = new AccountBuilder()
            .addContact("mailto:connections+yfb-tester-app@yolt.com")
            .agreeToTermsOfService()
            .useKeyPair(accountKeyPair)
            .createLogin(session);

        // get account
        Account account = login.getAccount();

        // order a certifcate
        Order order = account.newOrder()
            .domains(hostname)
            //.notAfter(Instant.now().plus(Duration.ofDays(1L)))
            .create();

        // process authorizations
        log.info("TLS: processing {} authorizations.", order.getAuthorizations().size());
        // 1 registration only
        tlsSetupController.getHttp01Challenges().clear();
        for (Authorization auth : order.getAuthorizations()) {
            if (auth.getStatus() != Status.VALID) {
                final Http01Challenge challenge = auth.findChallenge(Http01Challenge.TYPE);
                if (challenge != null) {
                    log.info("TLS: challenge '{}' accepted.", challenge.getToken());
                    tlsSetupController.getHttp01Challenges().add(challenge);
                    challenge.trigger();
                    for (int i = 1; auth.getStatus() != Status.VALID; ++i) {
                        log.info("TLS: waiting for challenge to be accepted.");
                        if (i % 3 == 0) {
                            log.warn("It seems the challenge / response isn't happening.. Did you start the frontend before the backend? Is the domain in application config correct? See README. ");
                        }
                        TimeUnit.SECONDS.sleep(3);
                        auth.update();
                    }
                }
            }
        }

        // build csr
        log.info("TLS: building CSR.");
        CSRBuilder csrBuilder = new CSRBuilder();
        csrBuilder.addDomain(hostname);
        csrBuilder.setOrganization("Yolt tester app");
        log.info("TLS: signing the CSR.");
        csrBuilder.sign(domainKeyPair);

        // finalize the order
        log.info("TLS: finalizing order.");
        order.execute(csrBuilder.getEncoded());

        // wait for order to finalize
        while (order.getStatus() != Status.VALID) {
            log.info("TLS: waiting for order to finalize.");
            TimeUnit.SECONDS.sleep(2);
            order.update();
        }

        // get certificate
        return order.getCertificate();
    }

    @SneakyThrows
    private KeyStore createKeyStore(X509Certificate... certificates) {
        KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
        keyStore.load(null, new char[0]);

        if (certificates != null) {
            keyStore.setKeyEntry(SERVER_CERT_KEY_ALIAS, domainKeyPair.getPrivate(), new char[0], certificates);
        }

        return keyStore;
    }

    @SneakyThrows
    private KeyStore createTrustStore(List<X509Certificate> certificates) {
        KeyStore keyStore = KeyStore.getInstance(KeyStore.getDefaultType());
        keyStore.load(null, new char[0]);

        if (certificates != null) {
            int counter = 0;
            for (X509Certificate certificate : certificates) {
                keyStore.setCertificateEntry(String.format("cert_%d", counter++), certificate);
            }
        }

        return keyStore;
    }
}
