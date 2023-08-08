import {AttributionProvider, ProrationMode, UserPropertyKey} from "./dto/enums";
import {IntroEligibility} from "./dto/IntroEligibility";
import Mapper, {
  QEntitlement,
  QOfferings,
  QProduct,
  QRemoteConfig,
  QTrialIntroEligibility,
  QUser,
  QUserProperties
} from "./Mapper";
import {Offerings} from "./dto/Offerings";
import {Entitlement} from "./dto/Entitlement";
import {Product} from "./dto/Product";
import {callNative, DefinedNativeErrorCodes, isAndroid, isIos, noop} from "./utils";
import {PromoPurchasesListener} from './dto/PromoPurchasesListener';
import {User} from './dto/User';
import {QonversionApi} from './QonversionApi';
import {QonversionConfig} from './QonversionConfig';
import {EntitlementsUpdateListener} from './dto/EntitlementsUpdateListener';
import RemoteConfig from "./dto/RemoteConfig";
import {UserProperties} from './dto/UserProperties';

const sdkVersion = "3.0.0";

export default class QonversionInternal implements QonversionApi {

  entitlementsUpdateListener: EntitlementsUpdateListener | undefined;
  promoPurchasesListener: PromoPurchasesListener | undefined;

  constructor(qonversionConfig: QonversionConfig) {
    callNative('storeSDKInfo', ['cordova', sdkVersion]).then(noop);
    callNative<Record<string, QEntitlement>>('initializeSdk', [
      qonversionConfig.projectKey,
      qonversionConfig.launchMode,
      qonversionConfig.environment,
      qonversionConfig.entitlementsCacheLifetime,
      qonversionConfig.proxyUrl,
      qonversionConfig.kidsMode
    ]).then((updatedEntitlements) => {
      if (this.entitlementsUpdateListener) {
        const entitlements = Mapper.convertEntitlements(updatedEntitlements);
        this.entitlementsUpdateListener.onEntitlementsUpdated(entitlements);
      }
    });

    this.entitlementsUpdateListener = qonversionConfig.entitlementsUpdateListener;
  }

  syncHistoricalData () {
    callNative('syncHistoricalData').then(noop);
  }

  syncStoreKit2Purchases() {
    if (isIos()) {
      callNative('syncStoreKit2Purchases').then(noop);
    }
  }

  async purchase(productId: string): Promise<Map<string, Entitlement>> {
    return QonversionInternal.purchaseProxy(productId);
  }

  async purchaseProduct(product: Product): Promise<Map<string, Entitlement>> {
    return QonversionInternal.purchaseProxy(product.qonversionID, product.offeringId);
  }

  private static async purchaseProxy(productId: string, offeringId: string | null = null): Promise<Map<string, Entitlement>> {
    try {
      const purchasePromise = !!offeringId ?
        callNative<Record<string, QEntitlement>>('purchaseProduct', [productId, offeringId])
          :
        callNative<Record<string, QEntitlement>>('purchase', [productId]);

      const entitlements = await purchasePromise;

      // noinspection UnnecessaryLocalVariableJS
      const mappedEntitlement = Mapper.convertEntitlements(entitlements);

      return mappedEntitlement;
    } catch (e: any) {
      if (e) {
        e.userCanceled = e.code === DefinedNativeErrorCodes.PURCHASE_CANCELLED_BY_USER;
        throw e;
      } else {
        throw 'Unknown error occurred while purchase';
      }
    }
  }

  async updatePurchase(
    productId: string,
    oldProductId: string,
    prorationMode: ProrationMode | undefined
  ): Promise<Map<string, Entitlement> | null> {
    if (!isAndroid()) {
      return null;
    }

    try {
      let entitlements;
      if (!prorationMode) {
        entitlements = await callNative<Record<string, QEntitlement>>(
          'updatePurchase',
          [productId, oldProductId]
        );
      } else {
        entitlements = await callNative<Record<string, QEntitlement>>(
          'updatePurchaseWithProrationMode',
          [productId, oldProductId, prorationMode]
        );
      }

      // noinspection UnnecessaryLocalVariableJS
      const mappedEntitlement: Map<string, Entitlement> = Mapper.convertEntitlements(entitlements);

      return mappedEntitlement;
    } catch (e: any) {
      if (e) {
        e.userCanceled = e.code === DefinedNativeErrorCodes.PURCHASE_CANCELLED_BY_USER;
        throw e;
      } else {
        throw 'Unknown error occurred while purchase';
      }
    }
  }

