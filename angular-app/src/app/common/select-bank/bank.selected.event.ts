import {TestAppSite} from "../service/yts/test.app.site";

export class BankSelectedEvent {
  public site: TestAppSite;

  constructor(site: TestAppSite) {
    this.site = site;
  }
}
