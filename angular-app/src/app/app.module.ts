import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SelectBankComponent} from "./common/select-bank/select.bank.component";
import {BackendService} from "./common/service/yts/backend.service";
import {HttpClientModule} from "@angular/common/http";
import {ProvideConsentComponent} from "./accounts/provide-consent/provide.consent.component";
import {ReturningUserComponent} from "./common/returning-user/returning.user.component";
import {UserSitesListComponent} from "./accounts/ais-data/user-sites-list/user.sites.list.component";
import {RefreshStatusComponent} from "./accounts/ais-data/refresh-status/refresh.status.component";
import {AccountDetailsComponent} from "./accounts/ais-data/account-details/account.details.component";
import {AccountListItemComponent} from "./accounts/ais-data/accounts-list/account.list.item.component";
import {AccountsListComponent} from "./accounts/ais-data/accounts-list/accounts.list.component";
import {EnrichmentFeedbackComponent} from "./accounts/ais-data/account-details/enrichment-feedback.component";
import {PisDataComponent} from "./payments/pis-data/pis.data.component";
import {AisDataComponent} from "./accounts/ais-data/ais.data.component";
import {AisSelectBankComponent} from "./accounts/ais-select-bank/ais.select.bank.component";
import {PisSelectBankComponent} from "./payments/pis-select-bank/pis.select.bank.component";
import {CommonModule} from "@angular/common";
import {InitiatePaymentComponent} from "./payments/initiate-payment/initiate.payment.component";
import {AisFormComponent} from "./accounts/ais-form/ais.form.component";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DynamicFormFieldComponent} from "./payments/initiate-payment/dynamic.form.field.component";
import {DynamicFormComponent} from "./payments/initiate-payment/dynamic.form.component";

@NgModule({
  declarations: [
    AppComponent,
    SelectBankComponent,
    ProvideConsentComponent,
    ReturningUserComponent,
    UserSitesListComponent,
    RefreshStatusComponent,
    AccountListItemComponent,
    AccountsListComponent,
    AccountDetailsComponent,
    EnrichmentFeedbackComponent,
    PisDataComponent,
    AisDataComponent,
    AisSelectBankComponent,
    PisSelectBankComponent,
    InitiatePaymentComponent,
    AisFormComponent,
    DynamicFormFieldComponent,
    DynamicFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    NgbModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [BackendService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
