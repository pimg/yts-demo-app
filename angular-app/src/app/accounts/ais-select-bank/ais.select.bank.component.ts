import {Component} from "@angular/core";
import {BankSelectedEvent} from "../../common/select-bank/bank.selected.event";
import {Router} from "@angular/router";

@Component({
  templateUrl: './ais.select.bank.component.html'
})
export class AisSelectBankComponent {

  constructor(private router: Router) {
  }

  bankClicked($event: BankSelectedEvent) {
    this.router.navigate(['ais', 'provide-consent', $event.site.site.id]);
  }
}
