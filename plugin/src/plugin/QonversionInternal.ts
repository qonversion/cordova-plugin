import {AttributionProvider, QonversionErrorCode, UserPropertyKey} from "./enums";
import {IntroEligibility} from "./IntroEligibility";
import Mapper, {
  QEmptySuccessResult,
  QEntitlement,
  QOfferings,
  QProduct,
  QRemoteConfig,
  QRemoteConfigList,
  QTrialIntroEligibility,
  QUser,
  QUserProperties,
  QPromotionalOffer
} from "./Mapper";
import {Offerings} from "./Offerings";
import {Entitlement} from "./Entitlement";
import {Product} from "./Product";
import {callQonversionNative, isAndroid, isIos, noop, subscribeOnQonversionNativeEvents} from "./utils";
import {PromoPurchasesListener} from './PromoPurchasesListener';
import {User} from './User';
import {QonversionApi} from './QonversionApi';
import {QonversionConfig} from './QonversionConfig';
import {EntitlementsUpdateListener} from './EntitlementsUpdateListener';
import {RemoteConfig} from "./RemoteConfig";
import {RemoteConfigList} from "./RemoteConfigList";
import {UserProperties} from './UserProperties';
import {PurchaseModel} from './PurchaseModel';
import {PurchaseUpdateModel} from './PurchaseUpdateModel';
import {PurchaseOptions} from "./PurchaseOptions";
import {PurchaseOptionsBuilder} from './PurchaseOptionsBuilder';
import {SKProductDiscount} from './SKProductDiscount';
import {PromotionalOffer} from './PromotionalOffer';

const sdkVersion = "6.2.0";

export default class QonversionInternal implements QonversionApi {

  entitlementsUpdateListener: EntitlementsUpdateListener | undefined;
  promoPurchasesListener: PromoPurchasesListener | undefined;

  constructor(qonversionConfig: QonversionConfig) {
    callQonversionNative('storeSDKInfo', ['cordova', sdkVersion]).then(noop);
    subscribeOnQonversionNativeEvents<Record<string, QEntitlement>>(
      'initializeSdk',
      (updatedEntitlements) => {
        if (this.entitlementsUpdateListener) {
          const entitlements = Mapper.convertEntitlements(updatedEntitlements);
          this.entitlementsUpdateListener.onEntitlementsUpdated(entitlements);
        }
      },
      [
        qonversionConfig.projectKey,
        qonversionConfig.launchMode,
        qonversionConfig.environment,
        qonversionConfig.entitlementsCacheLifetime,
        qonversionConfig.proxyUrl,
        qonversionConfig.kidsMode
      ]
    );

    this.entitlementsUpdateListener = qonversionConfig.entitlementsUpdateListener;
  }

  syncHistoricalData () {
    callQonversionNative('syncHistoricalData').then(noop);
  }

  syncStoreKit2Purchases() {
    if (isIos()) {
      callQonversionNative('syncStoreKit2Purchases').then(noop);
    }
  }

  async getPromotionalOffer(product: Product, discount: SKProductDiscount): Promise<PromotionalOffer | null> {
    if (isAndroid()) {
      return null;
    }
    const args = [product.qonversionID, discount.identifier];
    let promoOffer = await callQonversionNative<QPromotionalOffer>('getPromotionalOffer', args);
    const mappedPromoOffer: PromotionalOffer | null = Mapper.convertPromoOffer(promoOffer);

    return mappedPromoOffer;
  }

  async purchaseProduct(product: Product, options: PurchaseOptions | undefined): Promise<Map<string, Entitlement>> {
    try {
      if (!options) {
        options = new PurchaseOptionsBuilder().build();
      }

      const promoOffer = {
        productDiscountId: options.promotionalOffer?.productDiscount.identifier,
        keyIdentifier: options.promotionalOffer?.paymentDiscount.keyIdentifier,
        nonce: options.promotionalOffer?.paymentDiscount.nonce,
        signature: options.promotionalOffer?.paymentDiscount.signature,
        timestamp: options.promotionalOffer?.paymentDiscount.timestamp
      };

      let args: any[] = [product.qonversionID]
      if (isIos()) {
        args = [...args, options.quantity, options.contextKeys, promoOffer];
      } else {
        args = [...args, options.offerId, options.applyOffer, options.oldProduct?.qonversionID, options.updatePolicy, options.contextKeys];
      }

      const entitlements = await callQonversionNative<Record<string, QEntitlement>>('purchase', args);

      // noinspection UnnecessaryLocalVariableJS
      const mappedPermissions = Mapper.convertEntitlements(entitlements);

      return mappedPermissions;
    } catch (e: any) {
      if (e) {
        e.userCanceled = e.code === QonversionErrorCode.PURCHASE_CANCELED;
        throw e;
      } else {
        throw 'Unknown error occurred while purchase';
      }
    }
  }

