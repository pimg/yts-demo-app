

export class SimilarTransactionsMerchantUpdate {
  updateSessionId: string;
  groupSelectors: string[];
  counterpartyName: string;

  constructor(updateSessionId: string, groupSelectors: string[], counterpartyName: string) {
    this.updateSessionId = updateSessionId;
    this.groupSelectors = groupSelectors;
    this.counterpartyName = counterpartyName;
  }
}
