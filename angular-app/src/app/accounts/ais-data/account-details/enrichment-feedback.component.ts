import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {EnrichmentFeedbackModalContent} from "./enrichment.feedback.modal.content";
import {TestAppTransaction} from "../../../common/service/yts/test.app.transaction";
import {BackendService} from "../../../common/service/yts/backend.service";
import {MerchantSuggestions} from "../../../common/service/yts/merchant.suggestions";
import {SimilarTransactionsForUpdates} from "../../../common/service/yts/similar.transactions.for.updates";
import {SimilarTransactionsMerchantUpdate} from "../../../common/service/yts/similar.transactions.merchant.update";
import {SingleTransactionMerchantUpdate} from "../../../common/service/yts/single.transaction.merchant.update";
import {MerchantFeedbackEvent} from "./merchant.feedback.event";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";


@Component({
  templateUrl: './enrichment.feedback.component.html'
})
export class EnrichmentFeedbackComponent implements OnInit {

  public modalContent: EnrichmentFeedbackModalContent;
  public merchantSuggestions: MerchantSuggestions;
  public similarTransactions: SimilarTransactionsForUpdates;
  public newMerchant: NewMerchant = new NewMerchant();
  public showSimilarTransactions: boolean;

  @Output()
  public merchantUpdateEventEmitter: EventEmitter<MerchantFeedbackEvent> = new EventEmitter();

  constructor(private backendService: BackendService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    // works not
    this.backendService.getMerchantSuggestions().subscribe(suggestions => {
      this.merchantSuggestions = suggestions;
    })
  }

  toggleUpdateSimilar(transaction: TestAppTransaction) {
    this.showSimilarTransactions = !this.similarTransactions;
    if (this.similarTransactions) {
      this.similarTransactions = null;
    } else {
      this.backendService.getSimilarTransactions(transaction.transaction.accountId,
        transaction.transaction.id,
        transaction.transaction.date).subscribe(similarTransactions => {
        this.similarTransactions = similarTransactions;
      });
    }
  }

  submit() {
    if (this.newMerchant == null || this.newMerchant.value == null) {
      return;
    }

    if (this.similarTransactions && this.similarTransactions.groups.length > 0) {
      console.log('updating similar transactions');
      this.backendService.updateMerchantsForSimilarTransactions(new SimilarTransactionsMerchantUpdate(
        this.similarTransactions.updateSessionId,
        this.similarTransactions.groups.map(group => group.groupSelector),
        this.newMerchant.value
      )).subscribe(() => {
        this.merchantUpdateEventEmitter.emit(new MerchantFeedbackEvent())
      });
    } else {
      // Update transaction
      this.backendService.updateMerchantForTransaction(new SingleTransactionMerchantUpdate(
        this.modalContent.transaction.transaction.accountId,
        this.modalContent.transaction.transaction.id,
        this.modalContent.transaction.transaction.date,
        this.newMerchant.value)).subscribe(() => {
        this.merchantUpdateEventEmitter.emit(new MerchantFeedbackEvent())
      })
    }


  }
}

class NewMerchant {
  public value;
}

