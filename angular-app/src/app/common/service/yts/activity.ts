import {ActivityUpdate} from "./activity.update";

export class Activity {
  started: string;
  userId: string;
  activityId: string;
  updates: ActivityUpdate[];
  userSites: string[];

}
