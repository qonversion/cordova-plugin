import {QonversionConfig} from './QonversionConfig';
import {QonversionApi} from './QonversionApi';
import QonversionInternal from './QonversionInternal';
import {SKProduct} from './SKProduct';
import {SKProductDiscount} from './SKProductDiscount';
import {SKSubscriptionPeriod} from './SKSubscriptionPeriod';
import {SkuDetails} from './SkuDetails';
import {ActionResult} from './ActionResult';
import {AutomationsEvent} from './AutomationsEvent';
import {Entitlement} from './Entitlement';
import {
  ActionResultType,
  AttributionProvider,
  AutomationsEventType,
  EntitlementGrantType,
  EntitlementRenewState,
  EntitlementsCacheLifetime,
  EntitlementSource,
  Environment,
  ExperimentGroupType,
  IntroEligibilityStatus,
  LaunchMode,
  OfferingTag,
  PricingPhaseRecurrenceMode,
  PricingPhaseType,
  ProductType,
  PurchaseUpdatePolicy,
  SKPeriodUnit,
  SKProductDiscountPaymentMode,
  SKProductDiscountType,
  TransactionEnvironment,
  TransactionOwnershipType,
  TransactionType,
  UserPropertyKey
} from './enums';
import {IntroEligibility} from './IntroEligibility';
import {Offering} from './Offering';
import {Offerings} from './Offerings';
import {Product} from './Product';
import {QonversionError} from './QonversionError';
import {User} from './User';
import {UserProperty} from './UserProperty';
import {UserProperties} from './UserProperties';
import {QonversionConfigBuilder} from './QonversionConfigBuilder';
import {Experiment} from "./Experiment";
import {Transaction} from './Transaction';
import {RemoteConfig} from './RemoteConfig';
import {RemoteConfigList} from './RemoteConfigList';
import {RemoteConfigurationSource} from "./RemoteConfigurationSource";
import {ExperimentGroup} from './ExperimentGroup';
import {SubscriptionPeriod} from './SubscriptionPeriod';
import {ProductInAppDetails} from './ProductInAppDetails';
import {ProductInstallmentPlanDetails} from './ProductInstallmentPlanDetails';
import {ProductOfferDetails} from './ProductOfferDetails';
import {ProductPrice} from './ProductPrice';
import {ProductPricingPhase} from './ProductPricingPhase';
import {ProductStoreDetails} from './ProductStoreDetails';
import {PurchaseModel} from './PurchaseModel';
import {PurchaseUpdateModel} from './PurchaseUpdateModel';

export default class Qonversion {
  private constructor() {}

  private static backingInstance: QonversionApi | undefined;

  /**
   * Use this variable to get a current initialized instance of the Qonversion SDK.
   * Please, use the property only after calling {@link Qonversion.initialize}.
   * Otherwise, trying to access the variable will cause an exception.
   *
   * @return Current initialized instance of the Qonversion SDK.
   * @throws error if the instance has not been initialized
   */
  static getSharedInstance(): QonversionApi {
    if (!this.backingInstance) {
      throw "Qonversion has not been initialized. You should call " +
        "the initialize method before accessing the shared instance of Qonversion."
    }

    return this.backingInstance;
  }

  /**
   * An entry point to use Qonversion SDK. Call to initialize Qonversion SDK with required and extra configs.
   * The function is the best way to set additional configs you need to use Qonversion SDK.
   * You still have an option to set a part of additional configs later via calling separate setters.
   *
   * @param config a config that contains key SDK settings.
   *        Call {@link QonversionConfigBuilder.build} to configure and create a QonversionConfig instance.
   * @return Initialized instance of the Qonversion SDK.
   */
  static initialize(config: QonversionConfig): QonversionApi {
    this.backingInstance = new QonversionInternal(config);
    return this.backingInstance;
  }

  /**
   * Exports of library classes and enums to be accessible from Cordova application.
   */
  // DTO
  static ActionResult = ActionResult;
  static AutomationsEvent = AutomationsEvent;
  static Entitlement = Entitlement;
  static Transaction = Transaction;
  static RemoteConfig = RemoteConfig;
  static RemoteConfigList = RemoteConfigList;
  static Experiment = Experiment;
  static LaunchMode = LaunchMode;
  static Environment = Environment;
  static ProductType = ProductType;
  static EntitlementRenewState = EntitlementRenewState;
  static EntitlementSource = EntitlementSource;
  static RemoteConfigurationSource = RemoteConfigurationSource;
  static ExperimentGroup = ExperimentGroup;
  static ExperimentGroupType = ExperimentGroupType;
  static EntitlementGrantType = EntitlementGrantType;
  static TransactionEnvironment = TransactionEnvironment;
  static TransactionOwnershipType = TransactionOwnershipType;
  static TransactionType = TransactionType;
  static UserPropertyKey = UserPropertyKey;
  static UserProperty = UserProperty;
  static UserProperties = UserProperties;
  static AttributionProvider = AttributionProvider;
  static EntitlementsCacheLifetime = EntitlementsCacheLifetime;
  static SKPeriodUnit = SKPeriodUnit;
  static SKProductDiscountType = SKProductDiscountType;
  static SKProductDiscountPaymentMode = SKProductDiscountPaymentMode;
  static OfferingTag = OfferingTag;
  static IntroEligibilityStatus = IntroEligibilityStatus;
  static ActionResultType = ActionResultType;
  static AutomationsEventType = AutomationsEventType;
  static IntroEligibility = IntroEligibility;
  static Offering = Offering;
  static Offerings = Offerings;
  static Product = Product;
  static PricingPhaseRecurrenceMode = PricingPhaseRecurrenceMode;
  static PricingPhaseType = PricingPhaseType;
  static PurchaseUpdatePolicy = PurchaseUpdatePolicy;
  static ProductInAppDetails = ProductInAppDetails;
  static ProductInstallmentPlanDetails = ProductInstallmentPlanDetails;
  static ProductOfferDetails = ProductOfferDetails;
  static ProductPrice = ProductPrice;
  static ProductPricingPhase = ProductPricingPhase;
  static ProductStoreDetails = ProductStoreDetails;
  static PurchaseModel = PurchaseModel;
  static PurchaseUpdateModel = PurchaseUpdateModel;
  static QonversionError = QonversionError;
  static User = User;
  static SKProduct = SKProduct;
  static SKProductDiscount = SKProductDiscount;
  static SKSubscriptionPeriod = SKSubscriptionPeriod;
  static SkuDetails = SkuDetails;
  static SubscriptionPeriod = SubscriptionPeriod;

  // The rest
  static Config = QonversionConfig;
  static ConfigBuilder = QonversionConfigBuilder;
}

// Suppress TS warnings about window.cordova
declare let window: any; // turn off type checking
declare let module: any; // turn off type checking

if (!window.plugins) {
  window.plugins = {};
}
if (!window.plugins.Qonversion) {
  window.plugins.Qonversion = Qonversion;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = Qonversion;
}
