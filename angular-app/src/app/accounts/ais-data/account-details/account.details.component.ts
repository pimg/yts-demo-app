import {Component, Input, OnInit} from "@angular/core";
import {BackendService} from "../../../common/service/yts/backend.service";
import {TestAppTransactionPage} from "../../../common/service/yts/test.app.transaction.page";
import {AccountListItem} from "../accounts-list/account.list.item";
import {throwError} from "rxjs";
import {TestAppTransaction} from "../../../common/service/yts/test.app.transaction";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EnrichmentFeedbackComponent} from "./enrichment-feedback.component";
import {EnrichmentFeedbackModalContent, FeedbackField} from "./enrichment.feedback.modal.content";

@Component({
  selector: 'account-details',
  templateUrl: './account.details.component.html'
})
export class AccountDetailsComponent implements OnInit {

  public transactionPage: TestAppTransactionPage;
  public accountListItemSingleItemArray = [];
  public expandedTransaction: TestAppTransaction;
  private closeResult: string;

  @Input()
  private accountListItem: AccountListItem;

  constructor(private backendService: BackendService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    if (!this.accountListItem) {
      throwError("I don't work without an account id");
    }

    this.loadTransactions();

    this.backendService.getAllAccounts().subscribe(accounts => {
      let testAppAccount = accounts.find(a => a.account.id === this.accountListItem.account.id);
      if (testAppAccount) {
        this.accountListItemSingleItemArray.push(new AccountListItem(testAppAccount));
      }
    });
  }

  private loadTransactions() {
    this.backendService.getTransactionsForAccount(this.accountListItem.account.id).subscribe(transactionPage => {
      this.transactionPage = transactionPage;
    })
  }

  public dataLoaded() {
    return this.accountListItemSingleItemArray.length > 0 && this.transactionPage;
  }

  public toggleDetails(testAppTransaction: TestAppTransaction) {
    if (this.expandedTransaction && this.expandedTransaction.transaction.id == testAppTransaction.transaction.id) {
      this.expandedTransaction = null;
    } else {
      this.expandedTransaction = testAppTransaction;
    }
  }

  public open(testAppTransaction: TestAppTransaction) {
    const modalRef = this.modalService.open(EnrichmentFeedbackComponent)
    modalRef.result.then((result) => {
      console.log('closed s ' + result);
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      console.log('closed d ' + reason);
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    modalRef.componentInstance.modalContent = new EnrichmentFeedbackModalContent(testAppTransaction, FeedbackField.merchant);
    modalRef.componentInstance.merchantUpdateEventEmitter.subscribe(() => {
      this.loadTransactions();
      modalRef.close();
    })
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
