import {Component, OnInit, EventEmitter, Output, Input} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {BackendService} from "../service/yts/backend.service";
import {TestAppSite} from "../service/yts/test.app.site";
import {BankSelectedEvent} from "./bank.selected.event";

@Component({
  selector: 'select-bank',
  templateUrl: './select.bank.component.html'
})
export class SelectBankComponent implements OnInit {

  service: string = this.route.snapshot.paramMap.get('service');
  testAppSites: TestAppSite[];

  @Input()
  public serviceType: string;

  @Output()
  public bankSelectedEventEmitter = new EventEmitter<BankSelectedEvent>();

  constructor(private route: ActivatedRoute, private backendService: BackendService) {
  }

  ngOnInit(): void {
    if (!this.serviceType) {
      throw new Error('I need a serviceType to work');
    }

    this.backendService.getSites().subscribe(sites => {
      if (this.serviceType == 'pis') {
        this.testAppSites = SelectBankComponent.filterSinglePaymentBanks(sites);
      } else if (this.serviceType == 'ais') {
        this.testAppSites = SelectBankComponent.filterAisBanks(sites);
      } else {
        throw new Error('I didn\'t recognize the service type ' + this.serviceType);
      }
    })
  }

  private static filterSinglePaymentBanks(sites: TestAppSite[]): TestAppSite[] {
    return sites.filter(s => s.site.services.pis &&
      ((s.site.services.pis.singleSepa && s.site.services.pis.singleSepa.supported) ||
        (s.site.services.pis.ukDomesticSingle && s.site.services.pis.ukDomesticSingle.supported)));
  }

  private static filterAisBanks(sites: TestAppSite[]): TestAppSite[] {
    return sites.filter(s => s.site.services.ais);
  }

  public selected(site: TestAppSite) {
    this.bankSelectedEventEmitter.emit(new BankSelectedEvent(site))
  }
}
