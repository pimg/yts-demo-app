package com.yolt.yts.testapp.transaction.enrichment;

import com.yolt.yts.sdk.YTS;
import com.yolt.yts.sdk.service.transaction.enrichment.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
public class EnrichmentController {

    private final YTS yts;

    public EnrichmentController(YTS yts) {
        this.yts = yts;
    }

    @GetMapping("merchant-suggestions")
    public MerchantSuggestions getMerchantSuggestions(@CookieValue("user") UUID userId) {
        return yts.getMerchantSuggestions(userId);
    }

    @GetMapping("similar-transactions")
    public SimilarTransactionsForUpdates getSimilarTransactions(@CookieValue("user") UUID userId,
                                                                @RequestParam("accountId") UUID accountId,
                                                                @RequestParam("transactionId") UUID transactionId,
                                                                @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) final LocalDate date) {
        return yts.getSimilarTransactions(userId, accountId, transactionId, date);
    }

    @PostMapping("update-similar-transactions/merchant")
    public EnrichmentUpdateActivity updateMerchantsForSimilarTransactions(@CookieValue("user") UUID userId,
                                                                          @RequestBody SimilarTransactionsMerchantUpdate similarTransactionsMerchantUpdate) {
        return yts.updateMerchantsForSimilarTransactions(userId, similarTransactionsMerchantUpdate);
    }

    @PostMapping("update-transaction/merchant")
    public EnrichmentUpdateActivity updateMerchantForTransaction(@CookieValue("user") UUID userId,
                                                                 @RequestBody SingleTransactionMerchantUpdate singleTransactionMerchantUpdate) {
        return yts.updateMerchantForTransaction(userId, singleTransactionMerchantUpdate);
    }
}
