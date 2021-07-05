import {Component, OnInit} from "@angular/core";
import {BackendService} from "../../common/service/yts/backend.service";
import {AccountListItem} from "./accounts-list/account.list.item";
import {ActivatedRoute} from "@angular/router";
import {UserSiteListItem} from "./user-sites-list/user.site.list.item";

/**
 * This is the main component for accounts. It orchestrates loading of data and views based on events in the app.
 * When this app grows larger, a different approach using routing and child views may be needed to keep things
 * manageable.
 */
@Component({
  templateUrl: './ais.data.component.html'
})
export class AisDataComponent implements OnInit {

  activeTab: string;
  selectedAccountListItem: AccountListItem;
  inactiveAccountDetailsTabAccountNumber: string;
  accounts: AccountListItem[];
  userSites: UserSiteListItem[];

  constructor(private backendService: BackendService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {


    // Determine the active tab from route data
    this.route
      .data
      .subscribe(data => {
        this.activeTab = data.tab;
      });


    // Determine whether an inactive account details tab should be shown based on query string parameter
    // Note that we get the account number here only, so we can very quickly render it in the tab in the view without
    // getting the account from the server first.
    this.route.queryParams
      .subscribe(params => {
          if (params.account) {
            this.inactiveAccountDetailsTabAccountNumber = params.account;
          }
        }
      );

    this.backendService.getAllAccounts().subscribe(accounts => {
      this.accounts = accounts.map(a => new AccountListItem(a));

      // Get the account number from the route data
      let accountNumber = this.route.snapshot.paramMap.get("accountNumber");
      if (accountNumber) {
        let openedAccount = accounts.find(a => new AccountListItem(a).getAccountNumber() == accountNumber);
        this.selectedAccountListItem = new AccountListItem(openedAccount);
      }
    })

    this.backendService.getUserSites().subscribe(userSites => {
      this.userSites = userSites.map(us => new UserSiteListItem(us));
    })
  }

  public refreshAll() {
    // Fire and forget - the service and registered observers will take care of the rest
    this.backendService.refreshAllUserSites().subscribe(resp => {
      this.backendService.pollForActivities();
    });
  }
}
