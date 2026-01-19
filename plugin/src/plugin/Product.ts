import {ProductType} from "./enums";
import {SKProduct} from "./SKProduct";
import {ProductStoreDetails} from "./ProductStoreDetails";
import {SubscriptionPeriod} from './SubscriptionPeriod';

export class Product {
  qonversionId: string;
  storeId: string | null;

  /**
   * Identifier of the base plan for Google product.
   */
  basePlanId: string | null;

  /**
   * Google Play Store details of this product.
   * Android only. Null for iOS, or if the product was not found.
   */
  storeDetails: ProductStoreDetails | null;

  /**
   * App store details of this product.
   * iOS only. Null for Android, or if the product was not found.
   */
  skProduct: SKProduct | null;

  offeringId?: string | null;

  /**
   * For Android - the subscription base plan duration from {@link storeDetails}.
   * For iOS - the duration of the {@link skProduct}.
   * Null, if it's not a subscription product or the product was not found in the store.
   */
  subscriptionPeriod: SubscriptionPeriod | null;

  /**
   * The subscription trial duration of the default offer for Android or of the product for iOS.
   * See {@link ProductStoreDetails.defaultSubscriptionOfferDetails} for the information on how we
   * choose the default offer for Android.
   * Null, if it's not a subscription product or the product was not found the store.
   */
  trialPeriod: SubscriptionPeriod | null;

  /**
   * The calculated type of this product based on the store information.
   * On Android uses {@link storeDetails} information.
   * On iOS uses {@link skProduct} information.
   */
  type: ProductType;

  /**
   * Formatted price of for this product, including the currency sign.
   */
  prettyPrice: string | null;

  price?: number;
  currencyCode?: string;
  storeTitle?: string;
  storeDescription?: string;
  prettyIntroductoryPrice?: string;

  constructor(
    qonversionId: string,
    storeId: string,
    basePlanId: string | null,
    storeDetails: ProductStoreDetails | null,
    skProduct: SKProduct | null,
    offeringId: string | null,
    subscriptionPeriod: SubscriptionPeriod | null,
    trialPeriod: SubscriptionPeriod | null,
    type: ProductType,
    prettyPrice: string | null,
    price: number | undefined,
    currencyCode: string | undefined,
    storeTitle: string | undefined,
    storeDescription: string | undefined,
    prettyIntroductoryPrice: string | undefined,
  ) {
    this.qonversionId = qonversionId;
    this.storeId = storeId;
    this.basePlanId = basePlanId;
    this.storeDetails = storeDetails;
    this.skProduct = skProduct;
    this.offeringId = offeringId;
    this.subscriptionPeriod = subscriptionPeriod;
    this.trialPeriod = trialPeriod;
    this.type = type;
    this.prettyPrice = prettyPrice;
    this.price = price;
    this.currencyCode = currencyCode;
    this.storeTitle = storeTitle;
    this.storeDescription = storeDescription;
    this.prettyIntroductoryPrice = prettyIntroductoryPrice;
  }
}
