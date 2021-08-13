package com.yolt.yts.testapp;

public enum Environment {
    team4, team5, acceptance, sandbox, production;

    public static Environment selectEnvironment(String profile){
        return switch(profile.toLowerCase()) {
            case "sandbox" -> sandbox;
            case "team4" -> team4;
            case "team5" -> team5;
            case "acceptance" -> acceptance;
            case "production" -> production;
            default -> sandbox;
        };
    }
}
