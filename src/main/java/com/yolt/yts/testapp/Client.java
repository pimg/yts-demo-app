package com.yolt.yts.testapp;

import lombok.Getter;

import java.util.UUID;

@Getter
public class Client {

    UUID clientId;
    String name;
    String ytsSignatureVerificationKeyId;
    UUID redirectUrlId;

    public Client(String clientId, String name, String ytsSignatureVerificationKeyId, String redirectUrlId) {
        this.clientId = UUID.fromString(clientId);
        this.name = name;
        this.ytsSignatureVerificationKeyId = ytsSignatureVerificationKeyId;
        this.redirectUrlId = UUID.fromString(redirectUrlId);
    }
}
