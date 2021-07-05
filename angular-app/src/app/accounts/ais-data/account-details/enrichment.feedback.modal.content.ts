import {TestAppTransaction} from "../../../common/service/yts/test.app.transaction";

export class EnrichmentFeedbackModalContent {
  transaction: TestAppTransaction;
  feedbackField: FeedbackField;

  constructor(transaction: TestAppTransaction, feedbackField: FeedbackField) {
    this.transaction = transaction;
    this.feedbackField = feedbackField;
  }
}

export enum FeedbackField {
  category, merchant
}
