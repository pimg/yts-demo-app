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

    private static final Client yoltSandboxTestClient = new Client(
            "e578287c-d4d3-4a5d-9995-83335a8f2ca2",
            "Ruben client - rubenski@mail.com",
            "e6d30f9a-e381-4a45-9af5-6c7d5babfd2f",
            "d1f93cc0-cfb0-48ed-8b66-5a3819608575");

    public static List<EnvironmentClient> clients = new ArrayList<>(Arrays.asList(
            new EnvironmentClient(Environment.sandbox, yoltSandboxTestClient)
    ));
}
