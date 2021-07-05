import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, NavigationStart, Router} from "@angular/router";
import {BackendService} from "../service/yts/backend.service";
import {CreateUserSiteResponse} from "../service/yts/create.user.site.response";
import {interval, Subscription} from "rxjs";
import {startWith, switchMap} from "rxjs/operators";

/**
 * This component serves as a return page for both AIS and PIS flows. We therefore have combined accounts (AIS) and
 * payments (PIS) logic in this component. In a normal scenario we would probably extract this into separate components.
 * However, we MUST have a single return URL for both AIS and PIS, since it will prevent us from having to manage
 * multiple URLs at potentially many banks. We therefore accept that this components has multiple roles.
 */
@Component({
  templateUrl: './returning.user.component.html'
})
export class ReturningUserComponent implements OnInit {

  createUserSiteResponse: CreateUserSiteResponse;
  timeInterval: Subscription;
  dataFetchSuccess: Boolean;
  enrichmentSuccess: Boolean;

  constructor(private route: ActivatedRoute,
              private backendService: BackendService,
              private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.stopPolling();
      }
    });
  }

  ngOnInit(): void {
    this.backendService.createUserSiteFromRedirectUrl(window.location.href).subscribe(result => {
        this.createUserSiteResponse = result;
        if (this.createUserSiteResponse.userSite.connectionStatus === 'CONNECTED') {
          this.startPolling(result.activityId);
        } else if (this.createUserSiteResponse.userSite.connectionStatus === 'STEP_NEEDED') {
          console.log('A step is needed!');
        } else {
          this.goHome();
        }

        // TODO : handle STEP_NEEDED
      }
    );
  }

  startPolling(activityId: string) {
    this.timeInterval = interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.backendService.getActivities()))
      .subscribe(activities => {
          activities.forEach(a => {
            if (a.activityId === activityId) {

              if (a.updates.filter(update => update.event === 'DATA_SAVED').length == 1) {
                this.dataFetchSuccess = true;
              }

              const activityFinishedUpdate = a.updates.find(update => update.event === 'ACTIVITY_FINISHED');
              if (activityFinishedUpdate) {
                // Check the user-site to find out what happened. There is always just 1 user-site in this scenario
                activityFinishedUpdate.userSites.forEach(us => {
                  if (us.connectionStatus === 'CONNECTED' && !us.failureReason) {
                    this.stopPolling();
                    this.enrichmentSuccess = true;
                    this.goHome();
                  } else {
                    this.dataFetchSuccess = false;
                    this.enrichmentSuccess = false;
                  }
                });
              }
            }
          });
        },
        error => {
          console.log('Error : ' + error)
          this.timeInterval.unsubscribe();
        });
  }

  private goHome() {
    // Wait for 2 seconds and return to home
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2000);
  }

  private stopPolling() {
    if (this.timeInterval != null) {
      this.timeInterval.unsubscribe();
    }
    this.timeInterval = null;
  }

}

