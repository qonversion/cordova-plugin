import {PurchaseResult} from './PurchaseResult';

export interface DeferredPurchasesListener {

  /**
   * Called when a deferred purchase is completed.
   * For example, when pending purchases like SCA, Ask to buy, etc., are finished.
   * @param purchaseResult the result of the completed deferred purchase.
   */
  onDeferredPurchaseCompleted(purchaseResult: PurchaseResult): void;
}
