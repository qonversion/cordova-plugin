import {
  AutomationsEventType,
  EntitlementSource,
  IntroEligibilityStatus,
  OfferingTag,
  ProductDuration,
  ProductDurations,
  ProductType,
  ProductTypes,
  EntitlementRenewState,
  SKPeriodUnit,
  SKProductDiscountPaymentMode,
  SKProductDiscountType,
  TrialDuration,
  TrialDurations,
  ExperimentGroupType,
  UserPropertyKey,
  RemoteConfigurationAssignmentType,
  RemoteConfigurationSourceType,
  TransactionType,
  TransactionOwnershipType,
  TransactionEnvironment,
  EntitlementGrantType
} from "./enums";
import {IntroEligibility} from "./IntroEligibility";
import {Offering} from "./Offering";
import {Offerings} from "./Offerings";
import {Entitlement} from "./Entitlement";
import {Product} from "./Product";
import {SKProduct} from "./SKProduct";
import {SKProductDiscount} from "./SKProductDiscount";
import {SKSubscriptionPeriod} from "./SKSubscriptionPeriod";
import {SkuDetails} from "./SkuDetails";
import {ActionResult} from "./ActionResult";
import {QonversionError} from "./QonversionError";
import {AutomationsEvent} from "./AutomationsEvent";
import {User} from './User';
import {RemoteConfig} from "./RemoteConfig";
import {RemoteConfigurationSource} from "./RemoteConfigurationSource";
import {ExperimentGroup} from "./ExperimentGroup";
import {Experiment} from "./Experiment";
import {UserProperty} from './UserProperty';
import {UserProperties} from './UserProperties';
import {Transaction} from "./Transaction";

export type QProduct = {
  id: string;
  storeId: string;
  type: keyof typeof ProductType;
  duration: keyof typeof ProductDuration;
  skuDetails?: QSkuDetails | null; // android
  skProduct?: QSKProduct | null // iOS
  prettyPrice?: string;
  trialDuration: keyof typeof TrialDuration | null;
  offeringId: string | null;
};

type QSkuDetails = {
  description: string;
  freeTrialPeriod: string;
  iconUrl: string;
  introductoryPrice: string;
  introductoryPriceAmountMicros: number;
  introductoryPriceCycles: number;
  introductoryPricePeriod: string;
  originalJson: string;
  originalPrice: string;
  originalPriceAmountMicros: number;
  price: string;
  priceAmountMicros: number;
  priceCurrencyCode: string;
  sku: string;
  subscriptionPeriod: string;
  title: string;
  type: string;
  hashCode: number;
  toString: string;
};

type QSKProduct = {
  subscriptionPeriod: null | QSubscriptionPeriod;
  introductoryPrice: QProductDiscount | null;
  discounts: Array<QProductDiscount> | null;
  localizedDescription: string | undefined;
  localizedTitle: string | undefined;
  price: string;
  priceLocale: QLocale;
  productIdentifier: string | undefined;
  isDownloadable: boolean | undefined;
  downloadContentVersion: string | undefined;
  downloadContentLengths: number[] | undefined;
  productDiscount: SKProductDiscount | undefined;
  subscriptionGroupIdentifier: string | undefined;
  isFamilyShareable: boolean | undefined;
};

type QSubscriptionPeriod = {
  numberOfUnits: number;
  unit: keyof typeof SKPeriodUnit;
};

type QProductDiscount = {
  subscriptionPeriod: null | QSubscriptionPeriod;
  price: string;
  numberOfPeriods: number;
  paymentMode: keyof typeof SKProductDiscountPaymentMode;
  identifier?: string;
  type: keyof typeof SKProductDiscountType;
  priceLocale: QLocale;
};

type QLocale = {
  currencySymbol: string | null;
  currencyCode: string | null;
  localeIdentifier: string;
};

