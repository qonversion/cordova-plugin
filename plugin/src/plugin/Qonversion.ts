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
  EntitlementRenewState,
  EntitlementsCacheLifetime,
  EntitlementSource,
  Environment,
  IntroEligibilityStatus,
  LaunchMode,
  OfferingTag,
  ProductDuration,
  ProductType,
  ProrationMode,
  SKPeriodUnit,
  SKProductDiscountPaymentMode,
  SKProductDiscountType,
  TrialDuration,
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
  static LaunchMode = LaunchMode;
  static Environment = Environment;
  static ProductType = ProductType;
  static ProductDuration = ProductDuration;
  static TrialDuration = TrialDuration;
  static EntitlementRenewState = EntitlementRenewState;
  static EntitlementSource = EntitlementSource;
  static UserPropertyKey = UserPropertyKey;
  static UserProperty = UserProperty;
  static UserProperties = UserProperties;
  static AttributionProvider = AttributionProvider;
  static ProrationMode = ProrationMode;
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
  static QonversionError = QonversionError;
  static User = User;
  static SKProduct = SKProduct;
  static SKProductDiscount = SKProductDiscount;
  static SKSubscriptionPeriod = SKSubscriptionPeriod;
  static SkuDetails = SkuDetails;

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