  async purchase(purchaseModel: PurchaseModel): Promise<Map<string, Entitlement>> {
    try {
      let args: any[] = [purchaseModel.productId]
      if (isAndroid()) {
        args = [...args, purchaseModel.offerId, purchaseModel.applyOffer, null, null, []];
      }
      const entitlements = await callQonversionNative<Record<string, QEntitlement>>('purchase', args);

      // noinspection UnnecessaryLocalVariableJS
      const mappedEntitlement = Mapper.convertEntitlements(entitlements);

      return mappedEntitlement;
    } catch (e: any) {
      if (e) {
        e.userCanceled = e.code === QonversionErrorCode.PURCHASE_CANCELED;
        throw e;
      } else {
        throw 'Unknown error occurred while purchase';
      }
    }
  }

  async updatePurchase(purchaseUpdateModel: PurchaseUpdateModel): Promise<Map<string, Entitlement> | null> {
    if (!isAndroid()) {
      return null;
    }

    try {
      const entitlements = await callQonversionNative<Record<string, QEntitlement>>(
        'updatePurchase',
        [
          purchaseUpdateModel.productId,
          purchaseUpdateModel.offerId,
          purchaseUpdateModel.applyOffer,
          purchaseUpdateModel.oldProductId,
          purchaseUpdateModel.updatePolicy,
          []
        ]
      );

      // noinspection UnnecessaryLocalVariableJS
      const mappedEntitlement: Map<string, Entitlement> = Mapper.convertEntitlements(entitlements);

      return mappedEntitlement;
    } catch (e: any) {
      if (e) {
        e.userCanceled = e.code === QonversionErrorCode.PURCHASE_CANCELED;
        throw e;
      } else {
        throw 'Unknown error occurred while purchase';
      }
    }
  }

  async products(): Promise<Map<string, Product>> {
    let products = await callQonversionNative<Record<string, QProduct>>('products');
    // noinspection UnnecessaryLocalVariableJS
    const mappedProducts: Map<string, Product> = Mapper.convertProducts(
      products
    );

    return mappedProducts;
  }

  async offerings(): Promise<Offerings | null> {
    let offerings = await callQonversionNative<QOfferings>('offerings');
    // noinspection UnnecessaryLocalVariableJS
    const mappedOfferings = Mapper.convertOfferings(offerings);

    return mappedOfferings;
  }

  async checkTrialIntroEligibility(
    ids: string[]
  ): Promise<Map<string, IntroEligibility>> {
    const eligibilityInfo = await callQonversionNative<Record<string, QTrialIntroEligibility>>(
      'checkTrialIntroEligibilityForProductIds',
      [ids]
    );

    // noinspection UnnecessaryLocalVariableJS
    const mappedEligibility: Map<
      string,
      IntroEligibility
      > = Mapper.convertEligibility(eligibilityInfo);

    return mappedEligibility;
  }

  async checkEntitlements(): Promise<Map<string, Entitlement>> {
    const entitlements = await callQonversionNative<Record<string, QEntitlement>>('checkEntitlements');

    // noinspection UnnecessaryLocalVariableJS
    const mappedEntitlement: Map<
      string,
      Entitlement
      > = Mapper.convertEntitlements(entitlements);

    return mappedEntitlement;
  }

  async restore(): Promise<Map<string, Entitlement>> {
    const entitlements = await callQonversionNative<Record<string, QEntitlement>>('restore');

    // noinspection UnnecessaryLocalVariableJS
    const mappedEntitlement: Map<
      string,
      Entitlement
    > = Mapper.convertEntitlements(entitlements);

    return mappedEntitlement;
  }

  syncPurchases() {
    if (!isAndroid()) {
      return;
    }

    callQonversionNative('syncPurchases').then(noop);
  }

  async isFallbackFileAccessible(): Promise<Boolean> {
    const isAccessibleResult = await callQonversionNative<QEmptySuccessResult>('isFallbackFileAccessible');

    return isAccessibleResult.success;
  }

  async identify(userID: string): Promise<User> {
    const info = await callQonversionNative<QUser>('identify', [userID]);

    // noinspection UnnecessaryLocalVariableJS
    const mappedUserInfo: User = Mapper.convertUserInfo(info);

    return mappedUserInfo;
  }

  logout() {
    callQonversionNative('logout').then(noop);
  }

