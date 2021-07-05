import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {BackendService} from "../../common/service/yts/backend.service";
import {FormBuilder, FormControl} from "@angular/forms";
import {FormFieldBase} from "./form.field.base";
import {FormFieldTextInput} from "./form.field.text.input";

@Component({
  templateUrl: './initiate.payment.component.html'
})
export class InitiatePaymentComponent implements OnInit {

  siteId: string;
  paymentType: string;
  fields: FormFieldBase<string>[];

  amountControl = new FormControl('');

  constructor(private route: ActivatedRoute, private backendService: BackendService, private fb: FormBuilder) {
    route.params.subscribe(val => {
      this.siteId = this.route.snapshot.paramMap.get('siteId');
    });

  }

  ngOnInit(): void {
    this.backendService.getSite(this.siteId).subscribe(site => {
      if (this.paymentType === 'sepa') {
        const singleSepa = site.site.services.pis.singleSepa;

      }
    })
  }

  submit() {

  }

  private static singleSepaFields(): FormFieldBase<string> [] {

    var fieldList: FormFieldBase<string>[] = [];

    var amountField = new FormFieldTextInput({
      key: 'amount',
      label: 'Amount',
      type: 'amount',
      order: 1
    });

    var sepaAccountNumberField = new FormFieldTextInput({
      key: 'iban',
      label: 'IBAN',
      type: 'iban',
      order: 2
    });

    return fieldList;


  }
}