  async updatePurchaseWithProduct(
    product: Product,
    oldProductId: String,
    prorationMode: ProrationMode | undefined
  ): Promise<Map<string, Entitlement> | null> {
    if (!isAndroid()) {
      return null;
    }

    try {
      let entitlements;
      if (!prorationMode) {
        entitlements = await callNative<Record<string, QEntitlement>>(
          'updateProductWithId',
          [product.qonversionID, product.offeringId, oldProductId]
        );
      } else {
        entitlements = await callNative<Record<string, QEntitlement>>(
          'updateProductWithIdAndProrationMode',
          [product.qonversionID, product.offeringId, oldProductId, prorationMode]
        );
      }

      // noinspection UnnecessaryLocalVariableJS
      const mappedEntitlement: Map<string, Entitlement> = Mapper.convertEntitlements(entitlements);

      return mappedEntitlement;
    } catch (e: any) {
      if (e) {
        e.userCanceled = e.code === DefinedNativeErrorCodes.PURCHASE_CANCELLED_BY_USER;
        throw e;
      } else {
        throw 'Unknown error occurred while updating purchase';
      }
    }
  }

  async products(): Promise<Map<string, Product>> {
    let products = await callNative<Record<string, QProduct>>('products');
    // noinspection UnnecessaryLocalVariableJS
    const mappedProducts: Map<string, Product> = Mapper.convertProducts(
      products
    );

    return mappedProducts;
  }

  async offerings(): Promise<Offerings | null> {
    let offerings = await callNative<QOfferings>('offerings');
    // noinspection UnnecessaryLocalVariableJS
    const mappedOfferings = Mapper.convertOfferings(offerings);

    return mappedOfferings;
  }

  async checkTrialIntroEligibility(
    ids: string[]
  ): Promise<Map<string, IntroEligibility>> {
    const eligibilityInfo = await callNative<Record<string, QTrialIntroEligibility>>(
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
    const entitlements = await callNative<Record<string, QEntitlement>>('checkEntitlements');

    // noinspection UnnecessaryLocalVariableJS
    const mappedEntitlement: Map<
      string,
      Entitlement
      > = Mapper.convertEntitlements(entitlements);

    return mappedEntitlement;
  }

  async restore(): Promise<Map<string, Entitlement>> {
    const entitlements = await callNative<Record<string, QEntitlement>>('restore');

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

    callNative('syncPurchases').then(noop);
  }

  identify(userID: string) {
    callNative('identify', [userID]).then(noop);
  }

  logout() {
    callNative('logout').then(noop);
  }

  async userInfo(): Promise<User> {
    const info = await callNative<QUser>('userInfo');

    // noinspection UnnecessaryLocalVariableJS
    const mappedUserInfo: User = Mapper.convertUserInfo(info);

    return mappedUserInfo;
  }

  async remoteConfig(): Promise<RemoteConfig> {
    let remoteConfig = await callNative<QRemoteConfig>('remoteConfig');
    // noinspection UnnecessaryLocalVariableJS
    const mappedRemoteConfig: RemoteConfig = Mapper.convertRemoteConfig(
        remoteConfig
    );

    return mappedRemoteConfig;
  }

  async attachUserToExperiment(experimentId: string, groupId: string): Promise<void> {
    await callNative('attachUserToExperiment', [experimentId, groupId]);
    return;
  }

  async detachUserFromExperiment(experimentId: string): Promise<void> {
    await callNative('detachUserFromExperiment', [experimentId]);
    return;
  }

  attribution(data: Object, provider: AttributionProvider) {
    callNative('attribution', [data, provider]).then(noop);
  }

  setUserProperty(property: UserPropertyKey, value: string) {
    if (property == UserPropertyKey.CUSTOM) {
      console.warn("Can not set user property with the key `UserPropertyKey.CUSTOM`. " +
        "To set custom user property, use the `setCustomUserProperty` method.");
      return;
    }

    callNative('setDefinedProperty', [property, value]).then(noop);
  }

  setCustomUserProperty(property: string, value: string) {
    callNative('setCustomProperty', [property, value]).then(noop);
  }

  async userProperties(): Promise<UserProperties> {
    const properties = await callNative<QUserProperties>('userProperties');
    // noinspection UnnecessaryLocalVariableJS
    const mappedUserProperties: UserProperties = Mapper.convertUserProperties(properties);

    return mappedUserProperties;
  }

  collectAdvertisingId() {
    if (isIos()) {
      callNative('collectAdvertisingId').then(noop);
    }
  }

  collectAppleSearchAdsAttribution() {
    if (isIos()) {
      callNative('collectAppleSearchAdsAttribution').then(noop);
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
    callNative<string>('subscribeOnPromoPurchases').then(productId => {
      if (this.promoPurchasesListener) {
        const promoPurchaseExecutor = async () => {
          const entitlements = await callNative<Record<string, QEntitlement>>(
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
    });
  }

  presentCodeRedemptionSheet() {
    if (isIos()) {
      callNative('presentCodeRedemptionSheet').then(noop);
    }
  }
}