  async userInfo(): Promise<User> {
    const info = await callQonversionNative<QUser>('userInfo');

    // noinspection UnnecessaryLocalVariableJS
    const mappedUserInfo: User = Mapper.convertUserInfo(info);

    return mappedUserInfo;
  }

  async remoteConfig(contextKey: string | undefined): Promise<RemoteConfig> {
    const remoteConfig = await callQonversionNative<QRemoteConfig>('remoteConfig', [contextKey]);
    // noinspection UnnecessaryLocalVariableJS
    const mappedRemoteConfig: RemoteConfig = Mapper.convertRemoteConfig(
        remoteConfig
    );

    return mappedRemoteConfig;
  }

  async remoteConfigList(): Promise<RemoteConfigList> {
    const remoteConfigList = await callQonversionNative<QRemoteConfigList>('remoteConfigList');
    // noinspection UnnecessaryLocalVariableJS
    const mappedRemoteConfigList: RemoteConfigList = Mapper.convertRemoteConfigList(remoteConfigList);

    return mappedRemoteConfigList;
  }

  async remoteConfigListForContextKeys(contextKeys: string[], includeEmptyContextKey: boolean): Promise<RemoteConfigList> {
    let remoteConfigList = await callQonversionNative<QRemoteConfigList>('remoteConfigListForContextKeys', [contextKeys, includeEmptyContextKey]);
    // noinspection UnnecessaryLocalVariableJS
    const mappedRemoteConfigList: RemoteConfigList = Mapper.convertRemoteConfigList(remoteConfigList);

    return mappedRemoteConfigList;
  }

  async attachUserToExperiment(experimentId: string, groupId: string): Promise<void> {
    await callQonversionNative('attachUserToExperiment', [experimentId, groupId]);
    return;
  }

  async detachUserFromExperiment(experimentId: string): Promise<void> {
    await callQonversionNative('detachUserFromExperiment', [experimentId]);
    return;
  }

  async attachUserToRemoteConfiguration(remoteConfigurationId: string): Promise<void> {
    await callQonversionNative('attachUserToRemoteConfiguration', [remoteConfigurationId]);
    return;
  }

  async detachUserFromRemoteConfiguration(remoteConfigurationId: string): Promise<void> {
    await callQonversionNative('detachUserFromRemoteConfiguration', [remoteConfigurationId]);
    return;
  }

  attribution(data: Object, provider: AttributionProvider) {
    callQonversionNative('attribution', [data, provider]).then(noop);
  }

  setUserProperty(property: UserPropertyKey, value: string) {
    if (property == UserPropertyKey.CUSTOM) {
      console.warn("Can not set user property with the key `UserPropertyKey.CUSTOM`. " +
        "To set custom user property, use the `setCustomUserProperty` method.");
      return;
    }

    callQonversionNative('setDefinedProperty', [property, value]).then(noop);
  }

  setCustomUserProperty(property: string, value: string) {
    callQonversionNative('setCustomProperty', [property, value]).then(noop);
  }

  async userProperties(): Promise<UserProperties> {
    const properties = await callQonversionNative<QUserProperties>('userProperties');
    // noinspection UnnecessaryLocalVariableJS
    const mappedUserProperties: UserProperties = Mapper.convertUserProperties(properties);

    return mappedUserProperties;
  }

  collectAdvertisingId() {
    if (isIos()) {
      callQonversionNative('collectAdvertisingId').then(noop);
    }
  }

  collectAppleSearchAdsAttribution() {
    if (isIos()) {
      callQonversionNative('collectAppleSearchAdsAttribution').then(noop);
    }
  }

  setEntitlementsUpdateListener(listener: EntitlementsUpdateListener): void {
    this.entitlementsUpdateListener = listener;
  }

  setPromoPurchasesDelegate(delegate: PromoPurchasesListener) {
    if (!isIos()) {
      return;
    }

    this.promoPurchasesListener = delegate;
    subscribeOnQonversionNativeEvents<string>(
      'subscribeOnPromoPurchases',
      productId => {
        if (this.promoPurchasesListener) {
          const promoPurchaseExecutor = async () => {
            const entitlements = await callQonversionNative<Record<string, QEntitlement>>(
              'promoPurchase',
              [productId],
            );

            // noinspection UnnecessaryLocalVariableJS
            const mappedEntitlement: Map<string,
              Entitlement> = Mapper.convertEntitlements(entitlements);

            return mappedEntitlement;
          };
          this.promoPurchasesListener.onPromoPurchaseReceived(
            productId,
            promoPurchaseExecutor,
          );
        }
      }
    );
  }

  presentCodeRedemptionSheet() {
    if (isIos()) {
      callQonversionNative('presentCodeRedemptionSheet').then(noop);
    }
  }
}
