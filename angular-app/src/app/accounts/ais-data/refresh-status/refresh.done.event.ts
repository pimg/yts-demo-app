export class RefreshDoneEvent {
  userSiteIds: string[] = [];


  constructor(userSiteIds: string[]) {
    this.userSiteIds = userSiteIds;
  }
}
