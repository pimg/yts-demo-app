import {ActivityUserSite} from "./activity.user.site";

export class ActivityUpdate {
  activityId: string;
  activity: string;
  event: string;
  dateTime: string;
  userSites: ActivityUserSite[];
  userId: string;
}
