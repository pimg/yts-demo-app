package com.yolt.yts.testapp.transaction;

import com.yolt.yts.sdk.YTS;
import com.yolt.yts.sdk.service.transaction.Next;
import com.yolt.yts.sdk.service.transaction.TransactionPage;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
public class TransactionController {

    private final YTS yts;

    public TransactionController(YTS yts) {
        this.yts = yts;
    }

    @GetMapping("transactions")
    public TestAppTransactionPage getTransactions(@CookieValue("user") UUID user,
                                                  @RequestParam(value = "accountId", required = false) UUID accountId,
                                                  @RequestParam(value = "next", required = false) String next) {
        if (accountId == null && next == null) {
            return toTestAppTransactionPage(yts.getTransactions(user));
        }

        if (accountId == null) {
            return toTestAppTransactionPage(yts.getTransactions(user, new Next(next)));
        }

        if (next == null) {
            return toTestAppTransactionPage(yts.getTransactions(user, Collections.singletonList(accountId)));
        }

        return toTestAppTransactionPage(yts.getTransactions(user, Collections.singletonList(accountId), new Next(next)));

    }

    private TestAppTransactionPage toTestAppTransactionPage(TransactionPage transactionPage) {
        final List<TestAppTransaction> testAppTransactions = transactionPage.getTransactions().stream().map(tx -> {
            String subLine = "";
            if (tx.getAmount().doubleValue() < 0) {
                if (tx.getCreditor() != null) {
                    if (tx.getCreditor().getName() != null) {
                        subLine = tx.getCreditor().getName();
                    }
                    if (tx.getCreditor().getAccountReferences() != null) {
                        if (tx.getCreditor().getAccountReferences().getIban() != null) {
                            subLine = tx.getCreditor().getAccountReferences().getIban();
                        }
                        if (tx.getCreditor().getAccountReferences().getBban() != null) {
                            subLine = tx.getCreditor().getAccountReferences().getBban();
                        }
                        if (tx.getCreditor().getAccountReferences().getMaskedPan() != null) {
                            subLine = tx.getCreditor().getAccountReferences().getMaskedPan();
                        }
                        if (tx.getCreditor().getAccountReferences().getSortCodeAccountNumber() != null) {
                            subLine = tx.getCreditor().getAccountReferences().getSortCodeAccountNumber();
                        }
                    }
                }
            }

            if (tx.getAmount().doubleValue() > 0) {
                if (tx.getDebtor() != null) {
                    if (tx.getDebtor().getName() != null) {
                        subLine = tx.getDebtor().getName();
                    }
                    if (tx.getDebtor().getAccountReferences() != null) {
                        if (tx.getDebtor().getAccountReferences().getIban() != null) {
                            subLine = tx.getDebtor().getAccountReferences().getIban();
                        }
                        if (tx.getDebtor().getAccountReferences().getBban() != null) {
                            subLine = tx.getDebtor().getAccountReferences().getBban();
                        }
                        if (tx.getDebtor().getAccountReferences().getMaskedPan() != null) {
                            subLine = tx.getDebtor().getAccountReferences().getMaskedPan();
                        }
                        if (tx.getDebtor().getAccountReferences().getSortCodeAccountNumber() != null) {
                            subLine = tx.getDebtor().getAccountReferences().getSortCodeAccountNumber();
                        }
                    }
                }
            }

            String creditorAccountNumber = "";
            if (tx.getCreditor() != null) {
                if (tx.getCreditor().getAccountReferences() != null) {
                    if (tx.getCreditor().getAccountReferences().getBban() != null) {
                        creditorAccountNumber = tx.getCreditor().getAccountReferences().getBban();
                    }
                    if (tx.getCreditor().getAccountReferences().getMaskedPan() != null) {
                        creditorAccountNumber = tx.getCreditor().getAccountReferences().getMaskedPan();
                    }
                    if (tx.getCreditor().getAccountReferences().getPan() != null) {
                        creditorAccountNumber = tx.getCreditor().getAccountReferences().getPan();
                    }
                    if (tx.getCreditor().getAccountReferences().getSortCodeAccountNumber() != null) {
                        creditorAccountNumber = tx.getCreditor().getAccountReferences().getSortCodeAccountNumber();
                    }
                    if (tx.getCreditor().getAccountReferences().getIban() != null) {
                        creditorAccountNumber = tx.getCreditor().getAccountReferences().getIban();
                    }
                    if (tx.getCreditor().getAccountReferences().getSortCodeAccountNumber() != null) {
                        creditorAccountNumber = tx.getCreditor().getAccountReferences().getSortCodeAccountNumber();
                    }
                }
            }

            String debtorAccountNumber = "";
            if (tx.getDebtor() != null) {
                if (tx.getDebtor().getAccountReferences() != null) {
                    if (tx.getDebtor().getAccountReferences().getBban() != null) {
                        debtorAccountNumber = tx.getDebtor().getAccountReferences().getBban();
                    }
                    if (tx.getDebtor().getAccountReferences().getMaskedPan() != null) {
                        debtorAccountNumber = tx.getDebtor().getAccountReferences().getMaskedPan();
                    }
                    if (tx.getDebtor().getAccountReferences().getPan() != null) {
                        debtorAccountNumber = tx.getDebtor().getAccountReferences().getPan();
                    }
                    if (tx.getDebtor().getAccountReferences().getSortCodeAccountNumber() != null) {
                        debtorAccountNumber = tx.getDebtor().getAccountReferences().getSortCodeAccountNumber();
                    }
                    if (tx.getDebtor().getAccountReferences().getIban() != null) {
                        debtorAccountNumber = tx.getDebtor().getAccountReferences().getIban();
                    }
                    if (tx.getDebtor().getAccountReferences().getSortCodeAccountNumber() != null) {
                        debtorAccountNumber = tx.getDebtor().getAccountReferences().getSortCodeAccountNumber();
                    }
                }
            }

            return new TestAppTransaction(tx, subLine, creditorAccountNumber, debtorAccountNumber);
        }).collect(Collectors.toList());

        return new TestAppTransactionPage(testAppTransactions, transactionPage.getNext());
    }

}
