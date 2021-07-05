package com.yolt.yts.testapp;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Combinations of environment, client, signature verification key and redirect URL.
 * A client is selected based on the active Spring profile (environment) and the client id in application.properties
 * <p>
 * For both redirect URLs and signature verification keys we can control the IDs on all environments via the portal (APY).
 * That is why a single value for each is hardcoded in a Client.
 */
public class EnvironmentClients {

    private static final Client yoltTestClient = new Client(
            "5aeafb70-6e5e-4cf5-a13e-3023846fc928",
            "Yolt Test",
            "yolt_external_client",
            "2153d4e7-8217-46d1-bd5b-7ad96bdac308");

    private static final Client yoltPisTestClinet = new Client(
            "5aeafb70-6e5e-4cf5-a13e-3023846fc928",
            "Yolt PIS Test",
            "5046bd2dd5d11",
            "b65e900b-505d-4dec-8643-399aa68c922a");

    public static List<EnvironmentClient> clients = new ArrayList<>(Arrays.asList(
            new EnvironmentClient(Environment.team4, yoltTestClient),
            new EnvironmentClient(Environment.team5, yoltTestClient),
            new EnvironmentClient(Environment.acceptance, yoltTestClient),
            new EnvironmentClient(Environment.production, yoltPisTestClinet)
    ));
}
