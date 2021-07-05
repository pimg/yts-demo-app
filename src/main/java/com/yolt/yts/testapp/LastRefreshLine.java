package com.yolt.yts.testapp;

import java.time.Instant;

public class LastRefreshLine {

    public static String from(Instant instant) {

        if (instant == null) {
            return "never";
        }

        final Instant now = Instant.now();
        final long msSinceLastRefresh = now.minusMillis(instant.toEpochMilli()).toEpochMilli();
        final int minutesSinceLastRefresh = (int) msSinceLastRefresh / 1000 / 60;

        // First 20 seconds return 'just now'
        if (msSinceLastRefresh < 20000) {
            return "just now";
        }

        // Remainder of first minute return the seconds
        if (minutesSinceLastRefresh == 0) {
            return String.format("%d seconds ago", msSinceLastRefresh / 1000);
        }

        // After 1 minute return '1 minute ago'
        if (minutesSinceLastRefresh == 1) {
            return "1 minute ago";
        }

        // The next 59 minutes, return the number of minutes
        if (minutesSinceLastRefresh < 60) {
            return String.format("%d minutes ago", minutesSinceLastRefresh);
        }

        // The next 0.5 hour, return '1 hour ago'
        if (minutesSinceLastRefresh < 90) {
            return "1 hour ago";
        }

        // The remaining 11 hours return hours and half hours
        if (minutesSinceLastRefresh < 720) {
            int fullHours = minutesSinceLastRefresh / 60;

            if (minutesSinceLastRefresh % 60 >= 30) {
                return String.format("%d.5 hours ago", fullHours);
            }

            return String.format("%d hours ago", fullHours);
        }

        // Then return full hours
        return String.format("%d hours ago", minutesSinceLastRefresh / 60);
    }
}
