import {NoCodesListener} from "./NoCodesListener";
import {PurchaseDelegate} from "./PurchaseDelegate";
import Mapper, {QNoCodeEvent, QProduct} from "./Mapper";
import {NoCodesApi} from './NoCodesApi';
import {NoCodesConfig} from './NoCodesConfig';
import {ScreenPresentationConfig} from './ScreenPresentationConfig';
import {NoCodesError} from './NoCodesError';
import {NoCodesErrorCode} from './enums';
import {callNoCodesNative, noop, subscribeOnNoCodesNativeEvents} from './utils';

const EVENT_SCREEN_SHOWN = "nocodes_screen_shown";
const EVENT_FINISHED = "nocodes_finished";
const EVENT_ACTION_STARTED = "nocodes_action_started";
const EVENT_ACTION_FAILED = "nocodes_action_failed";
const EVENT_ACTION_FINISHED = "nocodes_action_finished";
const EVENT_SCREEN_FAILED_TO_LOAD = "nocodes_screen_failed_to_load";

const SDK_VERSION = "1.0.0";
const SDK_SOURCE = "cordova";

export default class NoCodesInternal implements NoCodesApi {

  private noCodesListener: NoCodesListener | null = null;
  private purchaseDelegate: PurchaseDelegate | null = null;

  constructor(config: NoCodesConfig) {
    callNoCodesNative('initialize', [
      config.projectKey,
      SDK_SOURCE,
      SDK_VERSION,
      config.proxyUrl ?? null,
      config.locale ?? null
    ]).then(noop);

    if (config.noCodesListener) {
      this.setNoCodesListener(config.noCodesListener);
    }

    if (config.purchaseDelegate) {
      this.setPurchaseDelegate(config.purchaseDelegate);
    }
  }

  setScreenPresentationConfig(config: ScreenPresentationConfig, contextKey?: string): void {
    const data = Mapper.convertScreenPresentationConfig(config);
    callNoCodesNative('setScreenPresentationConfig', [data, contextKey]).then(noop);
  }

  async showScreen(contextKey: string): Promise<void> {
    return await callNoCodesNative('showScreen', [contextKey]);
  }

  async close(): Promise<void> {
    return await callNoCodesNative('close');
  }

  setLocale(locale: string | null): void {
    callNoCodesNative('setLocale', [locale]).then(noop);
  }

  setPurchaseDelegate(delegate: PurchaseDelegate): void {
    this.purchaseDelegate = delegate;
    subscribeOnNoCodesNativeEvents<QProduct>('subscribePurchase', this.onPurchaseEvent);
    subscribeOnNoCodesNativeEvents<void>('subscribeRestore', this.onRestoreEvent);
    callNoCodesNative('setPurchaseDelegate').then(noop);
  }

  private setNoCodesListener(listener: NoCodesListener) {
    if (this.noCodesListener == null) {
      subscribeOnNoCodesNativeEvents<QNoCodeEvent>('subscribe', this.onNativeEvent);
    }
    this.noCodesListener = listener;
  }

  private onNativeEvent = (event: QNoCodeEvent) => {
    switch (event.event) {
      case EVENT_SCREEN_SHOWN:
        const screenId = event.payload?.screenId ?? "";
        this.noCodesListener?.onScreenShown(screenId);
        break;
      case EVENT_ACTION_STARTED:
        const actionStarted = Mapper.convertAction(event.payload);
        this.noCodesListener?.onActionStartedExecuting(actionStarted);
        break;
      case EVENT_ACTION_FAILED:
        const actionFailed = Mapper.convertAction(event.payload);
        this.noCodesListener?.onActionFailedToExecute(actionFailed);
        break;
      case EVENT_ACTION_FINISHED:
        const actionFinished = Mapper.convertAction(event.payload);
        this.noCodesListener?.onActionFinishedExecuting(actionFinished);
        break;
      case EVENT_FINISHED:
        this.noCodesListener?.onFinished();
        break;
      case EVENT_SCREEN_FAILED_TO_LOAD:
        const error = Mapper.convertNoCodesError(event.payload);
        const defaultError = new NoCodesError(
          NoCodesErrorCode.UNKNOWN,
          "Failed to load No-Code screen",
          "Native error parsing failed."
        );
        this.noCodesListener?.onScreenFailedToLoad(error ?? defaultError);
        break;
      default:
        console.warn(`No-Codes SDK: Unknown event: ${event.event}`);
        break;
    }
  }

  private onPurchaseEvent = async (productData: QProduct) => {
    if (!this.purchaseDelegate) {
      callNoCodesNative('delegatedPurchaseFailed', ['PurchaseDelegate is not set']).then(noop);
      return;
    }

    try {
      const product = Mapper.convertProduct(productData);
      await this.purchaseDelegate.purchase(product);
      await callNoCodesNative('delegatedPurchaseCompleted');
    } catch (error: any) {
      await callNoCodesNative('delegatedPurchaseFailed', [error?.message ?? 'Unknown error']);
    }
  }

  private onRestoreEvent = async () => {
    if (!this.purchaseDelegate) {
      callNoCodesNative('delegatedRestoreFailed', ['PurchaseDelegate is not set']).then(noop);
      return;
    }

    try {
      await this.purchaseDelegate.restore();
      await callNoCodesNative('delegatedRestoreCompleted');
    } catch (error: any) {
      await callNoCodesNative('delegatedRestoreFailed', [error?.message ?? 'Unknown error']);
    }
  }
}
