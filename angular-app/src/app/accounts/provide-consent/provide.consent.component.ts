import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {BackendService} from "../../common/service/yts/backend.service";
import {throwError} from "rxjs";
import {TestAppSite} from "../../common/service/yts/test.app.site";


@Component({
  templateUrl: './provide.consent.component.html'
})
export class ProvideConsentComponent implements OnInit {

  testAppSite: TestAppSite;
  siteId: string;

  constructor(private route: ActivatedRoute, private backendService: BackendService) {
    route.params.subscribe(val => {
      this.siteId = this.route.snapshot.paramMap.get('siteId');
    });
  }

  ngOnInit(): void {
    this.backendService.getSite(this.siteId).subscribe(site => {
      this.testAppSite = site;
    })
  }

  saveConsentAndRedirectToBank() {
    // TODO : save consent here
    console.log("To do : save this consent somewhere when real users get involved");
    this.backendService.connect(this.testAppSite.site.id).subscribe(result => {
      if (result.redirect) {
        window.location.replace(result.redirect.url);
      }

      if (result.form) {
        console.log('A form is presented');
      }

      throwError("Neither a form nor a redirect was received")
    })
  }
}
