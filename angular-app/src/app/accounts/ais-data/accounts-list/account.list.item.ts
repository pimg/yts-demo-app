import {Account} from "../../../common/service/yts/account";
import {TestAppAccount} from "../../../common/service/yts/test.app.account";
import {RefreshableUserSiteItemData} from "../refresh-status/refreshable.user.site.item.data";


export class AccountListItem extends RefreshableUserSiteItemData {

  account: Account;

  constructor(testAppAccount: TestAppAccount) {
    super(testAppAccount.account.userSite.userSiteId, testAppAccount.account.lastDataFetchTime, testAppAccount.lastRefreshLine)
    this.account = testAppAccount.account;
  }

  public getAccountNumber(): string {
    if (this.account.accountReferences.iban) {
      return this.account.accountReferences.iban;
    }
    if (this.account.accountReferences.bban) {
      return this.account.accountReferences.iban;
    }
    if (this.account.accountReferences.pan) {
      return this.account.accountReferences.iban;
    }
    if (this.account.accountReferences.maskedPan) {
      return this.account.accountReferences.iban;
    }
    if (this.account.accountReferences.sortCodeAccountNumber) {
      return this.account.accountReferences.sortCodeAccountNumber;
    }
    return "";
  }

  public getAccountType() {
    return this.account.type.replace('_', ' ').toLowerCase();
  }

  public getBalancesLine() {
    let res = '';
    this.account.balances.forEach(b => {
      res += b.type + ' : ' + b.amount + ', '
    })
    return res.substr(0, res.length - 2);
  }
}
