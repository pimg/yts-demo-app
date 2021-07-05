import {Component, Input, OnInit} from "@angular/core";
import {RefreshableUserSiteItemData} from "./refreshable.user.site.item.data";
import {BackendService} from "../../../common/service/yts/backend.service";
import {Activity} from "../../../common/service/yts/activity";
import {throwError} from "rxjs";
import {RefreshableUserSiteItemView} from "./refreshable.user.site.item.view";

@Component({
  templateUrl: './refresh.status.component.html',
  selector: 'refresh-status'
})
export class RefreshStatusComponent implements OnInit {

  /**
   * Splitting data and view avoids immediate display of the old 'last refreshed.. line' after changing
   * between accounts and user-sites views during a refresh.
   */
  @Input()
  refreshableUserSiteItemData: RefreshableUserSiteItemData;
  refreshableUserSiteItemView: RefreshableUserSiteItemView;

  constructor(private backendService: BackendService) {

  }

  ngOnInit(): void {

    if (!this.refreshableUserSiteItemData) {
      throwError('Refreshable item must be set for this component to work');
    }

    this.refreshableUserSiteItemView = new RefreshableUserSiteItemView(this.refreshableUserSiteItemData);

    this.backendService.allActivitiesSubject.subscribe(activities => {
      let refreshableUserSiteItemView = new RefreshableUserSiteItemView(this.refreshableUserSiteItemData);
      this.updateStatus(activities, refreshableUserSiteItemView);
      this.refreshableUserSiteItemView = refreshableUserSiteItemView;
    })
  }

  private updateStatus(activities: Activity[], refreshableUserSiteItemView: RefreshableUserSiteItemView) {
    const activity = this.findApplicableActivity(activities, this.refreshableUserSiteItemData.userSiteId)
    if (activity) {
      if (activity.updates.length == 0) {
        // Just started
        refreshableUserSiteItemView.refreshableItem.setRefreshInProgress();
      }

      if (activity.updates.length == 1 && activity.updates.filter(a => a.event === 'DATA_SAVED').length == 1) {
        refreshableUserSiteItemView.refreshableItem.setRefreshDataSaved();
      }

      // We don't check here whether the activity is finished. We rely on the home component to detect finished
      // activities and reload data for them

    }
  }

  public findApplicableActivity(activities: Activity[], userSiteId: string): Activity {
    let applicableActivities = activities.filter(a => {
      return a.userSites.find(us => us === userSiteId);
    });

    if (applicableActivities.length > 1) {
      throwError('We assume only one activity exists per user-site. We found ' + applicableActivities.length);
    }

    if (applicableActivities.length == 0) {
      return null;
    }

    return applicableActivities[0];
  }

}
