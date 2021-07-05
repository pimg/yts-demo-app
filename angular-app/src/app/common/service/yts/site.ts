import {Services} from "./services";

export class Site {
  id:string;
  name:string;
  supportedAccountTypes: string[]
  connectionType: string;
  services: Services;
  groupingBy;
  tags: string[];
  enabled: boolean;
  availableInCountries: string[];
  noLongerSupported: Boolean;
  iconLink: string;
}
