import {EntitlementsCacheLifetime, Environment, LaunchMode} from './enums';
import {EntitlementsUpdateListener} from './EntitlementsUpdateListener';
import {DeferredPurchasesListener} from './DeferredPurchasesListener';

export class QonversionConfig {
  readonly projectKey: string;
  readonly launchMode: LaunchMode;
  readonly environment: Environment;
  readonly entitlementsCacheLifetime: EntitlementsCacheLifetime;
  readonly entitlementsUpdateListener: EntitlementsUpdateListener | undefined;
  readonly deferredPurchasesListener: DeferredPurchasesListener | undefined;
  readonly proxyUrl: string | undefined;
  readonly kidsMode: boolean;

  constructor(
    projectKey: string,
    launchMode: LaunchMode,
    environment: Environment = Environment.PRODUCTION,
    entitlementsCacheLifetime: EntitlementsCacheLifetime = EntitlementsCacheLifetime.MONTH,
    entitlementsUpdateListener: EntitlementsUpdateListener | undefined = undefined,
    deferredPurchasesListener: DeferredPurchasesListener | undefined = undefined,
    proxyUrl: string | undefined,
    kidsMode: boolean = false
  ) {
    this.projectKey = projectKey;
    this.launchMode = launchMode;
    this.environment = environment;
    this.entitlementsCacheLifetime = entitlementsCacheLifetime;
    this.entitlementsUpdateListener = entitlementsUpdateListener;
    this.deferredPurchasesListener = deferredPurchasesListener;
    this.proxyUrl = proxyUrl;
    this.kidsMode = kidsMode;
  }
}
