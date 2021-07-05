import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, interval, Observable, Subject, Subscription} from 'rxjs';
import {AppSettings} from "../../../app.settings";
import {LoginStep} from "./login.step";
import {User} from "../../user/user";
import {HasCookie} from "./has.cookie";
import {CreateUserSiteResponse} from "./create.user.site.response";
import {TestAppSite} from "./test.app.site";
import {TestAppUserSite} from "./test.app.user.site";
import {RefreshUserSitesResponse} from "./refresh.user.sites.response";
import {Activity} from "./activity";
import {TestAppAccount} from "./test.app.account";
import {startWith, switchMap} from "rxjs/operators";
import {Transaction} from "./transaction";
import {TestAppTransactionPage} from "./test.app.transaction.page";
import {MerchantSuggestions} from "./merchant.suggestions";
import {SimilarTransactionsForUpdates} from "./similar.transactions.for.updates";
import {SimilarTransactionsMerchantUpdate} from "./similar.transactions.merchant.update";
import {EnrichmentUpdateActivity} from "./enrichment.update.activity";
import {SingleTransactionMerchantUpdate} from "./single.transaction.merchant.update";

@Injectable()
export class BackendService {

  private timeInterval: Subscription;
  public allActivitiesSubject = new BehaviorSubject<Activity[]>([]);
  public finishedActivitySubject = new BehaviorSubject<Activity>(null);

  constructor(private http: HttpClient) {
  }

  // Sites

  getSites(): Observable<TestAppSite[]> {
    return this.http.get<TestAppSite[]>(AppSettings.apiContext + '/sites', AppSettings.httpOptions);
  }

  getSite(siteId: string): Observable<TestAppSite> {
    return this.http.get<TestAppSite>(AppSettings.apiContext + '/sites/' + siteId, AppSettings.httpOptions);
  }

  // Connect

  connect(siteId: string): Observable<LoginStep> {
    return this.http.post<LoginStep>(AppSettings.apiContext + '/connect?siteId=' + siteId, AppSettings.httpOptions)
  }

  // User

  createUser(): Observable<User> {
    return this.http.post<User>(AppSettings.apiContext + '/user', AppSettings.httpOptions);
  }

  hasUserCookie(): Observable<HasCookie> {
    return this.http.get<HasCookie>(AppSettings.apiContext + '/user', AppSettings.httpOptions);
  }

  // Accounts

  getAllAccounts(): Observable<TestAppAccount[]> {
    return this.http.get<TestAppAccount[]>(AppSettings.apiContext + '/accounts', AppSettings.httpOptions);
  }

  getAccounts(userSiteId: string): Observable<TestAppAccount[]> {
    return this.http.get<TestAppAccount[]>(AppSettings.apiContext + '/accounts?userSiteId=' + userSiteId, AppSettings.httpOptions);
  }

  deleteActivity(activityId: string): Observable<void> {
    return this.http.delete<void>(AppSettings.apiContext + '/activities/' + activityId, AppSettings.httpOptions);
  }

  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(AppSettings.apiContext + '/activities', AppSettings.httpOptions);
  }

  // Transactions

  getTransactionsAll(): Observable<TestAppTransactionPage> {
    return this.http.get<TestAppTransactionPage>(AppSettings.apiContext + '/transactions');
  }

  getTransactionsAllNext(next: string): Observable<TestAppTransactionPage> {
    return this.http.get<TestAppTransactionPage>(AppSettings.apiContext + '/transactions?next=' + next);
  }

  getTransactionsForAccount(accountId: string): Observable<TestAppTransactionPage> {
    return this.http.get<TestAppTransactionPage>(AppSettings.apiContext + '/transactions?accountId=' + accountId);
  }

  getTransactionsForAccountNext(accountId: string, next: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(AppSettings.apiContext + '/transactions?accountId=' + accountId + '&next=' + next);
  }

  // Enrichment

  getMerchantSuggestions(): Observable<MerchantSuggestions> {
    return this.http.get<MerchantSuggestions>(AppSettings.apiContext + '/merchant-suggestions');
  }

  getSimilarTransactions(accountId: string, transactionId: string, date: string): Observable<SimilarTransactionsForUpdates> {
    return this.http.get<SimilarTransactionsForUpdates>(AppSettings.apiContext + '/similar-transactions?accountId=' + accountId + '&transactionId=' + transactionId + '&date=' + date);
  }

  updateMerchantsForSimilarTransactions(similarTransactionsMerchantUpdate: SimilarTransactionsMerchantUpdate): Observable<EnrichmentUpdateActivity> {
    return this.http.post<EnrichmentUpdateActivity>(AppSettings.apiContext + '/update-similar-transactions/merchant', similarTransactionsMerchantUpdate);
  }

  updateMerchantForTransaction(singleTransactionMerchantUpdate: SingleTransactionMerchantUpdate): Observable<EnrichmentUpdateActivity> {
    return this.http.post<EnrichmentUpdateActivity>(AppSettings.apiContext + '/update-transaction/merchant', singleTransactionMerchantUpdate);
  }

  // User sites

  createUserSiteFromRedirectUrl(redirectUrl: string): Observable<CreateUserSiteResponse> {
    return this.http.post<CreateUserSiteResponse>(AppSettings.apiContext + '/user-sites/url', {"redirectUrl": redirectUrl}, AppSettings.httpOptions);
  }

  getUserSites(): Observable<TestAppUserSite[]> {
    return this.http.get<TestAppUserSite[]>(AppSettings.apiContext + '/user-sites', AppSettings.httpOptions);
  }

  getUserSite(userSiteId: string): Observable<TestAppUserSite> {
    return this.http.get<TestAppUserSite>(AppSettings.apiContext + '/user-sites/' + userSiteId, AppSettings.httpOptions);
  }

  refreshUserSite(userSiteId: string): Observable<RefreshUserSitesResponse> {
    return this.http.post<RefreshUserSitesResponse>(AppSettings.apiContext + '/user-sites/' + userSiteId + '/refresh', AppSettings.httpOptions)
  }

  refreshAllUserSites(): Observable<RefreshUserSitesResponse> {
    return this.http.post<RefreshUserSitesResponse>(AppSettings.apiContext + '/user-sites/refresh', AppSettings.httpOptions)
  }

  deleteUserSite(userSiteId: string): Observable<void> {
    return this.http.delete<void>(AppSettings.apiContext + '/user-sites/' + userSiteId, AppSettings.httpOptions);
  }

  updateConsent(userSiteId: string): Observable<LoginStep> {
    return this.http.post<LoginStep>(AppSettings.apiContext + '/user-sites/' + userSiteId + '/update-consent', AppSettings.httpOptions)
  }

  public pollForActivities() {
    // polling in progress
    if (this.timeInterval) {
      return;
    }

    this.timeInterval = interval(1000)
      .pipe(
        startWith(0),
        switchMap(() => this.getActivities()))
      .subscribe(activities => {
        if (activities.length == 0) {
          this.stopPollingForActivities();
        } else {
          this.allActivitiesSubject.next(activities);
          activities.forEach(a => {
            // We bluntly remove any activities that had an ACTIVITY_FINISHED update. No second chances for observers.
            // Note that the backend also removes activities that are finished
            if (a.updates.filter(u => u.event == 'ACTIVITY_FINISHED').length == 1) {
              this.deleteActivity(a.activityId).subscribe();
              this.finishedActivitySubject.next(a);
            }
          })
        }
      })
  }

  private stopPollingForActivities() {
    this.timeInterval.unsubscribe();
    this.timeInterval = null;
  }

}
