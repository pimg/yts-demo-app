import {TestAppUserSite} from "../../../common/service/yts/test.app.user.site";
import {throwError} from "rxjs";
import {RefreshableUserSiteItemData} from "../refresh-status/refreshable.user.site.item.data";
import {UserSite} from "../../../common/service/yts/user.site";

export class UserSiteListItem extends RefreshableUserSiteItemData {
  userSite: UserSite;

  constructor(testAppUserSite: TestAppUserSite) {
    super(testAppUserSite.userSite.id, testAppUserSite.userSite.lastDataFetchTime, testAppUserSite.lastRefreshLine);
    this.userSite = testAppUserSite.userSite;
  }

  public status(): StatusView {
    if (this.userSite.connectionStatus == 'CONNECTED') {
      if (!this.userSite.lastDataFetchFailureReason) {
        return new StatusView('connected', 'text-success');
      } else if (this.userSite.lastDataFetchFailureReason === 'TECHNICAL_ERROR') {
        return new StatusView('last data fetch failed', 'text-warning');
      }
    }

    if (this.userSite.connectionStatus == 'DISCONNECTED') {
      return new StatusView('consent expired', 'text-danger');
    }

    if (this.userSite.connectionStatus == 'STEP_NEEDED') {
      return new StatusView('step needed', 'text-warning');
    }

    throwError('Undefined status');
  }
}

class StatusView {

  constructor(statusLine: string, cssClass: string) {
    this.statusLine = statusLine;
    this.cssClass = cssClass;
  }

  statusLine: string;
  cssClass: string;
}
