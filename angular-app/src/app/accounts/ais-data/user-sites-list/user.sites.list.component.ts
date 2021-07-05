import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {UserSiteListItem} from "./user.site.list.item";
import {BackendService} from "../../../common/service/yts/backend.service";
import {interval, Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'user-sites-list',
  templateUrl: './user.sites.list.component.html'
})
export class UserSitesListComponent implements OnInit {

  @Output() userSiteDeleteEmitter = new EventEmitter<string>();
  userSiteListItems: UserSiteListItem[] = [];
  private timeInterval: Subscription;

  @Input()
  userSites: UserSiteListItem[];

  constructor(private backendService: BackendService, private router: Router) {
    this.backendService.finishedActivitySubject.subscribe(finishedActivity => {
      if (finishedActivity != null) {
        this.reloadUserSites(finishedActivity.userSites);
        // Silence the BehaviorSubject by setting null as next item. This will prevent reloading of user-sites every
        // time we open the user-sites list view
        this.backendService.finishedActivitySubject.next(null);
      }
    })

    // Fetch new data automatically every 60 seconds
    this.timeInterval = interval(60000).subscribe(o => {
      this.userSiteListItems.forEach(usli => {
        this.reloadUserSite(usli.userSiteId);
      });
    });
  }

  ngOnInit(): void {
    if (this.userSites) {
      this.userSites.forEach(us => {
        this.userSiteListItems.push(us);
      })
    }
  }

  private findUserSiteIndex(id: string): number {
    return this.userSiteListItems.findIndex(userSiteListItem => {
      return userSiteListItem.userSite.id === id;
    })
  }

  private removeUserSiteFromView(uswa: UserSiteListItem) {
    this.userSiteListItems.splice(this.findUserSiteIndex(uswa.userSite.id), 1);
  }

  public reloadUserSites(userSiteIds: string[]) {
    userSiteIds.forEach(userSiteId => {
      this.reloadUserSite(userSiteId);
    });
  }

  public reloadUserSite(userSiteId: string) {
    this.backendService.getUserSite(userSiteId).subscribe(testAppUserSite => {
      let index = this.userSiteListItems.findIndex(usli => usli.userSite.id == testAppUserSite.userSite.id);
      this.userSiteListItems[index] = new UserSiteListItem(testAppUserSite);
    });
  }

  delete(userSiteWithAccounts: UserSiteListItem) {
    this.backendService.deleteUserSite(userSiteWithAccounts.userSite.id).subscribe(() => {
      this.removeUserSiteFromView(userSiteWithAccounts);
      console.log('1');
      if (this.userSiteListItems.length == 0) {
        console.log('route home');
        this.router.navigate(['/']);
      }
    });
  }

  updateConsent(userSiteListItem: UserSiteListItem) {
    this.backendService.updateConsent(userSiteListItem.userSite.id).subscribe(loginStep => {
      if (loginStep.redirect) {
        window.location.replace(loginStep.redirect.url);
      }
    });
  }

  refresh(userSiteWithAccounts: UserSiteListItem) {
    this.backendService.refreshUserSite(userSiteWithAccounts.userSite.id).subscribe(() => {
      this.backendService.pollForActivities();
    });
  }
}