export type QEntitlement = {
  id: string;
  productId: string;
  active: boolean;
  renewState: string;
  source: string;
  startedTimestamp: number;
  expirationTimestamp: number;
  renewsCount: number;
  trialStartTimestamp: number;
  firstPurchaseTimestamp: number;
  lastPurchaseTimestamp: number;
  lastActivatedOfferCode: string;
  grantType: string;
  autoRenewDisableTimestamp: number;
  transactions: Array<QTransaction>;
};

export type QTransaction = {
  originalTransactionId: string;
  transactionId: string;
  offerCode: string;
  transactionTimestamp: number;
  expirationTimestamp: number;
  transactionRevocationTimestamp: number;
  environment: string;
  ownershipType: string;
  type: string;
}

export type QOfferings = {
  availableOfferings?: Array<QOffering>;
  main: QOffering;
};

type QOffering = {
  id: string;
  tag: keyof typeof OfferingTag;
  products: Array<QProduct>;
};

export type QTrialIntroEligibility = {
  status:
    | "non_intro_or_trial_product"
    | "intro_or_trial_eligible"
    | "intro_or_trial_ineligible";
};

type QAutomationsEvent = {
  type: AutomationsEventType;
  timestamp: number;
};

export type QUser = {
  qonversionId: string;
  identityId?: string | null;
};

export type QRemoteConfig = {
  payload: Map<string, Object>;
  experiment?: QExperiment | null;
  source: QRemoteConfigurationSource;
};

export type QRemoteConfigurationSource = {
  id: string;
  name: string;
  type: string;
  assignmentType: string;
};

export type QUserProperties = {
  properties: QUserProperty[];
};

export type QUserProperty = {
  key: string;
  value: string;
};

export type QExperiment = {
  id: string;
  name: string;
  group: QExperimentGroup;
}

export type QExperimentGroup = {
  id: string;
  name: string;
  type: string;
}

const skuDetailsPriceRatio = 1000000;

class Mapper {
  static convertEntitlements(
    entitlements: Record<string, QEntitlement> | null | undefined
  ): Map<string, Entitlement> {
    let mappedPermissions = new Map();

    if (!entitlements) {
      return mappedPermissions;
    }

    for (const key of Object.keys(entitlements)) {
      const entitlement = entitlements[key];
      let renewState: EntitlementRenewState;
      switch (entitlement.renewState) {
        case EntitlementRenewState.NON_RENEWABLE:
          renewState = EntitlementRenewState.NON_RENEWABLE;
          break;
        case EntitlementRenewState.WILL_RENEW:
          renewState = EntitlementRenewState.WILL_RENEW;
          break;
        case EntitlementRenewState.CANCELED:
          renewState = EntitlementRenewState.CANCELED;
          break;
        case EntitlementRenewState.BILLING_ISSUE:
          renewState = EntitlementRenewState.BILLING_ISSUE;
          break;
        default:
          renewState = EntitlementRenewState.UNKNOWN;
          break;
      }

      const entitlementSource = this.convertEntitlementSource(entitlement.source);
      const entitlementGrantType = this.convertEntitlementGrantType(entitlement.grantType);
      const transactions: Array<Transaction> = [];

      if (Array.isArray(entitlement.transactions)) {
        entitlement.transactions.forEach((transaction) => {
          const mappedTransaction = this.convertTransaction(transaction);

          transactions.push(mappedTransaction);
        });
      }

      const mappedPermission = new Entitlement(
          entitlement.id,
          entitlement.productId,
          entitlement.active,
          renewState,
          entitlementSource,
          entitlement.startedTimestamp,
          entitlement.renewsCount,
          entitlementGrantType,
          transactions,
          entitlement.expirationTimestamp,
          entitlement.trialStartTimestamp,
          entitlement.firstPurchaseTimestamp,
          entitlement.lastPurchaseTimestamp,
          entitlement.autoRenewDisableTimestamp,
          entitlement.lastActivatedOfferCode,
      );
      mappedPermissions.set(key, mappedPermission);
    }

    return mappedPermissions;
  }

