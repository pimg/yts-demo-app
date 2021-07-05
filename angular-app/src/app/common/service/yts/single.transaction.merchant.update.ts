export class SingleTransactionMerchantUpdate {
  accountId: string;
  id: string;
  date: string;
  counterpartyName: string;

  constructor(accountId: string, id: string, date: string, counterpartyName: string) {
    this.accountId = accountId;
    this.id = id;
    this.date = date;
    this.counterpartyName = counterpartyName;
  }
}

