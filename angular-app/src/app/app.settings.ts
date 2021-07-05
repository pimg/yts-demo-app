import {HttpHeaders} from "@angular/common/http";

export class AppSettings {
  public static apiContext: string = "/api";
  public static httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
}