  static convertTransaction(transaction: QTransaction): Transaction {
    const environment = this.convertTransactionEnvironment(transaction.environment);
    const ownershipType = this.convertTransactionOwnershipType(transaction.ownershipType);
    const type = this.convertTransactionType(transaction.type);

    return new Transaction(
        transaction.originalTransactionId,
        transaction.transactionId,
        transaction.transactionTimestamp,
        environment,
        ownershipType,
        type,
        transaction.expirationTimestamp,
        transaction.transactionRevocationTimestamp,
        transaction.offerCode,
    );
  }

  static convertTransactionType(typeKey: string): TransactionType {
    switch (typeKey) {
      case "SubscriptionStarted":
        return TransactionType.SUBSCRIPTION_STARTED;
      case "SubscriptionRenewed":
        return TransactionType.SUBSCRIPTION_RENEWED;
      case "TrialStarted":
        return TransactionType.TRIAL_STARTED;
      case "IntroStarted":
        return TransactionType.INTRO_STARTED;
      case "IntroRenewed":
        return TransactionType.INTRO_RENEWED;
      case "NonConsumablePurchase":
        return TransactionType.NON_CONSUMABLE_PURCHASE;
    }

    return TransactionType.UNKNOWN;
  }

  static convertTransactionOwnershipType(ownershipTypeKey: string): TransactionOwnershipType {
    switch (ownershipTypeKey) {
      case "Owner":
        return TransactionOwnershipType.OWNER;
      case "FamilySharing":
        return TransactionOwnershipType.FAMILY_SHARING;
    }

    return TransactionOwnershipType.OWNER;
  }

  static convertTransactionEnvironment(envKey: string): TransactionEnvironment {
    switch (envKey) {
      case "Production":
        return TransactionEnvironment.PRODUCTION;
      case "Sandbox":
        return TransactionEnvironment.SANDBOX;
    }

    return TransactionEnvironment.PRODUCTION;
  }

  static convertEntitlementSource(sourceKey: string): EntitlementSource {
    switch (sourceKey) {
      case "Unknown":
        return EntitlementSource.UNKNOWN;
      case "AppStore":
        return EntitlementSource.APP_STORE;
      case "PlayStore":
        return EntitlementSource.PLAY_STORE;
      case "Stripe":
        return EntitlementSource.STRIPE;
      case "Manual":
        return EntitlementSource.MANUAL;
    }

    return EntitlementSource.UNKNOWN;
  }

  static convertEntitlementGrantType(typeKey: string): EntitlementGrantType {
    switch (typeKey) {
      case "Purchase":
        return EntitlementGrantType.PURCHASE;
      case "FamilySharing":
        return EntitlementGrantType.FAMILY_SHARING;
      case "OfferCode":
        return EntitlementGrantType.OFFER_CODE;
      case "Manual":
        return EntitlementGrantType.MANUAL;
    }

    return EntitlementGrantType.PURCHASE;
  }

  static convertDefinedUserPropertyKey(sourceKey: string): UserPropertyKey {
    switch (sourceKey) {
      case '_q_email':
        return UserPropertyKey.EMAIL;
      case '_q_name':
        return UserPropertyKey.NAME;
      case '_q_kochava_device_id':
        return UserPropertyKey.KOCHAVA_DEVICE_ID;
      case '_q_appsflyer_user_id':
        return UserPropertyKey.APPS_FLYER_USER_ID;
      case '_q_adjust_adid':
        return UserPropertyKey.ADJUST_AD_ID;
      case '_q_custom_user_id':
        return UserPropertyKey.CUSTOM_USER_ID;
      case '_q_fb_attribution':
        return UserPropertyKey.FACEBOOK_ATTRIBUTION;
      case '_q_firebase_instance_id':
        return UserPropertyKey.FIREBASE_APP_INSTANCE_ID;
      case '_q_app_set_id':
        return UserPropertyKey.APP_SET_ID;
      case '_q_advertising_id':
        return UserPropertyKey.ADVERTISING_ID;
    }

    return UserPropertyKey.CUSTOM;
  }

