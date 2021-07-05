package com.yolt.yts.testapp.site;

import com.yolt.yts.sdk.service.site.Site;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class TestAppSite {

    private final Site site;
    private final String supportedAccountsLine;
    private final String supportedPaymentAreasLine;

    public TestAppSite(Site site) {
        this.site = site;
        this.supportedAccountsLine = supportedAccountsLine();
        this.supportedPaymentAreasLine = supportedPaymentAreasLine();
    }

    private String supportedPaymentAreasLine() {
        List<String> supportedPaymentTypes = new ArrayList<>();
        if (site.getServices().getPis() != null) {
            if (site.getServices().getPis().getUkDomesticSingle() != null) {
                supportedPaymentTypes.add("UK single");
            }

            if (site.getServices().getPis().getScheduledUkDomestic() != null) {
                supportedPaymentTypes.add("UK scheduled");
            }

            if (site.getServices().getPis().getUkDomesticPeriodic() != null) {
                supportedPaymentTypes.add("UK periodic");
            }

            if (site.getServices().getPis().getSingleSepa() != null) {
                supportedPaymentTypes.add("SEPA single");
            }

            if (site.getServices().getPis().getScheduledSepa() != null) {
                supportedPaymentTypes.add("SEPA scheduled");
            }

            if (site.getServices().getPis().getPeriodicSepa() != null) {
                supportedPaymentTypes.add("SEPA periodic");
            }
        }

        return String.join(", ", supportedPaymentTypes);
    }

    private String supportedAccountsLine() {
        List<String> accountTypes = new ArrayList<>();
        site.getSupportedAccountTypes().forEach(sat -> {
            switch (sat) {
                case CURRENT_ACCOUNT:
                    accountTypes.add("current account");
                    break;
                case CREDIT_CARD:
                    accountTypes.add("credit card");
                    break;
                case SAVINGS_ACCOUNT:
                    accountTypes.add("savings account");
                    break;
                case PENSION:
                    accountTypes.add("pension account");
                    break;
                case INVESTMENT:
                    accountTypes.add("investment account");
                    break;
                case PREPAID_ACCOUNT:
                    accountTypes.add("prepaid account");
                    break;
            }
        });
        return String.join(", ", accountTypes);
    }
}
