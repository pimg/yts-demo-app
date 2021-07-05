import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProvideConsentComponent} from "./accounts/provide-consent/provide.consent.component";
import {ReturningUserComponent} from "./common/returning-user/returning.user.component";
import {PisDataComponent} from "./payments/pis-data/pis.data.component";
import {AisDataComponent} from "./accounts/ais-data/ais.data.component";
import {AisSelectBankComponent} from "./accounts/ais-select-bank/ais.select.bank.component";
import {PisSelectBankComponent} from "./payments/pis-select-bank/pis.select.bank.component";
import {InitiatePaymentComponent} from "./payments/initiate-payment/initiate.payment.component";

const routes: Routes = [
  {
    path: '', redirectTo: '/ais/accounts', pathMatch: 'full'
  },
  {
    path: 'ais', redirectTo: '/ais/accounts', pathMatch: 'full'
  },
  {
    path: 'ais/accounts',
    component: AisDataComponent,
    data: {tab: 'tab-accounts'}
  },
  {
    path: 'ais/connections',
    component: AisDataComponent,
    data: {tab: 'tab-connections'}
  },
  {
    path: 'ais/accounts/:accountNumber',
    component: AisDataComponent,
    data: {tab: 'tab-account-details'}
  },
  {
    path: 'ais/select-bank',
    component: AisSelectBankComponent
  },
  {
    path: 'ais/provide-consent/:siteId',
    component: ProvideConsentComponent
  },
  {
    path: 'ais/callback',
    component: ReturningUserComponent
  },
  {
    path: '', redirectTo: '/pis/payments', pathMatch: 'full'
  },
  {
    path: 'pis', redirectTo: '/pis/payments', pathMatch: 'full'
  },
  {
    path: 'pis/payments',
    component: PisDataComponent
  },
  {
    path: 'pis/select-bank',
    component: PisSelectBankComponent
  },
  {
    path: 'pis/initiate-payment/:siteId',
    component: InitiatePaymentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
