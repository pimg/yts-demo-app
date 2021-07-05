export class UserSite {
  id: string;
  connectionStatus: string;
  consentValidFrom: string;
  lastDataFetchFailureReason: string;
  lastDataFetchTime: string;
  metaData: any;
  site: InlinedSite;
}

class InlinedSite {
  id: string;
  name: string;
  supportedAccountTypes: String[];
}