  static convertProducts(products: Record<string, QProduct> | null | undefined): Map<string, Product> {
    let mappedProducts = new Map();

    if (!products) {
      return mappedProducts;
    }

    for (const key of Object.keys(products)) {
      const product = products[key];
      const mappedProduct = this.convertProduct(product);
      mappedProducts.set(key, mappedProduct);
    }

    return mappedProducts;
  }

  static convertProduct(product: QProduct): Product {
    const productType: ProductTypes = ProductType[product.type];
    const productDuration: ProductDurations = ProductDuration[product.duration];
    const trialDuration: TrialDurations | undefined = product.trialDuration == null ? undefined : TrialDuration[product.trialDuration];
    const offeringId: string | null = product.offeringId;

    let skProduct: SKProduct | null = null;
    let skuDetails: SkuDetails | null = null;
    let price: number | undefined;
    let currencyCode: string | undefined;
    let storeTitle: string | undefined;
    let storeDescription: string | undefined;
    let prettyIntroductoryPrice: string | undefined;

    if (!!product.skProduct) {
      skProduct = Mapper.convertSKProduct(product.skProduct as QSKProduct);
      price = parseFloat(skProduct.price);
      currencyCode = skProduct.currencyCode;
      storeTitle = skProduct.localizedTitle;
      storeDescription = skProduct.localizedDescription;

      if (skProduct.productDiscount) {
        prettyIntroductoryPrice = skProduct.productDiscount.currencySymbol + skProduct.productDiscount.price;
      }
    } else if (!!product.skuDetails) {
      skuDetails = Mapper.convertSkuDetails(product.skuDetails as QSkuDetails);
      price = skuDetails.priceAmountMicros / skuDetailsPriceRatio;
      currencyCode = skuDetails.priceCurrencyCode;
      storeTitle = skuDetails.title;
      storeDescription = skuDetails.description;

      if (skuDetails.introductoryPrice.length > 0) {
        prettyIntroductoryPrice = skuDetails.introductoryPrice;
      }
    }

    // noinspection UnnecessaryLocalVariableJS
    const mappedProduct = new Product(
      product.id,
      product.storeId,
      productType,
      productDuration,
      skuDetails,
      skProduct,
      product.prettyPrice,
      trialDuration,
      price,
      currencyCode,
      storeTitle,
      storeDescription,
      prettyIntroductoryPrice,
      offeringId
    );

    return mappedProduct;
  }

  static convertOfferings(offerings: QOfferings | null | undefined): Offerings | null {
    if (!offerings) {
      return null;
    }

    if (
      !Array.isArray(offerings.availableOfferings) ||
      offerings.availableOfferings.length === 0
    ) {
      return null;
    }

    let mainOffering: Offering | null = null;
    if (offerings.main) {
      mainOffering = this.convertOffering(offerings.main);
    }

    const availableOfferings: Array<Offering> = [];

    offerings.availableOfferings.forEach((offering) => {
      const mappedOffering = this.convertOffering(offering);

      availableOfferings.push(mappedOffering);
    });

    return new Offerings(mainOffering, availableOfferings);
  }

  static convertOffering(offering: QOffering): Offering {
    const products: Array<Product> = [];
    offering.products.forEach((product) => {
      const mappedProduct = this.convertProduct(product);

      products.push(mappedProduct);
    });

    const tag = OfferingTag[offering.tag] ?? OfferingTag['0'];

    return new Offering(offering.id, tag, products);
  }

