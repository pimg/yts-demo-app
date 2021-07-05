import {Component} from '@angular/core';
import {NavigationStart, Router} from "@angular/router";
import {BackendService} from "./common/service/yts/backend.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  // blocks all rendering until a user was created
  public loggedIn: boolean;

  constructor(private router: Router,
              private backendService: BackendService) {

    // We set a cookie that is not accessible by Javascript. Therefore we ask the backend to check whether a cookie is present
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.backendService.hasUserCookie().subscribe(result => {
          if (!result.hasCookie) {
            this.backendService.createUser().subscribe(result => {
              this.loggedIn = true;
            });
          } else {
            this.loggedIn = true;
          }
        })
      }
    });
  }
}
