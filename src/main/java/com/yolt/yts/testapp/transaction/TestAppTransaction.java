package com.yolt.yts.testapp.transaction;

import com.yolt.yts.sdk.service.transaction.Transaction;
import lombok.Value;

@Value
public class TestAppTransaction {
    Transaction transaction;
    String subLine;
    String creditorAccountNumber;
    String debtorAccountNumber;
}
