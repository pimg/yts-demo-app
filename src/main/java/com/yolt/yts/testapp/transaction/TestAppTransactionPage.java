package com.yolt.yts.testapp.transaction;

import lombok.Value;

import java.util.List;

@Value
public class TestAppTransactionPage {
    List<TestAppTransaction> testAppTransactions;
    String next;
}