  static convertSkuDetails(skuDetails: QSkuDetails): SkuDetails {
    return new SkuDetails(
      skuDetails.description,
      skuDetails.freeTrialPeriod,
      skuDetails.iconUrl,
      skuDetails.introductoryPrice,
      skuDetails.introductoryPriceAmountMicros,
      skuDetails.introductoryPriceCycles,
      skuDetails.introductoryPricePeriod,
      skuDetails.originalJson,
      skuDetails.originalPrice,
      skuDetails.originalPriceAmountMicros,
      skuDetails.price,
      skuDetails.priceAmountMicros,
      skuDetails.priceCurrencyCode,
      skuDetails.sku,
      skuDetails.subscriptionPeriod,
      skuDetails.title,
      skuDetails.type,
      skuDetails.hashCode,
      skuDetails.toString
    );
  }

  static convertSKProduct(skProduct: QSKProduct): SKProduct {
    let subscriptionPeriod: SKSubscriptionPeriod | undefined;
    if (skProduct.subscriptionPeriod != null) {
      subscriptionPeriod = this.convertSubscriptionPeriod(
        skProduct.subscriptionPeriod
      );
    }

    let discount: SKProductDiscount | undefined;
    if (skProduct.introductoryPrice) {
      discount = this.convertProductDiscount(skProduct.introductoryPrice);
    }

    let discounts: SKProductDiscount[] | undefined;
    if (Array.isArray(skProduct.discounts) && skProduct.discounts.length) {
      discounts = this.convertDiscounts(skProduct.discounts);
    }

    return new SKProduct(
      skProduct.localizedDescription,
      skProduct.localizedTitle,
      skProduct.price,
      skProduct.priceLocale.localeIdentifier,
      skProduct.productIdentifier,
      !!skProduct.isDownloadable,
      skProduct.downloadContentVersion,
      skProduct.downloadContentLengths,
      subscriptionPeriod,
      discount,
      discounts,
      skProduct.subscriptionGroupIdentifier,
      skProduct.isFamilyShareable,
      skProduct.priceLocale.currencyCode ?? ""
    );
  }

  static convertSubscriptionPeriod(
    subscriptionPeriod: QSubscriptionPeriod
  ): SKSubscriptionPeriod {
    return new SKSubscriptionPeriod(
      subscriptionPeriod.numberOfUnits,
      SKPeriodUnit[subscriptionPeriod.unit]
    );
  }

  static convertProductDiscount(discount: QProductDiscount): SKProductDiscount {
    let subscriptionPeriod: SKSubscriptionPeriod | undefined = undefined;
    if (discount.subscriptionPeriod != null) {
      subscriptionPeriod = this.convertSubscriptionPeriod(
        discount.subscriptionPeriod
      );
    }
    return new SKProductDiscount(
      discount.price,
      discount.priceLocale.localeIdentifier,
      discount.numberOfPeriods,
      subscriptionPeriod,
      SKProductDiscountPaymentMode[discount.paymentMode],
      discount.identifier,
      SKProductDiscountType[discount.type],
      discount.priceLocale.currencySymbol ?? ""
    );
  }

  static convertDiscounts(
    discounts: Array<QProductDiscount>
  ): SKProductDiscount[] {
    // noinspection UnnecessaryLocalVariableJS
    const mappedDiscounts: SKProductDiscount[] = discounts.map((discount) => {
      return this.convertProductDiscount(discount);
    });
    return mappedDiscounts;
  }

  static convertEligibility(
    eligibilityMap: Record<string, QTrialIntroEligibility> | null | undefined
  ): Map<string, IntroEligibility> {
    let mappedEligibility = new Map<string, IntroEligibility>();

    if (!eligibilityMap) {
      return mappedEligibility;
    }

    for (const key of Object.keys(eligibilityMap)) {
      const value = eligibilityMap[key];
      const status = Mapper.convertEligibilityStatus(value.status);

      const eligibilityInfo = new IntroEligibility(status);
      mappedEligibility.set(key, eligibilityInfo);
    }

    return mappedEligibility;
  }

