import {AccountReferences} from "./account.references";

export class Account {
  id: string;
  externalId: string;
  type: string;
  userSite: UserSite;
  currency: string;
  balance: number;
  status: string;
  name: string;
  accountReferences: AccountReferences;
  creditCardAccount: CreditCardAccount;
  currentAccount: CurrentAccount;
  usage: string;
  lastDataFetchTime: string;
  balances: Balance[];
}

class UserSite {
  userSiteId: string;
  siteId: string;
}

class CreditCardAccount {
  availableCredit: string;
}

class CurrentAccount {
  bic: string;
  creditLimit: string;
}

class Balance {
  currency: string;
  amount: string;
  type: string;
}

