import {Component, Input, OnInit} from "@angular/core";
import {AccountListItem} from "./account.list.item";
import {BackendService} from "../../../common/service/yts/backend.service";
import {interval, Subscription} from "rxjs";

@Component({
  selector: 'accounts-list',
  templateUrl: './accounts.list.component.html'
})
export class AccountsListComponent implements OnInit {

  @Input()
  public accounts: AccountListItem[];
  @Input()
  public cssClass: string;

  private timeInterval: Subscription;
  public accountListItems: AccountListItem[] = [];

  constructor(private backendService: BackendService) {
    this.backendService.finishedActivitySubject.subscribe(finishedActivity => {
      if (finishedActivity != null) {
        this.reloadAccounts(finishedActivity.userSites);
        // Silence the BehaviorSubject by setting null as next item. This will prevent reloading of user-sites every
        // time we open the user-sites list view
        this.backendService.finishedActivitySubject.next(null);
      }
    })

    let set = new Set<string>();

    // Fetch new data automatically every 5 minutes
    this.timeInterval = interval(5 * 60 * 1000).subscribe(o => {
      this.accountListItems.forEach(ali => {
        set.add(ali.account.userSite.userSiteId);
      });
      this.reloadAccounts(Array.from(set));
    });
  }

  ngOnInit(): void {
    if (this.accounts) {
      this.accounts.forEach(a => {
        this.addAccountInView(a);
      })
    }
  }

  private addAccountInView(accountListItem: AccountListItem) {
    this.accountListItems.push(accountListItem);
  }

  reloadAccounts(userSiteIds: string[]) {
    userSiteIds.forEach(userSiteId => {
      this.backendService.getAccounts(userSiteId).subscribe(accounts => {
        accounts.forEach(acct => {
          let index = this.accounts.findIndex(account => account.account.id === acct.account.id);
          if (index >= 0) {
            this.accountListItems[index] = new AccountListItem(acct);
          }
        })
      });
    })
  }
}
