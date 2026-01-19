import {PurchaseDelegate} from './PurchaseDelegate';
import {ScreenPresentationConfig} from './ScreenPresentationConfig';

export interface NoCodesApi {
  /**
   * Set the configuration of screen representation.
   * @param config a configuration to apply.
   * @param contextKey the context key of the screen, to which a config should be applied.
   *                   If not provided, the config is used for all the screens.
   */
  setScreenPresentationConfig(config: ScreenPresentationConfig, contextKey?: string): void;

  /**
   * Show the screen using its context key.
   * @param contextKey the context key of the screen which must be shown
   */
  showScreen(contextKey: string): void;

  /**
   * Close the current opened No-Code screen.
   */
  close(): void;

  /**
   * Set the locale for No-Code screens.
   * Use this to override the device locale for the No-Codes SDK.
   * Pass null to reset to the device default locale.
   *
   * @param locale the locale to use (e.g. "en", "de", "fr"), or null to reset to device default.
   */
  setLocale(locale: string | null): void;

  /**
   * Set a custom purchase delegate to handle purchases and restores from No-Code screens.
   * When this delegate is set, it replaces the default Qonversion SDK purchase flow,
   * allowing you to use your own purchase system.
   *
   * @param delegate the purchase delegate to handle purchase and restore events.
   */
  setPurchaseDelegate(delegate: PurchaseDelegate): void;
}
