export class AccountDetailsOpenedEvent {
  public accountNumber: string;

  constructor(accountNumber: string) {
    this.accountNumber = accountNumber;
  }
}
