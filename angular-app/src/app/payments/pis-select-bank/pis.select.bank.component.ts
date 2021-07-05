import {Component} from "@angular/core";
import {BankSelectedEvent} from "../../common/select-bank/bank.selected.event";
import {BackendService} from "../../common/service/yts/backend.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  templateUrl: './pis.select.bank.component.html'
})
export class PisSelectBankComponent {

  type: string;

  constructor(private backendService: BackendService, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.type = params.type;
    });
  }

  bankClicked($event: BankSelectedEvent) {
    this.router.navigate(['pis', 'initiate-payment', $event.site.site.id]);
  }

}
