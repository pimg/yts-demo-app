import {TransactionsGroupedByAccountId} from "./transactions.grouped.by.account.id";


export class SimilarTransactionGroup {
  groupSelector: string;
  groupDescription: string;
  count: number;
  transactions: TransactionsGroupedByAccountId[];

}
