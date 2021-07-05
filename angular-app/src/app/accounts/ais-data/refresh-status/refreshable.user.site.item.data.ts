import {RefreshStatus} from "../refresh.status";

/**
 * An item that represents either a user-site or an account. It could also represent a transaction, since they are also
 * part of the user-site, but we choose to not provide refresh status feedback at the transaction level.
 */
export abstract class RefreshableUserSiteItemData {

  protected refreshStatus: RefreshStatus;
  public userSiteId: string;
  public lastDataFetchTime: string;
  public lastRefreshedLine: string;

  protected constructor(userSiteId: string, lastDataFetchTime: string, lastRefreshedLine: string) {
    this.userSiteId = userSiteId;
    this.lastDataFetchTime = lastDataFetchTime;
    this.lastRefreshedLine = lastRefreshedLine;
  }

  public setRefreshInProgress(): void {
    this.refreshStatus = new RefreshStatus();
  }

  public setRefreshFinished() {
    this.refreshStatus = null;
  }

  public setRefreshDataSaved(): void {
    // User-site and accounts views have their own RefreshableUserSite instances. When starting a refresh from
    // the user-site list view we may enter the accounts view while a refresh is in progress for some accounts.
    // In this case the refreshStatus is still null. That is why we first set the refresh in progress.
    this.setRefreshInProgress();
    this.refreshStatus.setDataSaved();
  }

  public hasRefreshStatus(): boolean {
    return this.refreshStatus != null;
  }

  public getRefreshStatus(): RefreshStatus {
    return this.refreshStatus;
  }
}