  static convertEligibilityStatus(status: string): IntroEligibilityStatus {
    switch (status) {
      case "non_intro_or_trial_product":
        return IntroEligibilityStatus.NON_INTRO_OR_TRIAL_PRODUCT;
      case "intro_or_trial_eligible":
        return IntroEligibilityStatus.ELIGIBLE;
      case "intro_or_trial_ineligible":
        return IntroEligibilityStatus.INELIGIBLE;
      default:
        return IntroEligibilityStatus.UNKNOWN;
    }
  }

  static convertActionResult(
    payload: Record<string, any>
  ): ActionResult {
    return new ActionResult(
      payload["type"],
      payload["value"],
      this.convertQonversionError(payload["error"])
    )
  }

  static convertQonversionError(
    payload: Record<string, string> | undefined
  ): QonversionError | undefined {
    return payload ? new QonversionError(
      payload["code"],
      payload["description"],
      payload["additionalMessage"],
      payload["domain"],
    ) : undefined;
  }

  static convertAutomationsEvent(
    automationsEvent: QAutomationsEvent
  ): AutomationsEvent {
    return new AutomationsEvent(
      automationsEvent.type,
      automationsEvent.timestamp
    )
  }

  static convertUserInfo(user: QUser) {
    return new User(user.qonversionId, user.identityId);
  }

  static convertRemoteConfig(remoteConfig: QRemoteConfig): RemoteConfig {
    let experiment = null;
    if (remoteConfig.experiment) {
      const groupType = this.convertGroupType(remoteConfig.experiment.group.type);
      const group = new ExperimentGroup(remoteConfig.experiment.group.id, remoteConfig.experiment.group.name, groupType);
      experiment = new Experiment(remoteConfig.experiment.id, remoteConfig.experiment.name, group);
    }

    const sourceType = this.convertRemoteConfigurationSourceType (remoteConfig.source.type);
    const assignmentType = this.convertRemoteConfigurationAssignmentType (remoteConfig.source.assignmentType);

    const source = new RemoteConfigurationSource(remoteConfig.source.id, remoteConfig.source.name, sourceType, assignmentType)

    return new RemoteConfig(remoteConfig.payload, experiment, source);
  }

  static convertRemoteConfigurationSourceType(type: String): RemoteConfigurationSourceType {
    switch (type) {
      case "experiment_control_group":
        return RemoteConfigurationSourceType.EXPERIMENT_CONTROL_GROUP;
      case "experiment_treatment_group":
        return RemoteConfigurationSourceType.EXPERIMENT_TREATMENT_GROUP;
      case "remote_configuration":
        return RemoteConfigurationSourceType.REMOTE_CONFIGURATION;
      default:
        return RemoteConfigurationSourceType.UNKNOWN;
    }
  }

  static convertRemoteConfigurationAssignmentType(type: String): RemoteConfigurationAssignmentType {
    switch (type) {
      case "auto":
        return RemoteConfigurationAssignmentType.AUTO;
      case "manual":
        return RemoteConfigurationAssignmentType.MANUAL;
      default:
        return RemoteConfigurationAssignmentType.UNKNOWN;
    }
  }

  static convertUserProperties(properties: QUserProperties): UserProperties {
    const mappedProperties = properties.properties.map(propertyData => {
      const definedKey = Mapper.convertDefinedUserPropertyKey(propertyData.key);
      return new UserProperty(propertyData.key, propertyData.value, definedKey);
    });

    return new UserProperties(mappedProperties);
  }

  static convertGroupType(type: String): ExperimentGroupType {
    switch (type) {
      case "control":
        return ExperimentGroupType.CONTROL;
      case "treatment":
        return ExperimentGroupType.TREATMENT;
      default:
        return ExperimentGroupType.UNKNOWN;
    }
  }
}

export default Mapper;
