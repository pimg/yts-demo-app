import {AccountReferences} from "./account.references";

export class Transaction {
  id: string;
  externalId: string;
  accountId: string;
  status: string;
  date: string;
  timestamp: string;
  bookingDate: string;
  valueDate: string;
  amount: number;
  currency: string;
  description: string;
  endToEndId: string;
  creditor: Creditor;
  debtor: Debtor;
  bankTransactionCode: string;
  purposeCode: string;
  exchangeRate: ExchangeRate;
  originalAmount: OriginalAmount;
  enrichment: Enrichment;
  lastUpdatedTime: string;
  bankSpecific: Map<string, string>
  remittanceInformationStructured: string;
}

export class Creditor {
  name: string;
  accountReferences: AccountReferences;
}

export class Debtor {
  name: string;
  accountReferences: AccountReferences;
}

export class ExchangeRate {
  currencyFrom: string;
  currencyTo: string;
  rate: string;
}

export class OriginalAmount {
  amount: string;
  currency: string;
}

export class Enrichment {
  category: String;
  merchant: Merchant;
  cycle: Cycle;
  labels: string[];
}

export class Merchant {
  name: string;
}

export class Cycle {
  cycleType: string;
  amount: string;
  currency: string;
  period: string;
  predictedOccurrences: string[];
  label: string;
  subscription: boolean;
  counterparty: string;
}
